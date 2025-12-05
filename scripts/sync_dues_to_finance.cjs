const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env file
try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    }
} catch (e) {
    console.log('Could not read .env file, relying on existing env vars');
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mqjdyiyoigjnfadqatrx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncDues() {
    console.log('Starting dues synchronization...');

    // 1. Fetch all paid dues with member details
    const { data: dues, error: duesError } = await supabase
        .from('member_dues')
        .select(`
      *,
      organization_members (
        name
      )
    `)
        .eq('status', 'paid');

    if (duesError) {
        console.error('Error fetching dues:', duesError);
        return;
    }

    console.log(`Found ${dues.length} paid dues.`);

    // 2. Fetch existing finance transactions for dues to avoid duplicates
    const { data: transactions, error: transError } = await supabase
        .from('finance_transactions')
        .select('*')
        .eq('category', 'Iuran Anggota');

    if (transError) {
        console.error('Error fetching transactions:', transError);
        return;
    }

    // Helper to check if transaction exists
    // We'll match loosely on description containing the member name and amount
    // Ideally we would have a link, but for historical sync we use heuristics.
    const exists = (due, memberName) => {
        return transactions.some(t =>
            t.amount === due.amount &&
            t.description.includes(memberName) &&
            t.description.includes(due.month)
        );
    };

    const toInsert = [];
    let skipped = 0;

    for (const due of dues) {
        const memberName = due.organization_members?.name || 'Unknown Member';

        if (exists(due, memberName)) {
            skipped++;
            continue;
        }

        // Prepare transaction
        toInsert.push({
            date: due.payment_date || due.created_at.split('T')[0], // Use payment date or creation date
            description: `Iuran Anggota: ${memberName} - ${due.month} ${due.year}`,
            amount: due.amount,
            type: 'income',
            category: 'Iuran Anggota',
            status: 'approved',
            created_by: '00000000-0000-0000-0000-000000000000' // System/Admin ID placeholder if needed, or let DB handle default
            // Note: We might need a valid UUID for created_by if RLS enforces it. 
            // Let's try to fetch the first admin user to use as 'created_by'
        });
    }

    console.log(`Skipped ${skipped} existing transactions.`);
    console.log(`Prepared ${toInsert.length} new transactions to insert.`);

    if (toInsert.length > 0) {
        // We need a valid user ID for created_by. Let's fetch one.
        const { data: users } = await supabase.auth.admin.listUsers();
        const adminUser = users.users.find(u => u.email === 'admin@digcity.my.id');
        const userId = adminUser ? adminUser.id : users.users[0]?.id;

        if (!userId) {
            console.error("Could not find a user to attribute transactions to.");
            return;
        }

        // Add created_by to all
        toInsert.forEach(t => t.created_by = userId);

        // Insert in batches of 50
        const batchSize = 50;
        for (let i = 0; i < toInsert.length; i += batchSize) {
            const batch = toInsert.slice(i, i + batchSize);
            const { error: insertError } = await supabase
                .from('finance_transactions')
                .insert(batch);

            if (insertError) {
                console.error(`Error inserting batch ${i}:`, insertError);
            } else {
                console.log(`Inserted batch ${i} - ${i + batch.length}`);
            }
        }
    }

    console.log('Synchronization complete.');
}

syncDues();
