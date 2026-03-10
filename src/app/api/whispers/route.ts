import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
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
            // Log the strike using the secure database function
            const { data: newStrikeCount, error: rpcError } = await supabase.rpc('increment_user_strike');

            if (rpcError) {
                console.error("Failed to increment strike:", rpcError);
            }

            // If threshold reached (1), notify admin by creating an alert using the standard client
            if (newStrikeCount && newStrikeCount >= 1) {
                await supabase.from('admin_alerts').insert({
                    user_id: userId,
                    alert_type: 'ABUSIVE_USER',
                    message: `User ${userId} has submitted abusive content and reached ${newStrikeCount} strike(s). Content flagged: ${JSON.stringify(moderationResponse.results[0].categories)}`
                });
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
