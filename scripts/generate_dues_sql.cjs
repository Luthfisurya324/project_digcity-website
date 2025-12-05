const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const CSV_FILE = 'RECAP KAS DIGCITY - BUKU CATATAN KAS.csv';
const OUTPUT_FILE = 'import_dues.sql';
const START_DATE = new Date('2024-04-01'); // Start from April 1st, 2024 (Monday)
const WEEKLY_AMOUNT = 2000;

// Helper to generate UUID
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

// Helper to escape SQL strings
function escapeSql(str) {
    if (!str) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
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

// Main function
function generateSql() {
    const csvPath = path.join(__dirname, '..', CSV_FILE);
    const outputPath = path.join(__dirname, '..', OUTPUT_FILE);

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

    let sqlContent = `-- Import Member Dues from CSV
-- Generated at ${new Date().toISOString()}

BEGIN;

-- Optional: Clear existing dues if needed (commented out for safety)
-- DELETE FROM member_dues;

`;

    let recordCount = 0;

    // Process each row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Handle CSV parsing considering potential quotes (simple split for now as data seems simple)
        const cols = line.split(',');

        const name = cols[0];
        const division = cols[1];

        if (!name || name === 'TTL') continue; // Skip empty names or total row

        // Process each week for this member
        mColumns.forEach(mCol => {
            const statusSymbol = cols[mCol.index];
            const isPaid = statusSymbol && (statusSymbol.includes('✔') || statusSymbol.toLowerCase().includes('v'));

            const status = isPaid ? 'paid' : 'unpaid';
            // Calculate due date: Start Date + (WeekNum - 1) * 7 days
            const dueDate = addDays(START_DATE, (mCol.weekNum - 1) * 7);
            const dueDateStr = dueDate.toISOString().split('T')[0];

            const initials = getInitials(name);
            const invoiceNumber = `INV/DUE/2024/W${mCol.weekNum}/${initials}-${Math.floor(Math.random() * 1000)}`;

            const id = uuidv4();

            // Construct INSERT statement
            const insertSql = `INSERT INTO member_dues (
  id, 
  member_name, 
  division, 
  amount, 
  due_date, 
  status, 
  invoice_number, 
  created_at,
  updated_at
) VALUES (
  '${id}',
  ${escapeSql(name)},
  ${escapeSql(division)},
  ${WEEKLY_AMOUNT},
  '${dueDateStr}',
  '${status}',
  '${invoiceNumber}',
  NOW(),
  NOW()
);\n`;

            sqlContent += insertSql;
            recordCount++;
        });
    }

    sqlContent += `
COMMIT;
`;

    fs.writeFileSync(outputPath, sqlContent);
    console.log(`Generated SQL file at: ${outputPath}`);
    console.log(`Total records generated: ${recordCount}`);
}

generateSql();
