-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Can be UUID or 'anonymous'
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ip_address TEXT -- Optional, good to have
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow insert for everyone (authenticated and anon) so we can log login attempts etc.
CREATE POLICY "Enable insert for all users" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- Allow select for authenticated users (or maybe just admins? for now all authenticated)
CREATE POLICY "Enable select for authenticated users" ON public.audit_logs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_module ON public.audit_logs(module);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
