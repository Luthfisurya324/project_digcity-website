const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SUPABASE_URL = 'https://mqjdyiyoigjnfadqatrx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamR5aXlvaWdqbmZhZHFhdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MjY4NTcsImV4cCI6MjA3MTAwMjg1N30.onUd1j0u_MyPmDz4WF5egO2ksPT5o9_2TTSry3QUuYo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const PLAN_PATH = path.join(__dirname, 'reconciliation_plan.json');

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

async function execute() {
    if (!fs.existsSync(PLAN_PATH)) {
        console.error('Plan file not found!');
        return;
    }

    const plan = JSON.parse(fs.readFileSync(PLAN_PATH, 'utf-8'));
    console.log(`Executing ${plan.length} operations...`);

    const inserts = [];
    const updates = [];

    for (const item of plan) {
        if (item.action === 'INSERT') {
            inserts.push({
                id: uuidv4(),
                member_id: item.member_id,
                member_name: item.member_name,
                division: item.division,
                amount: item.amount,
                due_date: item.due_date,
                status: item.status,
                invoice_number: item.invoice_number,
                notes: item.notes
            });
        } else if (item.action === 'UPDATE') {
            updates.push(item);
        }
    }

    console.log(`Found ${inserts.length} inserts and ${updates.length} updates.`);

    // Execute Inserts via RPC
    if (inserts.length > 0) {
        const BATCH_SIZE = 50;
        for (let i = 0; i < inserts.length; i += BATCH_SIZE) {
            const batch = inserts.slice(i, i + BATCH_SIZE);
            console.log(`Sending batch insert ${i / BATCH_SIZE + 1}...`);
            const { error } = await supabase.rpc('import_member_dues', { payload: batch });
            if (error) {
                console.error('Batch insert failed:', error);
            } else {
                console.log(`Batch insert ${i / BATCH_SIZE + 1} success.`);
            }
        }
    }

    // Execute Updates
    if (updates.length > 0) {
        console.log('Attempting updates...');
        for (const item of updates) {
            const { error } = await supabase.from('member_dues').update({
                status: item.status,
                amount: item.amount,
                notes: item.notes
            }).eq('id', item.id);

            if (error) {
                console.error(`Update failed for ${item.id}:`, error.message);
            } else {
                process.stdout.write('.');
            }
        }
        console.log('\nUpdates finished.');
    }
}

execute().catch(console.error);
