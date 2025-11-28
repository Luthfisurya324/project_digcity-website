-- Create finance_transactions table
CREATE TABLE IF NOT EXISTS public.finance_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(15, 2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    proof_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    sub_account TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Backward compatible: ensure new columns exist when table already created
ALTER TABLE public.finance_transactions
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

ALTER TABLE public.finance_transactions
    ADD COLUMN IF NOT EXISTS sub_account TEXT;

ALTER TABLE public.finance_transactions
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Enable RLS
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow read access to authenticated users (internal members)
CREATE POLICY "Allow read access to authenticated users"
ON public.finance_transactions
FOR SELECT
TO authenticated
USING (true);

-- Allow insert access to authenticated users
CREATE POLICY "Allow insert access to authenticated users"
ON public.finance_transactions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Allow update access to own records (or admin - simplified for now)
CREATE POLICY "Allow update access to own records"
ON public.finance_transactions
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);

-- Allow delete access to own records
CREATE POLICY "Allow delete access to own records"
ON public.finance_transactions
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- Create storage bucket for finance proofs if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('finance-proofs', 'finance-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Give authenticated users access to finance proofs"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'finance-proofs')
WITH CHECK (bucket_id = 'finance-proofs');

CREATE POLICY "Allow public read access to finance proofs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'finance-proofs');

-- Member dues table for iuran & invoice tracking
CREATE TABLE IF NOT EXISTS public.member_dues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID,
    member_name TEXT NOT NULL,
    division TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid')),
    invoice_number TEXT NOT NULL,
    notes TEXT,
    transaction_id UUID REFERENCES public.finance_transactions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.member_dues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read dues"
ON public.member_dues
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated insert dues"
ON public.member_dues
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update dues"
ON public.member_dues
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated delete dues"
ON public.member_dues
FOR DELETE
TO authenticated
USING (true);

