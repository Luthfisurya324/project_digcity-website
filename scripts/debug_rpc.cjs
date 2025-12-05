const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const SUPABASE_URL = 'https://mqjdyiyoigjnfadqatrx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamR5aXlvaWdqbmZhZHFhdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MjY4NTcsImV4cCI6MjA3MTAwMjg1N30.onUd1j0u_MyPmDz4WF5egO2ksPT5o9_2TTSry3QUuYo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

async function debugRpc() {
    console.log('Attempting single RPC insert...');

    const record = {
        id: uuidv4(),
        member_name: 'Debug User',
        division: 'Debug Div',
        amount: 2500,
        due_date: new Date().toISOString().split('T')[0],
        status: 'paid',
        invoice_number: `INV/DEBUG/${Date.now()}`,
        notes: 'Debug Insert'
    };

    const { error } = await supabase.rpc('import_member_dues', { payload: [record] });

    if (error) {
        console.error('RPC Failed:', error);
    } else {
        console.log('RPC Success. Verifying...');

        const { data, error: fetchError } = await supabase
            .from('member_dues')
            .select('*')
            .eq('invoice_number', record.invoice_number);

        if (fetchError) console.error('Fetch Error:', fetchError);
        else console.log('Fetched Record:', data);
    }
}

debugRpc().catch(console.error);
