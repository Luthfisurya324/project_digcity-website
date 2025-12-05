const fs = require('fs');
const path = require('path');

const csvPath = 'c:\\dev\\project_digcity-website\\DIGCITY DATA 2025 - Surat Masuk.csv';
const fileContent = fs.readFileSync(csvPath, 'utf8');

const lines = fileContent.split('\n').filter(line => line.trim() !== '');
const headers = lines[0].split(',');

// Month mapping
const monthMap = {
    'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04', 'Mei': '05', 'Juni': '06',
    'Juli': '07', 'Agustus': '08', 'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
};

function parseDate(dateStr) {
    if (!dateStr || dateStr === '-') return null;
    const parts = dateStr.trim().split(' ');
    if (parts.length < 3) return null;
    const day = parts[0].padStart(2, '0');
    const month = monthMap[parts[1]];
    const year = parts[2];
    if (!month) return null;
    return `${year}-${month}-${day}`;
}

function escapeSql(str) {
    if (!str) return '';
    return str.replace(/'/g, "''").trim();
}

const values = [];

// Start from index 1 to skip header
for (let i = 1; i < lines.length; i++) {
    // Simple CSV parsing (handling quoted strings with commas is tricky, but let's see if we need it)
    // The view_file output showed some quoted fields like "Surat Undangan ...".
    // Let's use a regex or a proper CSV parser if possible, but for now simple split might fail on commas inside quotes.
    // Let's try to handle quotes.

    let line = lines[i];
    const row = [];
    let currentVal = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            row.push(currentVal);
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    row.push(currentVal);

    // Columns: No, Tanggal Masuk, Tanggal Surat, Nomor Surat, Pengirim, Perihal, Lampiran, Keterangan
    // Indices: 0, 1, 2, 3, 4, 5, 6, 7

    if (row.length < 8) continue;

    const dateReceived = parseDate(row[1]);
    const letterDate = parseDate(row[2]);
    const letterNumber = escapeSql(row[3]);
    const sender = escapeSql(row[4]);
    const subject = escapeSql(row[5]);
    const attachment = escapeSql(row[6]);
    const description = escapeSql(row[7]);

    values.push(`('${letterNumber}', '${dateReceived}', '${letterDate}', '${sender}', '${subject}', '${attachment}', '${description}', 'incoming')`);
}

const sql = `INSERT INTO letters (letter_number, date_received, letter_date, sender, subject, attachment, description, type) VALUES \n${values.join(',\n')};`;

fs.writeFileSync('scripts/insert_surat_masuk.sql', sql);
