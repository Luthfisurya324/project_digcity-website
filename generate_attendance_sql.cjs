const fs = require('fs');
const path = require('path');

const csvPath = path.join(process.cwd(), 'DIGCITY DATA 2025 - Data Absensi Rapat Digcity.csv');

const fileContent = fs.readFileSync(csvPath, 'utf-8');
const lines = fileContent.split('\n');

let currentEvent = null;
const events = new Map(); // key: date|title -> {id, date, title, location, agenda}
const attendance = [];

// Helper to parse date DD/MM/YYYY to YYYY-MM-DD
function parseDate(dateStr) {
    if (!dateStr) return null;
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m}-${d}`;
}

// Helper to escape SQL strings
function escapeSql(str) {
    if (!str) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
}

// Helper to normalize status
function normalizeStatus(status) {
    const s = (status || '').toLowerCase().trim();
    if (s.includes('hadir')) return 'present';
    if (s.includes('izin')) return 'excused';
    if (s.includes('sakit')) return 'excused';
    if (s.includes('alpha')) return 'absent';
    return 'absent'; // Default fallback
}

let eventCounter = 0;

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV split (handling quotes is tricky but let's try simple split first or regex)
    const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];

    // Let's try a robust split
    const matches = [];
    let inQuote = false;
    let currentToken = '';
    for (let char of line) {
        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            matches.push(currentToken);
            currentToken = '';
        } else {
            currentToken += char;
        }
    }
    matches.push(currentToken);

    const cols = matches.map(s => s.trim().replace(/^"|"$/g, ''));

    // Columns: No, Tanggal, Waktu, Tempat, Agenda, Nama, Divisi, Jabatan, Kehadiran
    // Indices: 0, 1, 2, 3, 4, 5, 6, 7, 8

    const date = cols[1];
    const time = cols[2];
    const location = cols[3];
    const agenda = cols[4];
    const name = cols[5];
    const division = cols[6]; // Not used for attendance insert, but maybe for verification
    const position = cols[7];
    const status = cols[8];

    if (date && agenda) {
        // New Event
        const parsedDate = parseDate(date);
        const eventKey = `${parsedDate}|${agenda}`;

        if (!events.has(eventKey)) {
            eventCounter++;
            // We'll use a temporary ID or just the key to link
            events.set(eventKey, {
                tempId: eventCounter,
                date: parsedDate,
                time: time,
                location: location,
                agenda: agenda,
                title: agenda // Use agenda as title
            });
        }
        currentEvent = events.get(eventKey);
    }

    if (currentEvent && name) {
        attendance.push({
            eventTempId: currentEvent.tempId,
            name: name,
            status: normalizeStatus(status),
            checkInTime: `${currentEvent.date} ${currentEvent.time || '00:00:00'}`
        });
    }
}

let sql = '';
let fileCounter = 1;
let eventCountInFile = 0;
const EVENTS_PER_FILE = 20;

events.forEach((evt) => {
    sql += `
DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: ${evt.title} (${evt.date})
  SELECT id INTO v_event_id FROM internal_events WHERE date = ${escapeSql(evt.date)} AND title = ${escapeSql(evt.title)};
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES (${escapeSql(evt.title)}, ${escapeSql(evt.date)}, ${escapeSql(evt.location)}, ${escapeSql(evt.agenda)}, 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;
`;

    // Filter attendance for this event
    const eventAttendance = attendance.filter(a => a.eventTempId === evt.tempId);

    eventAttendance.forEach(att => {
        sql += `
    -- Attendance for ${att.name}
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE ${escapeSql(att.name)} LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, ${escapeSql(att.name)}, ${escapeSql(att.status)}, ${escapeSql(att.checkInTime)})
      ON CONFLICT DO NOTHING;
    END IF;
    `;
    });

    sql += `
END $$;
`;

    eventCountInFile++;
    if (eventCountInFile >= EVENTS_PER_FILE) {
        const fileName = `import_attendance_${fileCounter}.sql`;
        fs.writeFileSync(path.join(process.cwd(), fileName), sql);
        console.log('Generated ' + fileName);
        sql = '';
        eventCountInFile = 0;
        fileCounter++;
    }
});

if (sql) {
    const fileName = `import_attendance_${fileCounter}.sql`;
    fs.writeFileSync(path.join(process.cwd(), fileName), sql);
    console.log('Generated ' + fileName);
}
