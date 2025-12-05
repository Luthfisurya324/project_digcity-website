const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../DIGCITY DATA 2025 - Surat Keluar.csv');
const outputPath = path.join(__dirname, 'import_letters.sql');

const monthMap = {
    'Januari': '01',
    'Februari': '02',
    'Maret': '03',
    'April': '04',
    'Mei': '05',
    'Juni': '06',
    'Juli': '07',
    'Agustus': '08',
    'September': '09',
    'Oktober': '10',
    'November': '11',
    'Desember': '12'
};

function parseDate(dateStr) {
    if (!dateStr || dateStr === '-') return null;
    const parts = dateStr.split(' ');
    if (parts.length < 3) return null;
    const day = parts[0].padStart(2, '0');
    const month = monthMap[parts[1]];
    const year = parts[2];
    if (!month) return null;
    return `${year}-${month}-${day}`;
}

function escapeSql(str) {
    if (!str) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
}

try {
    const data = fs.readFileSync(csvPath, 'utf8');

    let sql = 'INSERT INTO letters (letter_number, date_out, letter_date, recipient, subject, attachment, description, type) VALUES\n';
    const values = [];

    let currentField = '';
    let insideQuote = false;
    let currentRow = [];
    const rows = [];

    for (let i = 0; i < data.length; i++) {
        const char = data[i];
        const nextChar = data[i + 1];

        if (char === '"') {
            if (insideQuote && nextChar === '"') {
                currentField += '"';
                i++; // Skip next quote
            } else {
                insideQuote = !insideQuote;
            }
        } else if (char === ',' && !insideQuote) {
            currentRow.push(currentField.trim());
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !insideQuote) {
            if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
            currentRow.push(currentField.trim());
            if (currentRow.length > 0 || currentField.length > 0) { // Avoid empty rows but allow single field rows if valid
                // Check if row is not just empty strings
                if (currentRow.some(f => f.length > 0)) {
                    rows.push(currentRow);
                }
            }
            currentRow = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }

    // Push the last row if exists
    if (currentRow.length > 0 || currentField.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(f => f.length > 0)) {
            rows.push(currentRow);
        }
    }

    // Process rows
    // Header: No,Tanggal Keluar,Tanggal Surat,Nomor Surat,Penerima,Perihal,Lampiran,Keterangan
    // Indices: 0, 1, 2, 3, 4, 5, 6, 7

    rows.slice(1).forEach(row => {
        if (row.length < 8) return; // Skip invalid rows

        const dateOut = parseDate(row[1]);
        const letterDate = parseDate(row[2]);
        const letterNumber = row[3];
        const recipient = row[4];
        const subject = row[5];
        const attachment = row[6];
        const description = row[7];

        if (letterNumber) {
            values.push(`(${escapeSql(letterNumber)}, ${escapeSql(dateOut)}, ${escapeSql(letterDate)}, ${escapeSql(recipient)}, ${escapeSql(subject)}, ${escapeSql(attachment)}, ${escapeSql(description)}, 'outgoing')`);
        }
    });

    sql += values.join(',\n') + ';';

    fs.writeFileSync(outputPath, sql);
    console.log(`Generated SQL for ${values.length} letters at ${outputPath}`);

} catch (err) {
    console.error('Error:', err);
}
