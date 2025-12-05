const { createClient } = require('@supabase/supabase-js');

// Load env vars
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function debug() {
    // Try to fetch organization profile to get owner_user_id
    const { data: profile, error } = await supabase
        .from('organization_profile')
        .select('owner_user_id')
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
    } else if (profile) {
        console.log('Found owner_user_id:', profile.owner_user_id);
    } else {
        console.log('No profile found.');
    }
}

debug();
