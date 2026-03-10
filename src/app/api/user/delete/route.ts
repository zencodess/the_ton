import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: userData, error: authError } = await supabase.auth.getUser();

        if (authError || !userData.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = userData.user.id;

        // Fetch user data for context in the alert
        const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', userId).single();

        // Insert deletion request into the admin_alerts table using standard client
        const { error: insertError } = await supabase.from('admin_alerts').insert({
            user_id: userId,
            alert_type: 'ACCOUNT_DELETION_REQUEST',
            message: `User ${profile?.display_name || userId} has requested to PERMANENTLY DELETE their account and all associated data.`
        });

        if (insertError) {
            console.error("Failed to log deletion request:", insertError);
            return NextResponse.json({ error: 'Failed to submit your deletion request.' }, { status: 500 });
        }

        // We don't sign them out immediately since the admin needs time to process it,
        // but we return a success message indicating the request is pending.
        return NextResponse.json({ success: true, message: 'Account deletion request submitted to administration.' });

    } catch (error: any) {
        console.error("API Error (Delete User Request):", error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
