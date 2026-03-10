import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// We need an admin client to insert into admin_alerts, which is protected by RLS
const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

        // Insert export request into the admin_alerts table
        const { error: insertError } = await supabaseAdmin.from('admin_alerts').insert({
            user_id: userId,
            alert_type: 'DATA_EXPORT_REQUEST',
            message: `User ${profile?.display_name || userId} has requested a GDPR data export. Please manually compile their profile, whispers, and group memberships and email it to them.`
        });

        if (insertError) {
            console.error("Error logging export request:", insertError);
            return NextResponse.json({ error: 'Failed to lodge your data request with administration.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Data export request submitted to administration.' });

    } catch (error: any) {
        console.error("API Error (Export Data):", error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
