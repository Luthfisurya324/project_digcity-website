const { createClient } = require('@supabase/supabase-js');

// Load env vars
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function linkDuesToMembers() {
    console.log('Starting linking process...');

    // 1. Fetch all members
    const { data: members, error: membersError } = await supabase
        .from('organization_members')
        .select('id, full_name');

    if (membersError) {
        console.error('Error fetching members:', membersError);
        return;
    }
    console.log(`Fetched ${members.length} members.`);

    // 2. Fetch dues with null member_id
    const { data: dues, error: duesError } = await supabase
        .from('member_dues')
        .select('*')
        .is('member_id', null);

    if (duesError) {
        console.error('Error fetching orphaned dues:', duesError);
        return;
    }
    console.log(`Found ${dues.length} dues with null member_id.`);

    // 3. Match and Update
    let updatedCount = 0;
    for (const due of dues) {
        // Debug specific name
        if (due.member_name.includes('Fahtir')) {
            console.log(`DEBUG: Checking '${due.member_name}'`);
            const targetMember = members.find(m => m.full_name.includes('Fahtir'));
            if (targetMember) {
                console.log(`  Target in DB: '${targetMember.full_name}'`);
                console.log(`  Due Name Codes: ${due.member_name.split('').map(c => c.charCodeAt(0)).join(',')}`);
                console.log(`  DB Name Codes:  ${targetMember.full_name.split('').map(c => c.charCodeAt(0)).join(',')}`);
                console.log(`  Comparison: '${due.member_name.trim().toLowerCase()}' === '${targetMember.full_name.trim().toLowerCase()}' is ${due.member_name.trim().toLowerCase() === targetMember.full_name.trim().toLowerCase()}`);
            } else {
                console.log('  Target NOT FOUND in DB list');
            }
            break; // Stop after debugging this one
        }

        // Simple name matching (case-insensitive)
        const match = members.find(m => m.full_name.trim().toLowerCase() === due.member_name.trim().toLowerCase());

        if (match) {
            console.log(`Linking due ${due.id} (${due.member_name}) to member ${match.id} (${match.full_name})`);
            const { error: updateError } = await supabase
                .from('member_dues')
                .update({ member_id: match.id })
                .eq('id', due.id);

            if (updateError) {
                console.error(`Failed to update due ${due.id}:`, updateError);
            } else {
                updatedCount++;
            }
        } else {
            console.warn(`No match found for due ${due.id} (${due.member_name})`);
        }
    }

    console.log(`Finished. Linked ${updatedCount} dues.`);
}

linkDuesToMembers();
