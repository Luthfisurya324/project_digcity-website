-- COMPLETE SCHEMA FOR DIGCITY INTERNAL SYSTEM REPLICATION
-- Run this script in the Supabase SQL Editor of your NEW project.

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums (Custom Types)
CREATE TYPE user_gender AS ENUM ('male', 'female', 'other');
CREATE TYPE member_status AS ENUM ('active', 'leave', 'alumni', 'resigned');
CREATE TYPE event_type AS ENUM ('meeting', 'work_program', 'gathering', 'other');
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE attendance_status AS ENUM ('present', 'late', 'excused', 'absent');
CREATE TYPE finance_type AS ENUM ('income', 'expense');
CREATE TYPE finance_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE due_status AS ENUM ('unpaid', 'partial', 'paid');
CREATE TYPE upm_status AS ENUM ('pending', 'approved', 'rejected', 'disbursed');

-- 3. Create Tables

-- Organization Members Table
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    npm TEXT,
    email TEXT,
    phone TEXT,
    division TEXT NOT NULL,
    position TEXT NOT NULL,
    join_year INTEGER NOT NULL,
    status member_status DEFAULT 'active',
    image_url TEXT,
    linkedin_url TEXT,
    instagram_handle TEXT,
    gender user_gender,
    class_category TEXT,
    class_name TEXT,
    city TEXT,
    province TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Internal Events Table
CREATE TABLE IF NOT EXISTS public.internal_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    division TEXT NOT NULL,
    division_id UUID,
    type event_type DEFAULT 'meeting',
    status event_status DEFAULT 'upcoming',
    qr_code TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.internal_events(id) ON DELETE CASCADE,
    member_id UUID REFERENCES public.organization_members(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    npm TEXT,
    status attendance_status DEFAULT 'present',
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Finance Transactions Table
CREATE TABLE IF NOT EXISTS public.finance_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type finance_type NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    proof_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    status finance_status DEFAULT 'pending',
    sub_account TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Member Dues (Iuran) Table
CREATE TABLE IF NOT EXISTS public.member_dues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES public.organization_members(id),
    member_name TEXT NOT NULL,
    division TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    status due_status DEFAULT 'unpaid',
    invoice_number TEXT NOT NULL,
    notes TEXT,
    transaction_id UUID REFERENCES public.finance_transactions(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, 
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ip_address TEXT 
);

-- UPM (Uang Pemasukan/Program) Tables
CREATE TABLE IF NOT EXISTS public.upm_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period TEXT NOT NULL,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.upm_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    allocation_id UUID REFERENCES public.upm_allocations(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.internal_events(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    amount_proposed NUMERIC NOT NULL DEFAULT 0,
    amount_approved NUMERIC,
    status upm_status DEFAULT 'pending',
    submission_date DATE DEFAULT CURRENT_DATE,
    disbursement_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories (from original schema, useful for public site if needed)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_category_name UNIQUE (name)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_dues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upm_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upm_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 5. Create Generic Policies (Permissive for Replication Start)
-- You may want to restrict these later based on your specific needs.
-- NOTE: For a real production app, apply stricter policies based on 'auth.uid()'.
-- For replication/starter ease, we allow authenticated users to view/edit mostly.

-- Organization Members
CREATE POLICY "Public read members" ON public.organization_members FOR SELECT USING (true);
CREATE POLICY "Auth all members" ON public.organization_members FOR ALL USING (auth.role() = 'authenticated');

-- Internal Events
CREATE POLICY "Public read events" ON public.internal_events FOR SELECT USING (true);
CREATE POLICY "Auth all events" ON public.internal_events FOR ALL USING (auth.role() = 'authenticated');

-- Attendance
CREATE POLICY "Public read attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Auth all attendance" ON public.attendance FOR ALL USING (auth.role() = 'authenticated');

-- Finance
CREATE POLICY "Auth read finance" ON public.finance_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth all finance" ON public.finance_transactions FOR ALL TO authenticated USING (true);

-- Dues
CREATE POLICY "Auth read dues" ON public.member_dues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth all dues" ON public.member_dues FOR ALL TO authenticated USING (true);

-- Audit Logs
CREATE POLICY "Auth read audit" ON public.audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert audit" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- UPM
CREATE POLICY "Auth read upm" ON public.upm_allocations FOR SELECT USING (true);
CREATE POLICY "Auth all upm" ON public.upm_allocations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read upm req" ON public.upm_requests FOR SELECT USING (true);
CREATE POLICY "Auth all upm req" ON public.upm_requests FOR ALL USING (auth.role() = 'authenticated');

-- Categories
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Auth all categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated');

-- 6. Setup Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('finance-proofs', 'finance-proofs', true) ON CONFLICT DO NOTHING;
insert into storage.buckets (id, name, public) values ('images', 'images', true) ON CONFLICT DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access Finance" ON storage.objects FOR SELECT USING (bucket_id = 'finance-proofs');
CREATE POLICY "Auth Upload Finance" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'finance-proofs');

CREATE POLICY "Public Access Images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Auth Upload Images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');

-- 7. Triggers for Updated At
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_org_members_modtime BEFORE UPDATE ON public.organization_members FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_events_modtime BEFORE UPDATE ON public.internal_events FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_finance_modtime BEFORE UPDATE ON public.finance_transactions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- 8. Triggers for Audit Logs (Optional but recommended)
-- Simple trigger to log changes on finance as an example
CREATE OR REPLACE FUNCTION log_finance_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.audit_logs (user_id, module, action, entity_type, entity_id, details)
        VALUES (auth.uid()::text, 'finance', 'create', 'transaction', NEW.id::text, row_to_json(NEW));
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.audit_logs (user_id, module, action, entity_type, entity_id, details)
        VALUES (auth.uid()::text, 'finance', 'update', 'transaction', NEW.id::text, row_to_json(NEW));
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.audit_logs (user_id, module, action, entity_type, entity_id, details)
        VALUES (auth.uid()::text, 'finance', 'delete', 'transaction', OLD.id::text, row_to_json(OLD));
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_finance_ops
AFTER INSERT OR UPDATE OR DELETE ON public.finance_transactions
FOR EACH ROW EXECUTE PROCEDURE log_finance_changes();
