import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error("Missing Supabase Service Role Key or URL.");
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createAdminClient(supabaseUrl, supabaseServiceRoleKey);

    try {
        const supabase = await createClient();
        const { data: userData, error: authError } = await supabase.auth.getUser();

        if (authError || !userData.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = userData.user.id;
        const { group_id, content } = await req.json();

        if (!group_id || !content) {
            return NextResponse.json({ error: 'Missing group_id or content' }, { status: 400 });
        }

        // 1. Run OpenAI Moderation
        const moderationResponse = await openai.moderations.create({ input: content });
        const isAbusive = moderationResponse.results[0].flagged;

        if (isAbusive) {
            // Log the strike
            const { data: currentStrikeData } = await supabaseAdmin
                .from('user_strikes')
                .select('strike_count')
                .eq('user_id', userId)
                .single();

            const currentStrikes = currentStrikeData?.strike_count || 0;
            const newStrikeCount = currentStrikes + 1;

            await supabaseAdmin.from('user_strikes').upsert({
                user_id: userId,
                strike_count: newStrikeCount,
                last_strike_at: new Date().toISOString()
            });

            // If threshold reached (1), notify admin by creating an alert
            if (newStrikeCount >= 1) {
                await supabaseAdmin.from('admin_alerts').insert({
                    user_id: userId,
                    alert_type: 'ABUSIVE_USER',
                    message: `User ${userId} has submitted abusive content and reached ${newStrikeCount} strike(s). Content flagged: ${JSON.stringify(moderationResponse.results[0].categories)}`
                });

                // You could also hook up Resend/SendGrid right here to email process.env.ADMIN_EMAIL
            }

            return NextResponse.json({
                error: 'Your whisper violated community guidelines and was blocked. A strike has been recorded on your account.',
                strike: true
            }, { status: 403 });
        }

        // 2. Clear content, insert into database using the standard client (respects RLS)
        const newWhisperId = crypto.randomUUID();
        const { error: insertError } = await supabase.from('whispers').insert({
            id: newWhisperId,
            group_id: group_id,
            author_id: userId,
            content: content
        });

        if (insertError) {
            console.error(insertError);
            return NextResponse.json({ error: 'Failed to save whisper.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: newWhisperId });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
