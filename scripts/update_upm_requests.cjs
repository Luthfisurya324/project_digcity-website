const { createClient } = require('@supabase/supabase-js');

// Load env vars
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials. Ensure SUPABASE_SERVICE_ROLE_KEY is set in .env');
    console.log('SUPABASE_URL present:', !!SUPABASE_URL);
    console.log('SUPABASE_SERVICE_ROLE_KEY present:', !!SUPABASE_KEY);
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

    // 1. Ensure Allocation Exists (Create a default one if needed)
    let { data: allocation, error: allocError } = await supabase
        .from('upm_allocations')
        .select('id')
        .eq('period', '2024-2025')
        .single();

    if (!allocation) {
        console.log('Creating default UPM allocation...');
        const { data: newAlloc, error: createAllocError } = await supabase
            .from('upm_allocations')
            .insert({
                period: '2024-2025',
                total_amount: 10000000, // Arbitrary budget
                start_date: '2024-01-01',
                end_date: '2025-12-31'
            })
            .select()
            .single();

        if (createAllocError) {
            console.error('Error creating allocation:', createAllocError);
            return;
        }
        allocation = newAlloc;
    }

    console.log('Using Allocation ID:', allocation.id);

    for (const item of upmData) {
        console.log(`Processing: ${item.title}`);

        // 2. Find or Create Event
        let { data: event, error: eventError } = await supabase
            .from('internal_events')
            .select('id')
            .ilike('title', item.title) // Case-insensitive match
            .single();

        if (!event) {
            console.log(`Event not found, creating: ${item.title}`);
            // Need a user ID for created_by. Let's use the first user found or a specific admin.
            // For script simplicity, we'll try to fetch one.
            const { data: users } = await supabase.auth.admin.listUsers();
            const userId = users.users[0]?.id;

            const { data: newEvent, error: createEventError } = await supabase
                .from('internal_events')
                .insert({
                    title: item.title,
                    division: item.division,
                    date: new Date().toISOString(), // Default to now if unknown
                    type: 'work_program',
                    status: item.completed ? 'completed' : 'upcoming',
                    description: `Program Kerja: ${item.title}`,
                    created_by: userId
                })
                .select()
                .single();

            if (createEventError) {
                console.error(`Failed to create event ${item.title}:`, createEventError);
                continue;
            }
            event = newEvent;
        } else {
            // Update status if needed
            if (item.completed) {
                await supabase.from('internal_events').update({ status: 'completed' }).eq('id', event.id);
            }
        }

        // 3. Insert/Update UPM Request
        // Check if request exists for this event
        const { data: existingRequest } = await supabase
            .from('upm_requests')
            .select('id')
            .eq('program_id', event.id)
            .single();

        if (existingRequest) {
            console.log(`Updating existing UPM request for ${item.title}`);
            await supabase
                .from('upm_requests')
                .update({
                    amount_proposed: item.amount,
                    amount_approved: item.amount, // Assuming approved = proposed for this data
                    status: item.completed ? 'disbursed' : 'approved', // Map 'Selesai' to disbursed/approved
                    description: `Pengajuan dana untuk ${item.title}`
                })
                .eq('id', existingRequest.id);
        } else {
            console.log(`Creating new UPM request for ${item.title}`);
            await supabase
                .from('upm_requests')
                .insert({
                    allocation_id: allocation.id,
                    program_id: event.id,
                    description: `Pengajuan dana untuk ${item.title}`,
                    amount_proposed: item.amount,
                    amount_approved: item.amount,
                    status: item.completed ? 'disbursed' : 'approved'
                });
        }
    }
    console.log('UPM Update Complete.');
}

updateUPM();
