const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mqjdyiyoigjnfadqatrx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamR5aXlvaWdqbmZhZHFhdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MjY4NTcsImV4cCI6MjA3MTAwMjg1N30.onUd1j0u_MyPmDz4WF5egO2ksPT5o9_2TTSry3QUuYo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkTotals() {
    console.log('Checking member_dues totals...');

    let allDues = [];
    let page = 0;
    const pageSize = 1000;

    while (true) {
        const { data, error } = await supabase
            .from('member_dues')
            .select('*')
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
            console.error('Error fetching dues:', error);
            break;
        }

        if (data.length === 0) break;
        allDues = allDues.concat(data);
        if (data.length < pageSize) break;
        page++;
    }

    console.log(`Total records: ${allDues.length}`);

    const paidDues = allDues.filter(d => d.status === 'paid');
    const totalAmount = paidDues.reduce((sum, d) => sum + (d.amount || 0), 0);

    console.log(`Total Paid Records: ${paidDues.length}`);
    console.log(`Total Amount (Paid): Rp ${totalAmount.toLocaleString('id-ID')}`);

    // Check for my incorrect 2025 imports
    const myImports = paidDues.filter(d => d.invoice_number && d.invoice_number.startsWith('INV/2025/M'));
    const myImportAmount = myImports.reduce((sum, d) => sum + (d.amount || 0), 0);
    console.log(`\nMy Incorrect Imports (INV/2025/M...): ${myImports.length} records, Rp ${myImportAmount.toLocaleString('id-ID')}`);

    // Check for April 2024 records
    const april2024 = paidDues.filter(d => d.due_date.startsWith('2024-04'));
    const april2024Amount = april2024.reduce((sum, d) => sum + (d.amount || 0), 0);
    console.log(`\nApril 2024 Records: ${april2024.length} records, Rp ${april2024Amount.toLocaleString('id-ID')}`);

    // Check amount distribution for April 2024
    const aprilAmounts = {};
    april2024.forEach(d => {
        const amt = d.amount || 0;
        aprilAmounts[amt] = (aprilAmounts[amt] || 0) + 1;
    });
    console.log('April 2024 Amount Distribution:');
    for (const [amt, count] of Object.entries(aprilAmounts)) {
        console.log(`Rp ${amt}: ${count} records`);
    }

    // Check for April 2025 records
    const april2025 = paidDues.filter(d => d.due_date.startsWith('2025-04'));
    console.log(`\nApril 2025 Records: ${april2025.length} records`);

    console.log('\nSample Dues (First 10):');
    allDues.slice(0, 10).forEach(d => {
        console.log(`${d.due_date} | ${d.member_name} | ${d.amount} | ${d.invoice_number}`);
    });

    console.log('\nSample Dues (Last 10):');
    allDues.slice(-10).forEach(d => {
        console.log(`${d.due_date} | ${d.member_name} | ${d.amount} | ${d.invoice_number}`);
    });
}

checkTotals().catch(console.error);
