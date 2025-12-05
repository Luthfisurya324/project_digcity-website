const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mqjdyiyoigjnfadqatrx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamR5aXlvaWdqbmZhZHFhdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MjY4NTcsImV4cCI6MjA3MTAwMjg1N30.onUd1j0u_MyPmDz4WF5egO2ksPT5o9_2TTSry3QUuYo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testInsert() {
    console.log('Testing insert into member_dues...');

    const testData = {
        member_name: 'Test User',
        division: 'TEST',
        amount: 2000,
        due_date: '2024-01-01',
        status: 'unpaid',
        invoice_number: 'TEST-INV-' + Date.now()
    };

    const { data, error } = await supabase
        .from('member_dues')
        .insert([testData])
        .select();

    if (error) {
        console.error('Insert failed:', error);
    } else {
        console.log('Insert successful:', data);

        // Cleanup
        const { error: deleteError } = await supabase
            .from('member_dues')
            .delete()
            .eq('id', data[0].id);

        if (deleteError) console.error('Cleanup failed:', deleteError);
        else console.log('Cleanup successful');
    }
}

testInsert();
