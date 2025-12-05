const { createClient } = require('@supabase/supabase-js');

// Load env vars
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testUpdate() {
    const eventId = 'ebe276b1-86cc-46f5-bb3d-f9438a6fd76b';

    console.log(`Checking event ${eventId}...`);

    const { data: event, error: fetchError } = await supabase
        .from('internal_events')
        .select('*')
        .eq('id', eventId)
        .single();

    if (fetchError) {
        console.error('Error fetching event:', fetchError);
        return;
    }

    console.log('Current status:', event.status);
    console.log('Date:', event.date);
    console.log('End Date:', event.end_date);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(event.end_date || event.date);

    console.log('Today:', today.toISOString());
    console.log('Event Date Object:', eventDate.toISOString());

    if (eventDate < today) {
        console.log('Event is in the past. Updating status...');
        const { data: updated, error: updateError } = await supabase
            .from('internal_events')
            .update({ status: 'completed' })
            .eq('id', eventId)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating event:', updateError);
        } else {
            console.log('Update success. New status:', updated.status);
        }
    } else {
        console.log('Event is NOT in the past (or logic is wrong).');
    }
}

testUpdate();
