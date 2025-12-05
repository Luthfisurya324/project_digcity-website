const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mqjdyiyoigjnfadqatrx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamR5aXlvaWdqbmZhZHFhdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MjY4NTcsImV4cCI6MjA3MTAwMjg1N30.onUd1j0u_MyPmDz4WF5egO2ksPT5o9_2TTSry3QUuYo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testRpc() {
    console.log('Testing get_dues_count RPC...');
    const { data, error } = await supabase.rpc('get_dues_count');

    if (error) {
        console.error('RPC failed:', error);
    } else {
        console.log('RPC success. Count:', data);
    }
}

testRpc();
