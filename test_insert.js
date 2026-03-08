const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test_whisper_debug@example.com',
        password: 'Password123!'
    });
    
    if (authError) {
        await supabase.auth.signUp({
            email: 'test_whisper_debug@example.com',
            password: 'Password123!',
            options: { data: { display_name: 'Debug User' } }
        });
        await new Promise(r => setTimeout(r, 1000));
        await supabase.auth.signInWithPassword({
            email: 'test_whisper_debug@example.com',
            password: 'Password123!'
        });
    }

    const { data: userData } = await supabase.auth.getUser();
    console.log("User ID:", userData?.user?.id);

    if (userData?.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: userData.user.id,
            display_name: 'Debug User'
        });
        console.log("Profile Upsert:", profileError ? profileError : "Success");
        
        const { data, error } = await supabase.from('groups').insert({ 
            name: 'Debug Ton', 
            created_by: userData.user.id 
        }).select('id');
        
        console.log("Group insert Error object:", error);
    }
}
run();
