
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchPositions() {
    const { data, error } = await supabase
        .from('organization_members')
        .select('position')

    if (error) {
        console.error('Error fetching positions:', error)
        return
    }

    const positions = [...new Set(data.map((m: any) => m.position))].sort()
    console.log('Distinct Positions:', JSON.stringify(positions, null, 2))
}

fetchPositions()
