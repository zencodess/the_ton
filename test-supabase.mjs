import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log("Auth User:", user?.id, "Error:", authError);
    
    const { data, error } = await supabase.from('groups').insert({
      id: "11111111-1111-1111-1111-111111111111",
      invite_code: "123456",
      name: 'Test',
      dynamic: 'other',
      created_by: '11111111-1111-1111-1111-111111111111'
    });
    
    console.log("Group insert result:", data, error);
  } catch(e) {
    console.log("Caught exception:", e);
  }
}

await run();
