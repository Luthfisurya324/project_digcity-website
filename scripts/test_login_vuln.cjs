const { createClient } = require('@supabase/supabase-js');

// Load env vars
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testLoginLogic() {
    console.log('Testing Login Logic...');

    const testEmail = 'test_login_vuln@example.com';
    const defaultPassword = 'digcity123';
    const wrongPassword = 'wrongpassword';

    // Cleanup first
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === testEmail)?.id || '00000000-0000-0000-0000-000000000000'
    );
    if (deleteError) console.log('Cleanup (expected if user missing):', deleteError.message);

    // 1. Simulate "Login as anyone" (New User)
    console.log('\n--- Test 1: New User Login with WRONG password ---');
    // Current logic: signIn fails -> signUp(default) -> signIn(default)

    // Step A: SignIn fails
    const { error: signInError1 } = await supabase.auth.signInWithPassword({ email: testEmail, password: wrongPassword });
    console.log('SignIn 1 (Wrong Pass) Result:', signInError1 ? 'Failed (Expected)' : 'Success (Unexpected)');

    if (signInError1) {
        // Step B: Fallback Logic (Simulated)
        console.log('Triggering Fallback...');
        // Note: In real app, it checks membersAPI. We'll skip that check for this test or assume it passes.

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email: testEmail, password: defaultPassword });

        if (signUpError) {
            console.log('SignUp Error:', signUpError.message);
        } else {
            console.log('SignUp Success (Account Created). User ID:', signUpData.user?.id);

            // Step C: SignIn with default
            const { data: signInData2, error: signInError2 } = await supabase.auth.signInWithPassword({ email: testEmail, password: defaultPassword });
            if (signInError2) {
                console.log('SignIn 2 (Default Pass) Failed:', signInError2.message);
            } else {
                console.log('SignIn 2 (Default Pass) Success! VULNERABILITY CONFIRMED: Logged in despite providing wrong password initially.');
            }
        }
    }

    // 2. Simulate "Old Password" (Existing User)
    console.log('\n--- Test 2: Existing User Login with WRONG password ---');
    // User now exists (from Test 1). Let's change their password to something else.
    const newPassword = 'newsecurepassword';
    await supabase.auth.updateUser({ password: newPassword });
    console.log('Password updated to:', newPassword);

    // Now try to login with "wrong" password (e.g. the old default one, or just random)
    const { error: signInError3 } = await supabase.auth.signInWithPassword({ email: testEmail, password: wrongPassword });
    console.log('SignIn 3 (Wrong Pass) Result:', signInError3 ? 'Failed (Expected)' : 'Success (Unexpected)');

    if (signInError3) {
        // Fallback Logic
        console.log('Triggering Fallback...');
        const { data: signUpData2, error: signUpError2 } = await supabase.auth.signUp({ email: testEmail, password: defaultPassword });

        if (signUpError2) {
            console.log('SignUp Error (Expected):', signUpError2.message);
        } else if (signUpData2.user && !signUpData2.session) {
            console.log('SignUp returned User but NO Session (Expected for existing user).');
        } else {
            console.log('SignUp Success (Unexpected). Session:', signUpData2.session ? 'Yes' : 'No');
        }
    }
}

testLoginLogic();
