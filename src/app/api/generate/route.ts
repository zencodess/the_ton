import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// We bypass RLS for this internal generation script using the Service Role Key
// Since the user only provided the anon key, we'll try to use that for prototype purposes, 
// but in a production app, SUPABASE_SERVICE_ROLE_KEY is required to insert into `letters` without an RLS policy.
// For this prototype, we'll use the anon key. If it fails, we will instruct the user to run an RLS policy SQL command.

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    try {
        const { group_id } = await req.json();

        if (!group_id) {
            return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
        }

        // 1. Fetch whispers for this group from the last 24 hours
        // We use the anonymous_whispers view to ensure authors are hidden even from the AI.
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const { data: whispers, error: fetchError } = await supabase
            .from('anonymous_whispers')
            .select('content')
            .eq('group_id', group_id)
            .gte('created_at', yesterday.toISOString());

        if (fetchError) {
            console.error(fetchError);
            return NextResponse.json({ error: 'Failed to fetch whispers' }, { status: 500 });
        }

        if (!whispers || whispers.length === 0) {
            return NextResponse.json({ message: 'No new whispers to report. Lady Whistledown rests today.' });
        }

        const whisperTexts = whispers.map(w => w.content).join('\n- ');

        // 2. Instruct OpenAI to act as Lady Whistledown
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are Lady Whistledown from Bridgerton. You write a scandalous, elegant, and eloquent daily gossip column about the members of 'The Ton' (in this case, a modern group of friends or coworkers). 
                    
Your task is to take a list of anonymous whispers (gossip/secrets submitted by the users) and weave them into a single, cohesive, dramatic letter.
- Start with your signature greeting: "Dearest Gentle Reader,"
- Use Regency-era vocabulary, polite but biting wit, and melodramatic tone.
- Do NOT use specific names unless they are provided in the whispers (refer to people as "a certain gentleman", "a diamond of the first water", "a secretive lord", etc).
- Combine the whispers narratively, don't just list them. Make it sound like society's biggest scandal.
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

        // 3. Save the generated letter to the database
        const todayUrl = new Date().toISOString().split('T')[0];

        const { data: insertedLetter, error: insertError } = await supabase
            .from('letters')
            .insert({
                group_id: group_id,
                letter_date: todayUrl,
                body: letterBody
            })
            .select()
            .single();

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
                letter_id: insertedLetter.id,
                user_id: m.user_id,
                scheduled_for: new Date().toISOString(), // In a real app, set this to tomorrow at 7 AM
                delivered_at: new Date().toISOString(), // Delivering immediately for prototype
                is_read: false
            }));

            await supabase.from('letter_deliveries').insert(deliveries);
        }

        return NextResponse.json({ success: true, letter: insertedLetter });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
    }
}
