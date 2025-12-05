const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually read .env file
const envPath = path.resolve(__dirname, '../.env');
let env = {};
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });
}

const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDuesTransactions() {
    console.log('Starting cleanup of dues transactions...');

    // Delete transactions with category 'Iuran Anggota'
    const { error, count } = await supabase
        .from('finance_transactions')
        .delete({ count: 'exact' })
        .eq('category', 'Iuran Anggota');

    if (error) {
        console.error('Error deleting transactions:', error);
        return;
    }

    console.log(`Successfully deleted ${count} transactions with category 'Iuran Anggota'.`);
}

cleanupDuesTransactions();
