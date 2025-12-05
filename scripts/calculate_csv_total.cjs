const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '../RECAP KAS DIGCITY - REKAP KAS.csv');

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

    const rangeRegex = /M?(\d+)\s*-\s*M?(\d+)/g;
    let match;
    while ((match = rangeRegex.exec(normalize)) !== null) {
        const start = parseInt(match[1]);
        const end = parseInt(match[2]);
        for (let i = start; i <= end; i++) weeks.add(i);
    }

    const singleRegex = /M(\d+)/g;
    while ((match = singleRegex.exec(normalize)) !== null) {
        weeks.add(parseInt(match[1]));
    }

    const mingguRegex = /MINGGU\s+(\d+)/g;
    while ((match = mingguRegex.exec(normalize)) !== null) {
        weeks.add(parseInt(match[1]));
    }

    if (normalize.includes('13 MINGGU')) {
        for (let i = 1; i <= 13; i++) weeks.add(i);
    }

    if (normalize.includes('BAYAR 4 MINGGU')) {
        for (let i = 1; i <= 4; i++) weeks.add(i);
    }

    if (normalize.includes('KAS 5 MINGGU')) {
        for (let i = 1; i <= 5; i++) weeks.add(i);
    }

    const numberRangeRegex = /(\d+)\s*-\s*(\d+)/g;
    while ((match = numberRangeRegex.exec(normalize)) !== null) {
        const start = parseInt(match[1]);
        const end = parseInt(match[2]);
        if (start < 50 && end < 50 && start < end) {
            for (let i = start; i <= end; i++) weeks.add(i);
        }
    }

    return Array.from(weeks);
}

function calculateTotal() {
    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const rows = parseCSV(csvContent);
    const dataRows = rows.slice(2);

    let totalWeeks = 0;
    let totalAmount = 0;

    for (const row of dataRows) {
        if (row.length < 3) continue;
        const notes = row[9];
        const weeks = parseWeeks(notes);
        if (isNaN(weeks.length)) {
            console.log(`NaN weeks for row: ${row[2]} - Notes: ${notes}`);
        }
        totalWeeks += weeks.length;
        totalAmount += weeks.length * 10000;
    }

    console.log(`Total Weeks in CSV: ${totalWeeks}`);
    console.log(`Total Amount in CSV (at 10k/week): Rp ${totalAmount.toLocaleString('id-ID')}`);
}

calculateTotal();
