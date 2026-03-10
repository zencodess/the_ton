
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: userData, error: authError } = await supabase.auth.getUser();

        if (authError || !userData.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { group_id, group_name, reason } = await req.json();

        if (!group_id || !group_name || !reason) {
            return NextResponse.json({ error: 'Missing report data.' }, { status: 400 });
        }

        // Insert report into the admin_alerts table using standard client
        const { error: insertError } = await supabase.from('admin_alerts').insert({
            user_id: userData.user.id, // The user submitting the report
            alert_type: 'SOCIETY_REPORT',
            message: `Society "${group_name}"(${group_id}) was reported.Reason: ${reason} `
        });

        if (insertError) {
            console.error("Error logging report:", insertError);
            return NextResponse.json({ error: 'Failed to submit report to administration.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Report submitted successfully.' });

    } catch (error: any) {
        console.error("API Error (Report):", error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
