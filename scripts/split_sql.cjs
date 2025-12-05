const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'import_dues.sql';
const OUTPUT_DIR = 'sql_chunks';
const STATEMENTS_PER_FILE = 50;

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

const content = fs.readFileSync(INPUT_FILE, 'utf8');
const statements = content.split('INSERT INTO').filter(s => s.trim());

// Add 'INSERT INTO' back to each statement (except the first split which might be empty or comments)
const cleanStatements = [];
if (content.trim().startsWith('BEGIN;')) {
    // Handle the transaction start
}

// Better approach: split by semicolon, but careful with data containing semicolons.
// Since we generated the SQL, we know the format. Each statement ends with ");"
// But let's stick to the split by 'INSERT INTO' which is safer given our generator.

const parts = content.split('INSERT INTO member_dues');
const header = parts[0]; // Includes BEGIN; and comments
const inserts = parts.slice(1).map(p => 'INSERT INTO member_dues' + p);

console.log(`Total inserts found: ${inserts.length}`);

let fileCount = 0;
for (let i = 0; i < inserts.length; i += STATEMENTS_PER_FILE) {
    const chunk = inserts.slice(i, i + STATEMENTS_PER_FILE);
    const chunkContent = (i === 0 ? header : '') + chunk.join('') + (i + STATEMENTS_PER_FILE >= inserts.length ? '\nCOMMIT;' : '');

    // Ensure we don't have a lone COMMIT without BEGIN if we split transactions?
    // Actually, it's better to wrap each chunk in BEGIN; COMMIT;

    const safeChunkContent = 'BEGIN;\n' + chunk.join('') + '\nCOMMIT;';

    fileCount++;
    const fileName = path.join(OUTPUT_DIR, `part_${fileCount}.sql`);
    fs.writeFileSync(fileName, safeChunkContent);
    console.log(`Written ${fileName} with ${chunk.length} inserts`);
}
