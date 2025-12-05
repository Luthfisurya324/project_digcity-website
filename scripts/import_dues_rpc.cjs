const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const CSV_FILE = 'RECAP KAS DIGCITY - BUKU CATATAN KAS.csv';
const START_DATE = new Date('2024-04-01'); // Start from April 1st, 2024 (Monday)
const WEEKLY_AMOUNT = 2000;
const BATCH_SIZE = 100;

const SUPABASE_URL = 'https://mqjdyiyoigjnfadqatrx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamR5aXlvaWdqbmZhZHFhdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MjY4NTcsImV4cCI6MjA3MTAwMjg1N30.onUd1j0u_MyPmDz4WF5egO2ksPT5o9_2TTSry3QUuYo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper to generate UUID
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

// Helper to get initials
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 3);
}

// Helper to add days to date
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

async function importDues() {
    const csvPath = path.join(__dirname, '..', CSV_FILE);
    console.log(`Reading CSV from: ${csvPath}`);
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n');

    // Parse header to find M columns
    const header = lines[0].trim().split(',');
    const mColumns = [];
    header.forEach((col, index) => {
        if (col.startsWith('M') && !isNaN(col.substring(1))) {
            mColumns.push({ name: col, index: index, weekNum: parseInt(col.substring(1)) });
        }
    });

    console.log(`Found ${mColumns.length} week columns (M1-M${mColumns[mColumns.length - 1].weekNum})`);

    let batch = [];
    let totalProcessed = 0;
    let totalErrors = 0;

    // Process each row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(',');
        const name = cols[0];
        const division = cols[1];

        if (!name || name === 'TTL') continue;

        // Process each week for this member
        for (const mCol of mColumns) {
            const statusSymbol = cols[mCol.index];
            const isPaid = statusSymbol && (statusSymbol.includes('✔') || statusSymbol.toLowerCase().includes('v'));

            const status = isPaid ? 'paid' : 'unpaid';
            const dueDate = addDays(START_DATE, (mCol.weekNum - 1) * 7);
            const dueDateStr = dueDate.toISOString().split('T')[0];

            const initials = getInitials(name);
            const invoiceNumber = `INV/DUE/2024/W${mCol.weekNum}/${initials}-${Math.floor(Math.random() * 1000)}`;

            const id = uuidv4();

            const record = {
                id,
                member_name: name,
                division,
                amount: WEEKLY_AMOUNT,
                due_date: dueDateStr,
                status,
                invoice_number: invoiceNumber
            };

            batch.push(record);

            if (batch.length >= BATCH_SIZE) {
                await sendBatch(batch);
                totalProcessed += batch.length;
                batch = [];
            }
        }
    }

    // Send remaining items
    if (batch.length > 0) {
        await sendBatch(batch);
        totalProcessed += batch.length;
    }

    console.log(`Import completed. Total records: ${totalProcessed}`);
}

async function sendBatch(batch) {
    console.log(`Sending batch of ${batch.length} records...`);
    const { error } = await supabase.rpc('import_member_dues', { payload: batch });

    if (error) {
        console.error('Error sending batch:', error);
        throw error;
    }
}

importDues().catch(console.error);
