const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://mqjdyiyoigjnfadqatrx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamR5aXlvaWdqbmZhZHFhdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MjY4NTcsImV4cCI6MjA3MTAwMjg1N30.onUd1j0u_MyPmDz4WF5egO2ksPT5o9_2TTSry3QUuYo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CSV_PATH = path.join(__dirname, '../RECAP KAS DIGCITY - REKAP KAS.csv');
const START_DATE = new Date('2024-04-01'); // M1 Start Date (April 2024)

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (inQuotes) {
            if (char === '"' && nextChar === '"') {
                currentField += '"';
                i++;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                currentRow.push(currentField.trim());
                currentField = '';
            } else if (char === '\n' || char === '\r') {
                if (currentField || currentRow.length > 0) {
                    currentRow.push(currentField.trim());
                    rows.push(currentRow);
                }
                currentRow = [];
                currentField = '';
                if (char === '\r' && nextChar === '\n') i++;
            } else {
                currentField += char;
            }
        }
    }
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
    }
    return rows;
}

function parseWeeks(notes) {
    const weeks = new Set();
    if (!notes) return [];

    const normalize = notes.toUpperCase();

    // Pattern: M1-M3, M1 - M3, M1-5, 1-5, M1, M2
    // Regex to find ranges or single numbers
    const rangeRegex = /M?(\d+)\s*-\s*M?(\d+)/g;
    let match;
    while ((match = rangeRegex.exec(normalize)) !== null) {
        const start = parseInt(match[1]);
        const end = parseInt(match[2]);
        for (let i = start; i <= end; i++) weeks.add(i);
    }

    // Handle "M1, M3"
    const singleRegex = /M(\d+)/g;
    while ((match = singleRegex.exec(normalize)) !== null) {
        weeks.add(parseInt(match[1]));
    }

    // Handle "Minggu 2"
    const mingguRegex = /MINGGU\s+(\d+)/g;
    while ((match = mingguRegex.exec(normalize)) !== null) {
        weeks.add(parseInt(match[1]));
    }

    // Handle "13 Minggu" (duration) - specific case
    if (normalize.includes('13 MINGGU')) {
        for (let i = 1; i <= 13; i++) weeks.add(i);
    }

    // Handle "kita bayar 4 minggu" - ambiguous without start. Assume M1-M4?
    if (normalize.includes('BAYAR 4 MINGGU')) {
        for (let i = 1; i <= 4; i++) weeks.add(i);
    }

    // Handle "5 minggu"
    if (normalize.includes('KAS 5 MINGGU')) {
        for (let i = 1; i <= 5; i++) weeks.add(i);
    }

    // Handle "12 - 16"
    const numberRangeRegex = /(\d+)\s*-\s*(\d+)/g;
    while ((match = numberRangeRegex.exec(normalize)) !== null) {
        const start = parseInt(match[1]);
        const end = parseInt(match[2]);
        if (start < 50 && end < 50 && start < end) {
            for (let i = start; i <= end; i++) weeks.add(i);
        }
    }

    return Array.from(weeks).sort((a, b) => a - b);
}

async function reconcile() {
    console.log('Fetching existing dues...');
    let existingDues = [];
    let page = 0;
    const pageSize = 1000;
    while (true) {
        const { data, error } = await supabase
            .from('member_dues')
            .select('*')
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) throw error;
        if (data.length === 0) break;

        existingDues = existingDues.concat(data);
        console.log(`Fetched ${data.length} dues (Total: ${existingDues.length})`);
        if (data.length < pageSize) break;
        page++;
    }
    console.log(`Fetched total ${existingDues.length} existing dues.`);

    // Build member map from existing dues
    const memberMap = new Map();
    existingDues.forEach(d => {
        if (d.member_name) {
            memberMap.set(d.member_name.toLowerCase(), { id: d.member_id, name: d.member_name, division: d.division });
        }
    });
    console.log(`Built member map with ${memberMap.size} unique members from dues.`);

    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const rows = parseCSV(csvContent);
    console.log(`Parsed ${rows.length} rows from CSV.`);

    // Skip header (rows 0 and 1 based on file view)
    const dataRows = rows.slice(2);

    const plan = [];

    for (const row of dataRows) {
        if (row.length < 3) continue;

        const timestamp = row[0];
        const email = row[1];
        const name = row[2];
        const notes = row[9]; // Notes column

        // Find member from map
        let member = memberMap.get(name.toLowerCase());

        // If not found, try fuzzy match
        if (!member) {
            for (const [key, val] of memberMap.entries()) {
                if (key.includes(name.toLowerCase()) || name.toLowerCase().includes(key)) {
                    member = val;
                    break;
                }
            }
        }

        if (!member) {
            // console.warn(`Member not found for: ${name} (${email}) - Will create with null ID`);
            member = { id: null, name: name, division: row[4] || 'Inti' };
        }

        const weeks = parseWeeks(notes);
        if (weeks.length === 0) {
            // console.warn(`No weeks parsed for: ${notes}`);
            continue;
        }

        for (const week of weeks) {
            const dueDate = addDays(START_DATE, (week - 1) * 7).toISOString().slice(0, 10);

            // Check if due exists
            const existing = existingDues.find(d =>
                (d.member_id === member.id || d.member_name.toLowerCase() === member.name.toLowerCase()) &&
                d.due_date.slice(0, 10) === dueDate
            );

            if (!existing) {
                plan.push({
                    action: 'INSERT',
                    member_id: member.id,
                    member_name: member.name,
                    division: member.division || 'Inti',
                    amount: 2500, // Correct amount
                    due_date: dueDate,
                    status: 'paid',
                    invoice_number: `INV/2024/M${week}/${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    notes: `Imported from CSV: ${notes}`,
                    week: week
                });
            } else if (existing.status !== 'paid' || existing.amount !== 2500) {
                plan.push({
                    action: 'UPDATE',
                    id: existing.id,
                    status: 'paid',
                    amount: 2500,
                    notes: existing.notes ? existing.notes + ` | Updated via CSV: ${notes}` : `Updated via CSV: ${notes}`
                });
            }
        }
    }

    console.log(`Generated plan with ${plan.length} operations.`);
    fs.writeFileSync(path.join(__dirname, 'reconciliation_plan.json'), JSON.stringify(plan, null, 2));
}

reconcile().catch(console.error);
