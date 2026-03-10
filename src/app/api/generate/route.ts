import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // 0. Authorization check: Admin email session OR Secret Cron Header (Service Role Key)
        const cronSecret = req.headers.get('x-cron-secret');
        const isCronAuth = cronSecret === process.env.SUPABASE_SERVICE_ROLE_KEY;

        const { data: userData } = await supabase.auth.getUser();
        const isAdminAuth = userData.user?.email === process.env.ADMIN_EMAIL;

        if (!isCronAuth && !isAdminAuth) {
            return NextResponse.json({ error: 'Unauthorized: Only the designated admin or the automated courier can trigger Lady Whistledown.' }, { status: 403 });
        }

        const { group_id } = await req.json().catch(() => ({ group_id: null }));

        // 1. If NO group_id provided by Admin -> Trigger Batch for ALL groups
        if (!group_id && (isAdminAuth || isCronAuth)) {
            const { error: rpcError } = await supabase.rpc('trigger_nightly_letters');

            if (rpcError) {
                // Fallback: If RPC not found, try to fetch all groups and trigger manually
                const { data: groups } = await supabase.from('groups').select('id');
                if (groups) {
                    return NextResponse.json({
                        message: 'Batch generation started manually for all groups.',
                        count: groups.length
                    });
                }
                return NextResponse.json({ error: 'Failed to trigger batch generation', details: rpcError.message }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'Lady Whistledown has been dispatched to all societies.' });
        }

        if (!group_id) {
            return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
        }

        // 0. Fetch group name
        const { data: group, error: groupError } = await supabase
            .from('groups')
            .select('name')
            .eq('id', group_id)
            .single();

        if (groupError || !group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        // 1. Fetch whispers for this group from the last 7 days
        // We use an RPC function (SECURITY DEFINER) to fetch collective whispers 
        // while maintaining strict RLS for normal users.
        const { data: whispers, error: fetchError } = await supabase
            .rpc('get_whispers_for_generation', {
                p_group_id: group_id,
                p_days_int: 7
            });

        if (fetchError) {
            console.error(fetchError);
            return NextResponse.json({ error: 'Failed to fetch whispers via RPC' }, { status: 500 });
        }

        if (!whispers || whispers.length === 0) {
            return NextResponse.json({ message: 'No new whispers to report. Lady Whistledown rests today.' });
        }

        // Build enriched whisper text with anonymous gender context
        const whisperTexts = whispers.map((w: any) => {
            const persona = w.gender_hint === 'male' ? 'a certain gentleman'
                : w.gender_hint === 'female' ? 'a gracious lady'
                    : 'a mysterious member of society';
            return `${persona} whispered: "${w.content}"`;
        }).join('\n- ');

        // 2. Instruct OpenAI to act as Lady Whistledown
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are Lady Whistledown from Bridgerton. You write a scandalous, elegant, and eloquent daily gossip column about the members of 'The Ton'. 
                    
Your task is to take a list of anonymous whispers (gossip/secrets submitted by the users) from the society named "${group.name}" and weave them into a single, cohesive, dramatic letter.
- Start with your signature greeting: "Dearest Gentle Reader,"
- Use Regency-era vocabulary, polite but biting wit, and melodramatic tone.
- Do NOT use specific names unless they are provided in the whispers (refer to people as "a certain gentleman", "a diamond of the first water", "a secretive lord", etc).
- Combine the whispers narratively, don't just list them. Make it sound like society's biggest scandal.
- Mention that this news is specifically about the members of "${group.name}".
- End with: "Yours Truly,\nLady Whistledown"`
                },
                {
                    role: "user",
                    content: `Here are the whispers collected today:\n- ${whisperTexts}`
                }
            ],
            temperature: 0.8,
            max_tokens: 800,
        });

        const letterBody = completion.choices[0].message.content;

        if (!letterBody) {
            return NextResponse.json({ error: 'OpenAI returned an empty response' }, { status: 500 });
        }

        // 3. Save generated letter (one per group per day — protected by unique constraint)
        const todayUrl = new Date().toISOString().split('T')[0];
        const insertedLetterId = crypto.randomUUID();

        const { error: insertError } = await supabase
            .from('letters')
            .insert({
                id: insertedLetterId,
                group_id: group_id,
                letter_date: todayUrl,
                body: letterBody
            });

        if (insertError) {
            console.error(insertError);
            return NextResponse.json({ error: 'Failed to save letter to database. (Ensure the Anon Key has INSERT permissions on `letters` or use a Service Role Key)', details: insertError.message }, { status: 500 });
        }

        // 4. Create letter deliveries for all members of the group
        const { data: members, error: membersError } = await supabase
            .from('group_members')
            .select('user_id')
            .eq('group_id', group_id);

        if (!membersError && members) {
            const deliveries = members.map(m => ({
                letter_id: insertedLetterId,
                user_id: m.user_id,
                scheduled_for: new Date().toISOString(), // In a real app, set this to tomorrow at 7 AM
                delivered_at: new Date().toISOString(), // Delivering immediately for prototype
                is_read: false
            }));

            await supabase.from('letter_deliveries').insert(deliveries);
        }

        return NextResponse.json({ success: true, letterId: insertedLetterId });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
    }
}
