const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    await supabase.auth.signInWithPassword({
        email: 'test_whisper_debug@example.com',
        password: 'Password123!'
    });
    const { data: userData } = await supabase.auth.getUser();

    // Check if we can SELECT the group we just made
    const { data, error } = await supabase.from('groups').select('*').eq('created_by', userData.user.id);
    console.log("SELECT groups for our user ID:");
    console.log("Data:", data);
    console.log("Error:", error);
}
run();
