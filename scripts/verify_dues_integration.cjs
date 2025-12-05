const { createClient } = require('@supabase/supabase-js');

// Load env vars
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyDuesIntegration() {
    console.log('Starting verification...');

    // 1. Create a Due with 'paid' status
    console.log('1. Creating Paid Due...');
    const invoiceNum = `TEST-INV-${Date.now()}`;

    // Simulate frontend logic: Create Transaction first
    const { data: user } = await supabase.auth.getUser(); // This might fail if script doesn't have session, but we use service role key so we can fake user id or just pick one.

    // Get a user ID
    const { data: users } = await supabase.from('auth.users').select('id').limit(1);
    const userId = users && users[0] ? users[0].id : '00000000-0000-0000-0000-000000000000';

    const { data: tx, error: txError } = await supabase
        .from('finance_transactions')
        .insert([{
            type: 'income',
            amount: 50000,
            category: 'Iuran Anggota',
            description: `Pembayaran Test User (${invoiceNum})`,
            date: new Date().toISOString().slice(0, 10),
            sub_account: 'Kas Inti',
            created_by: userId
        }])
        .select()
        .single();

    if (txError) {
        console.error('Failed to create transaction:', txError);
        return;
    }
    console.log('Transaction created:', tx.id);

    // Create Due linked to transaction
    const { data: due, error: dueError } = await supabase
        .from('member_dues')
        .insert([{
            member_name: 'Test User',
            division: 'Inti',
            amount: 50000,
            due_date: new Date().toISOString().slice(0, 10),
            status: 'paid',
            invoice_number: invoiceNum,
            transaction_id: tx.id
        }])
        .select()
        .single();

    if (dueError) {
        console.error('Failed to create due:', dueError);
        return;
    }
    console.log('Due created:', due.id, 'linked to', due.transaction_id);

    // 2. Verify Balance (Simulated)
    // In real app, we check if transaction exists.
    const { data: checkTx } = await supabase.from('finance_transactions').select('*').eq('id', tx.id).single();
    if (checkTx) {
        console.log('Transaction exists in finance table. Balance would be updated.');
    } else {
        console.error('Transaction missing!');
    }

    // 3. Update Due to 'unpaid' (Simulate Revert)
    console.log('3. Reverting to Unpaid...');
    // Frontend logic: Delete transaction, update due
    const { error: delTxError } = await supabase.from('finance_transactions').delete().eq('id', tx.id);
    if (delTxError) console.error('Failed to delete transaction:', delTxError);
    else console.log('Transaction deleted.');

    const { data: updatedDue, error: updateError } = await supabase
        .from('member_dues')
        .update({ status: 'unpaid', transaction_id: null })
        .eq('id', due.id)
        .select()
        .single();

    if (updateError) console.error('Failed to update due:', updateError);
    else console.log('Due updated to:', updatedDue.status, 'Transaction ID:', updatedDue.transaction_id);

    // 4. Verify Transaction Deleted
    const { data: checkTx2 } = await supabase.from('finance_transactions').select('*').eq('id', tx.id).single();
    if (!checkTx2) {
        console.log('Transaction successfully removed from finance table.');
    } else {
        console.error('Transaction still exists!');
    }

    // Cleanup
    await supabase.from('member_dues').delete().eq('id', due.id);
    console.log('Cleanup done.');
}

verifyDuesIntegration();
