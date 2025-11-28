-- Create upm_allocations table
CREATE TABLE IF NOT EXISTS public.upm_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period TEXT NOT NULL,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create upm_requests table
CREATE TABLE IF NOT EXISTS public.upm_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    allocation_id UUID REFERENCES public.upm_allocations(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.internal_events(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    amount_proposed NUMERIC NOT NULL DEFAULT 0,
    amount_approved NUMERIC,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'disbursed')),
    submission_date DATE DEFAULT CURRENT_DATE,
    disbursement_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.upm_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upm_requests ENABLE ROW LEVEL SECURITY;

-- Create policies (simplified for now, allowing all authenticated users to read/write)
CREATE POLICY "Enable read access for all users" ON public.upm_allocations FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.upm_allocations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.upm_allocations FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.upm_allocations FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.upm_requests FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.upm_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.upm_requests FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.upm_requests FOR DELETE USING (true);
