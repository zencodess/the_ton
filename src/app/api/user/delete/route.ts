import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    // Instantiate inside the function to ensure env vars are loaded by Next.js
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    try {
        const supabase = await createClient();
        const { data: userData, error: authError } = await supabase.auth.getUser();

        if (authError || !userData.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = userData.user.id;

        // 1. Delete the user from Auth.
        // Doing this cascades down to Profiles, Group_Members, and Whispers if ON DELETE CASCADE is set up right
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
            console.error("Failed to delete user structure:", deleteError);
            return NextResponse.json({ error: 'Failed to erase account.' }, { status: 500 });
        }

        // 2. Sign out the local session
        await supabase.auth.signOut();

        return NextResponse.json({ success: true, message: 'Account erased permanently.' });

    } catch (error: any) {
        console.error("API Error (Delete User):", error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
