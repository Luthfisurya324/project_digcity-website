const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mqjdyiyoigjnfadqatrx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamR5aXlvaWdqbmZhZHFhdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MjY4NTcsImV4cCI6MjA3MTAwMjg1N30.onUd1j0u_MyPmDz4WF5egO2ksPT5o9_2TTSry3QUuYo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function cleanup() {
    console.log('Cleaning up incorrect imports (INV/2025/M...)...');

    // First count them
    const { count, error: countError } = await supabase
        .from('member_dues')
        .select('*', { count: 'exact', head: true })
        .like('invoice_number', 'INV/2025/M%');

    if (countError) {
        console.error('Error counting:', countError);
        return;
    }

    console.log(`Found ${count} records to delete.`);

    if (count === 0) return;

    // Delete
    const { error: deleteError } = await supabase
        .from('member_dues')
        .delete()
        .like('invoice_number', 'INV/2025/M%');

    if (deleteError) {
        console.error('Delete failed:', deleteError);
        console.log('Trying to fetch IDs and delete one by one...');

        const { data: ids } = await supabase
            .from('member_dues')
            .select('id')
            .like('invoice_number', 'INV/2025/M%');

        if (ids) {
            for (const item of ids) {
                const { error } = await supabase.from('member_dues').delete().eq('id', item.id);
                if (error) console.error(`Failed to delete ${item.id}:`, error.message);
                else process.stdout.write('.');
            }
        }
    } else {
        console.log('Delete successful.');
    }
}

cleanup().catch(console.error);
