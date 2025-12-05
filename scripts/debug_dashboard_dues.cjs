const { createClient } = require('@supabase/supabase-js');

// Load env vars
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function debugDashboardDues() {
    console.log('Starting debug...');

    // 1. Fetch a user to test with (or list all users to find one with dues)
    // Since we don't know which user is logged in, let's look at member_dues first to find a member with unpaid dues.

    const { data: unpaidDues, error: duesError } = await supabase
        .from('member_dues')
        .select('*')
        .neq('status', 'paid')
        .limit(5);

    if (duesError) {
        console.error('Error fetching unpaid dues:', duesError);
        return;
    }

    if (unpaidDues.length === 0) {
        console.log('No unpaid dues found in the system to test with.');
        return;
    }

    console.log(`Found ${unpaidDues.length} unpaid dues.`);
    const targetDue = unpaidDues[0];
    console.log('Target Due:', targetDue);

    // 2. Find the member associated with this due
    let memberId = targetDue.member_id;
    let memberName = targetDue.member_name;

    console.log(`Checking Member: ID=${memberId}, Name=${memberName}`);

    let member = null;
    if (memberId) {
        const { data: m, error: mError } = await supabase
            .from('organization_members')
            .select('*')
            .eq('id', memberId)
            .single();
        if (mError) console.error('Error fetching member by ID:', mError);
        else member = m;
    } else {
        console.log('Due has no member_id, searching by name...');
        const { data: m, error: mError } = await supabase
            .from('organization_members')
            .select('*')
            .ilike('full_name', memberName)
            .single();
        if (mError) console.error('Error fetching member by Name:', mError);
        else member = m;
    }

    if (!member) {
        console.error('Could not find member record for this due.');
        return;
    }

    console.log('Found Member:', member);

    // 3. Simulate Dashboard Logic: Get Member by Email
    // The dashboard uses `membersAPI.getMemberByEmail(user.email)`
    // So we need to check if this member has an email, and if `get_member_by_email` works for it.

    if (!member.email) {
        console.error('Member has no email address. Dashboard cannot link user to member.');
        return;
    }

    console.log(`Testing get_member_by_email RPC with email: ${member.email}`);
    const { data: rpcMember, error: rpcError } = await supabase.rpc('get_member_by_email', { email_input: member.email });

    if (rpcError) {
        console.error('RPC Error:', rpcError);
    } else if (!rpcMember) {
        console.error('RPC returned null. The function might be failing to match the email.');
    } else {
        console.log('RPC Success. Returned Member:', rpcMember);
        if (rpcMember.id === member.id) {
            console.log('SUCCESS: RPC correctly identified the member.');
        } else {
            console.error('MISMATCH: RPC returned a different member ID.');
        }
    }

    // 4. Check dues fetching by member ID
    console.log(`Fetching dues for Member ID: ${member.id}`);
    const { data: myDues, error: myDuesError } = await supabase
        .from('member_dues')
        .select('*')
        .eq('member_id', member.id);

    if (myDuesError) {
        console.error('Error fetching dues by member ID:', myDuesError);
    } else {
        console.log(`Found ${myDues.length} dues for this member.`);
        const unpaid = myDues.filter(d => d.status !== 'paid');
        console.log(`Unpaid count: ${unpaid.length}`);
        if (unpaid.length > 0) {
            console.log('Dashboard SHOULD show these dues.');
        } else {
            console.log('Dashboard would show "Lunas" (incorrectly if we expected unpaid).');
        }
    }
}

debugDashboardDues();
