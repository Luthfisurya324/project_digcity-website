
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Fetching data...');

    const { data: events, error: eventsError } = await supabase
        .from('internal_events')
        .select('id, title, division');

    if (eventsError) throw eventsError;

    const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('event_id, member_id, status')
        .in('status', ['present', 'late']);

    if (attendanceError) throw attendanceError;

    const { data: members, error: membersError } = await supabase
        .from('organization_members')
        .select('id, division');

    if (membersError) throw membersError;

    const memberDivisionMap = new Map();
    members.forEach(m => memberDivisionMap.set(m.id, m.division));

    console.log(`Processing ${events.length} events...`);

    let updatedCount = 0;

    for (const event of events) {
        // Skip explicitly general events
        if (event.title.match(/Rapat Kerja|Rapat Umum|Grand Meeting/i)) {
            continue;
        }

        const eventAttendance = attendance.filter(a => a.event_id === event.id);
        if (eventAttendance.length === 0) continue;

        const divisionCounts = {};
        let total = 0;

        eventAttendance.forEach(a => {
            const div = memberDivisionMap.get(a.member_id);
            if (div) {
                divisionCounts[div] = (divisionCounts[div] || 0) + 1;
                total++;
            }
        });

        let maxDiv = null;
        let maxCount = 0;

        for (const [div, count] of Object.entries(divisionCounts)) {
            if (count > maxCount) {
                maxCount = count;
                maxDiv = div;
            }
        }

        if (maxDiv && maxDiv !== event.division) {
            // Threshold: If > 50% of attendees are from this division
            if (maxCount / total > 0.5) {
                console.log(`Updating event "${event.title}" from ${event.division} to ${maxDiv} (${maxCount}/${total})`);

                const { error } = await supabase
                    .from('internal_events')
                    .update({ division: maxDiv })
                    .eq('id', event.id);

                if (error) {
                    console.error(`Failed to update event ${event.id}:`, error);
                } else {
                    updatedCount++;
                }
            }
        }
    }

    console.log(`Done. Updated ${updatedCount} events.`);
}

main().catch(console.error);
