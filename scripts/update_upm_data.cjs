const { createClient } = require('@supabase/supabase-js');

// Load env vars
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const upmData = [
    { division: 'POD', title: 'Digcity Welcoming Night (DIGIMON)', amount: 2000000, completed: true },
    { division: 'CMI', title: 'Workshop Desain', amount: 500000, completed: true },
    { division: 'ECRAV', title: 'Stall Of Business (SOB)', amount: 515000, completed: true },
    { division: 'ECRAV', title: 'Digital Level Up (DIATAP)', amount: 100000, completed: true },
    { division: 'PR', title: 'Studi Banding', amount: 1000000, completed: true }
];

async function updateUPM() {
    console.log('Updating UPM Requests...');

    // 1. Ensure an active allocation exists (or create a dummy one)
    let { data: allocation, error: allocError } = await supabase
        .from('upm_allocations')
        .select('id')
        .eq('period', '2024-2025') // Assuming current period
        .single();

    if (allocError || !allocation) {
        console.log('Creating default allocation...');
        const { data: newAlloc, error: createError } = await supabase
            .from('upm_allocations')
            .insert({
                period: '2024-2025',
                total_amount: 10000000, // Dummy total
                start_date: '2024-01-01',
                end_date: '2024-12-31'
            })
            .select()
            .single();
        
        if (createError) {
            console.error('Failed to create allocation:', createError);
            return;
        }
        allocation = newAlloc;
    }

    console.log('Using Allocation ID:', allocation.id);

    for (const item of upmData) {
        console.log(`Processing: ${item.title}`);

        // 2. Find the program (event)
        // We'll try fuzzy matching or exact match on title
        const { data: events, error: eventError } = await supabase
            .from('internal_events')
            .select('id, title')
            .ilike('title', `%${item.title}%`);

        if (eventError) {
            console.error(`Error finding event for ${item.title}:`, eventError);
            continue;
        }

        let eventId = null;
        if (events && events.length > 0) {
            eventId = events[0].id;
            console.log(`Found event: ${events[0].title} (${eventId})`);
        } else {
            console.warn(`Event not found for: ${item.title}. Creating UPM request without program link.`);
        }

        // 3. Insert or Update UPM Request
        // Check if request already exists for this program (if linked) or description
        let query = supabase.from('upm_requests').select('id');
        
        if (eventId) {
            query = query.eq('program_id', eventId);
        } else {
            query = query.eq('description', item.title);
        }

        const { data: existing, error: checkError } = await query;

        const payload = {
            allocation_id: allocation.id,
            program_id: eventId,
            description: item.title,
            amount_proposed: item.amount,
            amount_approved: item.amount, // Assuming approved = proposed for this update
            status: item.completed ? 'disbursed' : 'pending', // "Selesai" -> disbursed? Or just approved? Let's assume disbursed/completed flow.
            // If "Selesai" means the event is done, UPM might be disbursed.
        };

        if (existing && existing.length > 0) {
            console.log(`Updating existing request ${existing[0].id}...`);
            const { error: updateError } = await supabase
                .from('upm_requests')
                .update(payload)
                .eq('id', existing[0].id);
            
            if (updateError) console.error('Update failed:', updateError);
            else console.log('Update success.');
        } else {
            console.log('Inserting new request...');
            const { error: insertError } = await supabase
                .from('upm_requests')
                .insert(payload);
            
            if (insertError) console.error('Insert failed:', insertError);
            else console.log('Insert success.');
        }
    }
}

updateUPM();
