const fs = require('fs');
const path = require('path');

// Load env vars
// const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// if (!SUPABASE_URL || !SUPABASE_KEY) {
//     console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY) are set in .env');
//     process.exit(1);
// }

// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
//     auth: {
//         autoRefreshToken: false,
//         persistSession: false
//     }
// });

const prokerData = [
    {
        title: 'DIGITALK',
        dateStr: '11 Oktober 2025',
        division: 'DIGCITY',
        status: 'Selesai'
    },
    {
        title: "Digital Business Art and Sport Internal Competition (D'BASIC)",
        dateStr: '18 September - 19 Oktober 2025',
        division: 'DIGCITY',
        status: 'Selesai'
    },
    {
        title: 'A Company Exploration (ACE) /Company Visit',
        dateStr: '25 November 2025',
        division: 'DIGCITY',
        status: 'Selesai'
    },
    {
        title: 'Digital Level Up (DIATAP)',
        dateStr: '31 Mei 2025',
        division: 'DIGCITY',
        status: 'Selesai'
    },
    {
        title: 'Digital Level Up (DIATAP)',
        dateStr: '30 November 2025',
        division: 'DIGCITY',
        status: 'Selesai'
    },
    {
        title: 'Studi Banding',
        dateStr: '18 Juli 2025',
        division: 'DIGCITY',
        status: 'Selesai'
    },
    {
        title: 'Internal Workshop',
        dateStr: '28 Mei 2025',
        division: 'DIGCITY',
        status: 'Selesai'
    },
    {
        title: 'Digcity Welcoming Night (DIGIMON)',
        dateStr: '7 - 9 Februari 2025',
        division: 'DIGCITY',
        status: 'Selesai'
    },
    {
        title: 'Buka Bareng Anggota (BUBARAN)',
        dateStr: '13 - 14 Maret 2025',
        division: 'DIGCITY',
        status: 'Selesai'
    },
    {
        title: 'Seminar (SERIES)',
        dateStr: '23 Mei 2025',
        division: 'DIGCITY',
        status: 'Selesai'
    }
];

const monthMap = {
    'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04', 'Mei': '05', 'Juni': '06',
    'Juli': '07', 'Agustus': '08', 'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
};

function parseDate(dateStr) {
    // Handle ranges like "18 September - 19 Oktober 2025" or "7 - 9 Februari 2025" or "13 - 14 Maret 2025"

    // Normalize spaces
    const cleanStr = dateStr.replace(/\s+/g, ' ').trim();

    // Check for range
    if (cleanStr.includes('-')) {
        const parts = cleanStr.split('-').map(p => p.trim());
        // Case 1: "18 September - 19 Oktober 2025"
        // Case 2: "7 - 9 Februari 2025"
        // Case 3: "13 - 14 Maret 2025"

        // We assume the year is at the end of the second part
        const lastPart = parts[1];
        const yearMatch = lastPart.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : '2025'; // Default to 2025 if not found, but it should be there

        let startDay, startMonth, startYear;
        let endDay, endMonth, endYear;

        endYear = year;

        // Parse End Date
        const endTokens = lastPart.replace(year, '').trim().split(' ');
        // endTokens could be ["19", "Oktober"] or ["9", "Februari"] or ["14", "Maret"]
        if (endTokens.length >= 2) {
            endDay = endTokens[0];
            endMonth = monthMap[endTokens[1]];
        } else {
            // Fallback or error
            console.error(`Could not parse end date part: ${lastPart}`);
            return null;
        }

        // Parse Start Date
        const startTokens = parts[0].split(' ');
        // startTokens could be ["18", "September"] or ["7"] or ["13"]

        if (startTokens.length >= 2) {
            // "18 September"
            startDay = startTokens[0];
            startMonth = monthMap[startTokens[1]];
            startYear = year; // Assume same year unless specified? Usually yes.
        } else {
            // "7" or "13" -> implies same month as end date
            startDay = startTokens[0];
            startMonth = endMonth;
            startYear = endYear;
        }

        return {
            start: `${startYear}-${startMonth}-${startDay.padStart(2, '0')}`,
            end: `${endYear}-${endMonth}-${endDay.padStart(2, '0')}`
        };
    } else {
        // Single date "11 Oktober 2025"
        const tokens = cleanStr.split(' ');
        if (tokens.length >= 3) {
            const day = tokens[0];
            const month = monthMap[tokens[1]];
            const year = tokens[2];
            const date = `${year}-${month}-${day.padStart(2, '0')}`;
            return { start: date, end: null };
        }
        return null;
    }
}

function generateSQL() {
    console.log('Generating SQL...');
    let sql = '-- Insert Proker Data\n\n';

    // We need a valid user ID. Since we are running SQL, we can use a subquery or a placeholder.
    // We will use a placeholder UUID or try to select one.
    // Better to use a specific user ID if known, or just a dummy one if FK allows.
    // Assuming we can use a subquery to get the first admin user or similar.
    // For now, let's use a placeholder and comment about it.
    const createdBy = '00000000-0000-0000-0000-000000000000'; // Placeholder

    for (const item of prokerData) {
        const dates = parseDate(item.dateStr);
        if (!dates) continue;

        const title = item.title.replace(/'/g, "''"); // Escape single quotes
        const description = `Program Kerja: ${title}. Jangka: Panjang.`;
        const status = item.status === 'Selesai' ? 'completed' : 'upcoming';

        sql += `INSERT INTO public.internal_events (
    title, 
    description, 
    date, 
    end_date, 
    location, 
    division, 
    type, 
    status, 
    created_by
) VALUES (
    '${title}', 
    '${description}', 
    '${dates.start}', 
    ${dates.end ? `'${dates.end}'` : 'NULL'}, 
    'TBA', 
    'DIGCITY', 
    'work_program', 
    '${status}', 
    (SELECT id FROM auth.users LIMIT 1) -- Auto-select first user
);\n\n`;
    }

    const outputPath = path.join(__dirname, 'insert_proker_data.sql');
    fs.writeFileSync(outputPath, sql);
    console.log(`SQL generated at: ${outputPath}`);
}

generateSQL();
