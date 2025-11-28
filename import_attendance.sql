
DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Umum , Kadiv dan Sekdiv (2025-01-18)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-01-18' AND title = 'Rapat BPH Umum , Kadiv dan Sekdiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum , Kadiv dan Sekdiv', '2025-01-18', 'Sekretariat DIGCITY', 'Rapat BPH Umum , Kadiv dan Sekdiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Umum dan Kadiv (2025-01-29)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-01-29' AND title = 'Rapat BPH Umum dan Kadiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum dan Kadiv', '2025-01-29', 'Sekretariat DIGCITY', 'Rapat BPH Umum dan Kadiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-01-29 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-01-29 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-01-29 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-01-29 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-01-29 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-01-29 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Umum Perihal Teknis Open Recruitment Maba24 (2025-02-15)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-02-15' AND title = 'Rapat BPH Umum Perihal Teknis Open Recruitment Maba24';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum Perihal Teknis Open Recruitment Maba24', '2025-02-15', 'Sekretariat FEB', 'Rapat BPH Umum Perihal Teknis Open Recruitment Maba24', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-02-15 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-02-15 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-02-15 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Umum dan Kadiv Perihal Teknis Oprec Maba24 (2025-02-19)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-02-19' AND title = 'Rapat BPH Umum dan Kadiv Perihal Teknis Oprec Maba24';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum dan Kadiv Perihal Teknis Oprec Maba24', '2025-02-19', 'Sekretariat DIGCITY', 'Rapat BPH Umum dan Kadiv Perihal Teknis Oprec Maba24', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-02-19 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-02-19 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-02-19 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-02-19 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-02-19 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-02-19 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Umum, Kadiv dan Sekdiv (2025-02-27)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-02-27' AND title = 'Rapat BPH Umum, Kadiv dan Sekdiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum, Kadiv dan Sekdiv', '2025-02-27', 'Sekretariaf FEB', 'Rapat BPH Umum, Kadiv dan Sekdiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Umum Perihal Pelantikan dan Raker (2025-03-01)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-03-01' AND title = 'Rapat BPH Umum Perihal Pelantikan dan Raker';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum Perihal Pelantikan dan Raker', '2025-03-01', 'https://meet.google.com/kbn-nsgv-nzy', 'Rapat BPH Umum Perihal Pelantikan dan Raker', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-03-01 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-03-01 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-03-01 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-03-01 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Kerja Anggota DIGCITY Periode 2025 (2025-03-09)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-03-09' AND title = 'Rapat Kerja Anggota DIGCITY Periode 2025';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Kerja Anggota DIGCITY Periode 2025', '2025-03-09', 'Sekretariat FEB Lt.2', 'Rapat Kerja Anggota DIGCITY Periode 2025', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Shintawati Khoirunnisa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Shintawati Khoirunnisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Shintawati Khoirunnisa', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hana Aurora Aida Rahma
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hana Aurora Aida Rahma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hana Aurora Aida Rahma', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salma Difa Aristawidya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Salma Difa Aristawidya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salma Difa Aristawidya', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ocha Nurfitriani
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ocha Nurfitriani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ocha Nurfitriani', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Cika Jelita
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Cika Jelita' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Cika Jelita', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Arsya Syaira Olivia
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Arsya Syaira Olivia' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Arsya Syaira Olivia', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syifa Sakina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syifa Sakina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syifa Sakina', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Riqzin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Riqzin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Riqzin Priyatno', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Gyana Nisrina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Gyana Nisrina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Gyana Nisrina', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nayla Rania
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nayla Rania' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nayla Rania', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ayu Maudya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ayu Maudya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ayu Maudya', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nabila Resta Nasya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nabila Resta Nasya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nabila Resta Nasya', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Putri Nadia Rohimah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Putri Nadia Rohimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Putri Nadia Rohimah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Juliana Putri Husnul Khotimah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Juliana Putri Husnul Khotimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Juliana Putri Husnul Khotimah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Annisa Aulia Supriyadi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Annisa Aulia Supriyadi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Annisa Aulia Supriyadi', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tiffany
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tiffany' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tiffany', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Kayla Fika Assyfa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Kayla Fika Assyfa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Kayla Fika Assyfa', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Indah Ramadan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Indah Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Indah Ramadan', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Sakia Nurisma
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Sakia Nurisma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Sakia Nurisma', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Humaira Afifah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Humaira Afifah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Humaira Afifah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Naprisa Tri Hapsari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Naprisa Tri Hapsari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Naprisa Tri Hapsari', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salsakinah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Salsakinah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salsakinah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Satrio Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Ali Akbar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Ali Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Ali Akbar', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fadhil Suprayitna
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fadhil Suprayitna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fadhil Suprayitna', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Anggi Marsuna
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Anggi Marsuna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Anggi Marsuna', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Farrand Hafizh
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Farrand Hafizh' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Farrand Hafizh', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Lana Aulia Salsabila
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Lana Aulia Salsabila' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Lana Aulia Salsabila', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fara Diba
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fara Diba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fara Diba', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ikhwanul Akmal
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ikhwanul Akmal' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ikhwanul Akmal', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rakha Fathin Budiman
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Rakha Fathin Budiman' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rakha Fathin Budiman', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri Ramadhoan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri Ramadhoan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri Ramadhoan', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Najmi Ramadhan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Najmi Ramadhan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Najmi Ramadhan', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahrul Ramadan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syahrul Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahrul Ramadan', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Faqih Alfarizi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Faqih Alfarizi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Faqih Alfarizi', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mohammad Sunjaya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Mohammad Sunjaya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Mohammad Sunjaya Saputra', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Akbar Supia Dirja
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Akbar Supia Dirja' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Akbar Supia Dirja', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ichsan Nur Fahmi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ichsan Nur Fahmi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ichsan Nur Fahmi', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Luqman Baihaqi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luqman Baihaqi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luqman Baihaqi', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nesya Aulia Putri Purba
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nesya Aulia Putri Purba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nesya Aulia Putri Purba', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Qisti Salsabila Fauhani
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Qisti Salsabila Fauhani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Qisti Salsabila Fauhani', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabby Putra Malkiswa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabby Putra Malkiswa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabby Putra Malkiswa', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Anisa Nur Ramadhani
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Anisa Nur Ramadhani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Anisa Nur Ramadhani', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Umum (2025-03-05)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-03-05' AND title = 'Rapat BPH Umum';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum', '2025-03-05', 'Sekretariat DIGCITY', 'Rapat BPH Umum', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-03-05 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-03-05 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-03-05 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Evaluasi BPH Umum, Kadiv dan Sekdiv (2025-03-21)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-03-21' AND title = 'Rapat Evaluasi BPH Umum, Kadiv dan Sekdiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi BPH Umum, Kadiv dan Sekdiv', '2025-03-21', 'Sekretariat DIGCITY', 'Rapat Evaluasi BPH Umum, Kadiv dan Sekdiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Umum Perihal Pengembangan Sistem (2025-03-28)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-03-28' AND title = 'Rapat BPH Umum Perihal Pengembangan Sistem';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum Perihal Pengembangan Sistem', '2025-03-28', 'Online', 'Rapat BPH Umum Perihal Pengembangan Sistem', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-03-28 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-03-28 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-03-28 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-03-28 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Membahas Stall of Business (SOB) (2025-04-13)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-04-13' AND title = 'Membahas Stall of Business (SOB)';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Membahas Stall of Business (SOB)', '2025-04-13', 'https://meet.google.com/tme-cdkr-vnj', 'Membahas Stall of Business (SOB)', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Zaieq Zidane Al Faza
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Zaieq Zidane Al Faza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Al Faza', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Elsha Nurdwi Baharsyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Elsha Nurdwi Baharsyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Elsha Nurdwi Baharsyah', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Cika Jelita
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Cika Jelita' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Cika Jelita', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Humaira Alifah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Humaira Alifah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Humaira Alifah', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Latia Fatimah Dewi Apriliyani
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Latia Fatimah Dewi Apriliyani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Latia Fatimah Dewi Apriliyani', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Sakia Nurisma
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Sakia Nurisma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Sakia Nurisma', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fadhil Suprayitna
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fadhil Suprayitna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fadhil Suprayitna', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Najmi Ramadhan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Najmi Ramadhan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Najmi Ramadhan', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Ali Akbar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Ali Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Ali Akbar', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Juliana Putri Husnul Khotimah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Juliana Putri Husnul Khotimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Juliana Putri Husnul Khotimah', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Alfiyyah Rima Afifah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Alfiyyah Rima Afifah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Alfiyyah Rima Afifah', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Syafiq Al Ghifari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Syafiq Al Ghifari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Syafiq Al Ghifari', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nadris A. Badrun
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nadris A. Badrun' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nadris A. Badrun', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Ikhsan Ramadhan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Ikhsan Ramadhan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Ikhsan Ramadhan', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ocha Nurfitriani
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ocha Nurfitriani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ocha Nurfitriani', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nesya Alia Putri Purba
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nesya Alia Putri Purba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nesya Alia Putri Purba', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rian Kurniawan Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Rian Kurniawan Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rian Kurniawan Saputra', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Akhdan Putra Hermawan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Akhdan Putra Hermawan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Akhdan Putra Hermawan', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Andini Aulia Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Andini Aulia Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Andini Aulia Putri', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Maulana Farid Fatin
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Maulana Farid Fatin' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Maulana Farid Fatin', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Pembahasan Workshop Desain Canva (2025-04-18)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-04-18' AND title = 'Pembahasan Workshop Desain Canva';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Pembahasan Workshop Desain Canva', '2025-04-18', 'Sekretariat FEB', 'Pembahasan Workshop Desain Canva', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fara Diba
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fara Diba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fara Diba', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Aghnia Fatihin
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Adinda Aghnia Fatihin' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Aghnia Fatihin', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salma Difa Aristawidya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Salma Difa Aristawidya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salma Difa Aristawidya', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Naprisa Tri Hapsari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Naprisa Tri Hapsari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Naprisa Tri Hapsari', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Gyana Nisrina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Gyana Nisrina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Gyana Nisrina', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nayla Rania
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nayla Rania' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nayla Rania', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Indah Ramadan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Indah Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Indah Ramadan', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tiffany
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tiffany' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tiffany', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Qisti Salsabila Fauhani
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Qisti Salsabila Fauhani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Qisti Salsabila Fauhani', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Anggi Marsuna
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Anggi Marsuna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Anggi Marsuna', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabby Putra Malkiswa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabby Putra Malkiswa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabby Putra Malkiswa', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Annisa Aulia Supriyadi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Annisa Aulia Supriyadi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Annisa Aulia Supriyadi', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ilyas Lutfi Abdat
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ilyas Lutfi Abdat' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ilyas Lutfi Abdat', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Rian Hermawan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Rian Hermawan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Rian Hermawan', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Luthfi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Luthfi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Luthfi', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mulya Nur Wicaksono
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Mulya Nur Wicaksono' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Mulya Nur Wicaksono', 'excused', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Kayla Fika Assyfa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Kayla Fika Assyfa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Kayla Fika Assyfa', 'excused', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Mengenai SERIES (2025-04-23)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-04-23' AND title = 'Rapat Mengenai SERIES';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Mengenai SERIES', '2025-04-23', 'https://meet.google.com/vfy-ddfe-jxo', 'Rapat Mengenai SERIES', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar Sanyoto
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Satrio Akbar Sanyoto' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar Sanyoto', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat SERIES (2025-04-25)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-04-25' AND title = 'Rapat SERIES';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat SERIES', '2025-04-25', 'meet.google.com/kkf-bcxe-uac', 'Rapat SERIES', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar Sanyoto
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Satrio Akbar Sanyoto' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar Sanyoto', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Koordinasi BPH Umum, Kadiv dan Sekdiv (2025-05-07)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-05-07' AND title = 'Rapat Koordinasi BPH Umum, Kadiv dan Sekdiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Koordinasi BPH Umum, Kadiv dan Sekdiv', '2025-05-07', 'Sekretariat DIGCITY', 'Rapat Koordinasi BPH Umum, Kadiv dan Sekdiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Workshop Canva (2025-05-26)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-05-26' AND title = 'Rapat Workshop Canva';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Workshop Canva', '2025-05-26', 'Ruang 207', 'Rapat Workshop Canva', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Qisti Salsabila Fauhani
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Qisti Salsabila Fauhani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Qisti Salsabila Fauhani', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Naprisa Tri Hapsari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Naprisa Tri Hapsari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Naprisa Tri Hapsari', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Kayla Fika Assyfa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Kayla Fika Assyfa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Kayla Fika Assyfa', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Indah Ramadan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Indah Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Indah Ramadan', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tiffany
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tiffany' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tiffany', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabby Putra Malkiswa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabby Putra Malkiswa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabby Putra Malkiswa', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Annisa Aulia Supriyadi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Annisa Aulia Supriyadi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Annisa Aulia Supriyadi', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Anggi Marsuna
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Anggi Marsuna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Anggi Marsuna', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salma Difa Aristawidya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Salma Difa Aristawidya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salma Difa Aristawidya', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Putri Nadia Rohimah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Putri Nadia Rohimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Putri Nadia Rohimah', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nayla Rania Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nayla Rania Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nayla Rania Putri', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Gyana Nisrina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Gyana Nisrina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Gyana Nisrina', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mulya Nur Wicaksono
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Mulya Nur Wicaksono' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Mulya Nur Wicaksono', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Progres Workshop Canva (2025-05-27)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-05-27' AND title = 'Rapat Progres Workshop Canva';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Progres Workshop Canva', '2025-05-27', 'Ruang 206', 'Rapat Progres Workshop Canva', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Annisa Aulia Supriyadi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Annisa Aulia Supriyadi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Annisa Aulia Supriyadi', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Indah Ramadan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Indah Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Indah Ramadan', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Naprisa Tri Hapsari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Naprisa Tri Hapsari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Naprisa Tri Hapsari', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Qisti Salsabila Fauhani
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Qisti Salsabila Fauhani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Qisti Salsabila Fauhani', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fara Diba
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fara Diba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fara Diba', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ilyas Lutfi Abdat
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ilyas Lutfi Abdat' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ilyas Lutfi Abdat', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Rian Hermawan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Rian Hermawan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Rian Hermawan', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Luthfi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Luthfi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Luthfi', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Anggi Marsuna
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Anggi Marsuna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Anggi Marsuna', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabby Putra Malkiswa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabby Putra Malkiswa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabby Putra Malkiswa', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahrul Ramadan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syahrul Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahrul Ramadan', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mulya Nur Wicaksono
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Mulya Nur Wicaksono' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Mulya Nur Wicaksono', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nayla Rania Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nayla Rania Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nayla Rania Putri', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Gyana Nisrina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Gyana Nisrina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Gyana Nisrina', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Kayla Fika Assyfa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Kayla Fika Assyfa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Kayla Fika Assyfa', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Putri Nadia Rohimah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Putri Nadia Rohimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Putri Nadia Rohimah', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tiffany
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tiffany' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tiffany', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Pembahasan Studi Banding DIGCITY X HIMABISDIG UNAS (2025-06-13)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-06-13' AND title = 'Rapat Pembahasan Studi Banding DIGCITY X HIMABISDIG UNAS';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Pembahasan Studi Banding DIGCITY X HIMABISDIG UNAS', '2025-06-13', 'https://meet.google.com/jdp-viyn-udb', 'Rapat Pembahasan Studi Banding DIGCITY X HIMABISDIG UNAS', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Studi Banding (2025-06-15)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-06-15' AND title = 'Rapat Studi Banding';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Studi Banding', '2025-06-15', 'https://meet.google.com/tay-xpvg-rcb', 'Rapat Studi Banding', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar Sanyoto
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Satrio Akbar Sanyoto' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar Sanyoto', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'excused', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mohammad Sunjaya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Mohammad Sunjaya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Mohammad Sunjaya Saputra', 'absent', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Evaluasi BPH Umum dan Perihal Permasalahan Lainnya (2025-06-20)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-06-20' AND title = 'Evaluasi BPH Umum dan Perihal Permasalahan Lainnya';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Evaluasi BPH Umum dan Perihal Permasalahan Lainnya', '2025-06-20', 'Sekretariat DIGCITY', 'Evaluasi BPH Umum dan Perihal Permasalahan Lainnya', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-06-20 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-06-20 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-06-20 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-06-20 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Evaluasi BPH Umum dan Kadiv + Sekdiv (2025-06-21)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-06-21' AND title = 'Rapat Evaluasi BPH Umum dan Kadiv + Sekdiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi BPH Umum dan Kadiv + Sekdiv', '2025-06-21', 'Sekretarit DIGCITY', 'Rapat Evaluasi BPH Umum dan Kadiv + Sekdiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-06-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-06-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-06-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-06-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-06-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-06-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat D'BASIC Perihal RAB Per Divisi (2025-06-21)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-06-21' AND title = 'Rapat D''BASIC Perihal RAB Per Divisi';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat D''BASIC Perihal RAB Per Divisi', '2025-06-21', 'Sekretariat FEB', 'Rapat D''BASIC Perihal RAB Per Divisi', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rakha Fathin Budiman
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Rakha Fathin Budiman' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rakha Fathin Budiman', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Akbar Supia Dirja
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Akbar Supia Dirja' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Akbar Supia Dirja', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Faqih Alfarizi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Faqih Alfarizi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Faqih Alfarizi', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Ali Akbar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Ali Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Ali Akbar', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Luqman Baihaqi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luqman Baihaqi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luqman Baihaqi', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri Ramadhoan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri Ramadhoan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri Ramadhoan', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ichsan Nur Fahmi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ichsan Nur Fahmi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ichsan Nur Fahmi', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fara Diba
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fara Diba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fara Diba', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hana Aurora Aida Rahma
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hana Aurora Aida Rahma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hana Aurora Aida Rahma', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ayu Maudya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ayu Maudya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ayu Maudya', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syifa Sakina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syifa Sakina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syifa Sakina', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Arsya Syaira Olivia
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Arsya Syaira Olivia' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Arsya Syaira Olivia', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Qisti Salsabila Fauhani
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Qisti Salsabila Fauhani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Qisti Salsabila Fauhani', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nesya Alia Putri Purba
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nesya Alia Putri Purba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nesya Alia Putri Purba', 'present', '2025-06-21 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Evaluasi Divisi Economy Creative (2025-07-03)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-07-03' AND title = 'Rapat Evaluasi Divisi Economy Creative';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi Divisi Economy Creative', '2025-07-03', 'Resto TOWN HOUSE Cimanggu', 'Rapat Evaluasi Divisi Economy Creative', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Elsha Nurdwi Baharsyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Elsha Nurdwi Baharsyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Elsha Nurdwi Baharsyah', 'present', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Juliana Putri Husnul Khotimah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Juliana Putri Husnul Khotimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Juliana Putri Husnul Khotimah', 'present', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Sakia Nurisma
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Sakia Nurisma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Sakia Nurisma', 'present', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Humaira Alifah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Humaira Alifah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Humaira Alifah', 'present', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rian Kurniawan Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Rian Kurniawan Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rian Kurniawan Saputra', 'present', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fadhil Suprayitna
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fadhil Suprayitna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fadhil Suprayitna', 'present', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Najmi Ramadhan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Najmi Ramadhan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Najmi Ramadhan', 'present', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Andini Aulia Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Andini Aulia Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Andini Aulia Putri', 'excused', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Latia Fatimah Dewi Apriliyani
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Latia Fatimah Dewi Apriliyani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Latia Fatimah Dewi Apriliyani', 'excused', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Neysa Alia Putri Purba
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Neysa Alia Putri Purba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Neysa Alia Putri Purba', 'excused', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Ali Akbar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Ali Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Ali Akbar', 'excused', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Cika Jelita
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Cika Jelita' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Cika Jelita', 'excused', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Alfiyyah Rima Afifah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Alfiyyah Rima Afifah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Alfiyyah Rima Afifah', 'excused', '2025-07-03 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Acara dan Divisi Acara D'Basic (2025-07-05)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-07-05' AND title = 'Rapat BPH Acara dan Divisi Acara D''Basic';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Acara dan Divisi Acara D''Basic', '2025-07-05', 'https://meet.google.com/buz-ybsz-zrg', 'Rapat BPH Acara dan Divisi Acara D''Basic', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-07-05 00:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-07-05 00:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'present', '2025-07-05 00:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Akbar Supia Dirja
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Akbar Supia Dirja' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Akbar Supia Dirja', 'present', '2025-07-05 00:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fara Diba
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fara Diba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fara Diba', 'present', '2025-07-05 00:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rakha Fathin Budiman
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Rakha Fathin Budiman' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rakha Fathin Budiman', 'present', '2025-07-05 00:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ayu Maudya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ayu Maudya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ayu Maudya', 'present', '2025-07-05 00:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salsakinah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Salsakinah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salsakinah', 'present', '2025-07-05 00:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Studi Banding (2025-07-08)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-07-08' AND title = 'Rapat Studi Banding';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Studi Banding', '2025-07-08', 'https://meet.google.com/gxz-vsau-yif', 'Rapat Studi Banding', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-07-08 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-07-08 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-07-08 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-07-08 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-07-08 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-07-08 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-07-08 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-07-08 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-07-08 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-07-08 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-07-08 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Andhika Surya Pratama
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Andhika Surya Pratama' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Andhika Surya Pratama', 'present', '2025-07-08 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Acara dan Koor D'Basic (2025-07-09)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-07-09' AND title = 'Rapat BPH Acara dan Koor D''Basic';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Acara dan Koor D''Basic', '2025-07-09', 'https://meet.google.com/apw-irsv-njg', 'Rapat BPH Acara dan Koor D''Basic', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-07-09 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-07-09 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-07-09 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nabila Resta Nasya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nabila Resta Nasya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nabila Resta Nasya', 'present', '2025-07-09 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syifa Sakina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syifa Sakina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syifa Sakina', 'present', '2025-07-09 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ichsan Nur Fahmi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ichsan Nur Fahmi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ichsan Nur Fahmi', 'present', '2025-07-09 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri Ramadhoan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri Ramadhoan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri Ramadhoan', 'present', '2025-07-09 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'present', '2025-07-09 20:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Divisi PDDL D'Basic Perihal Logo (2025-07-10)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-07-10' AND title = 'Rapat Divisi PDDL D''Basic Perihal Logo';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Divisi PDDL D''Basic Perihal Logo', '2025-07-10', 'https://meet.google.com/kdy-eqzi-uoc', 'Rapat Divisi PDDL D''Basic Perihal Logo', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-07-10 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-07-10 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-07-10 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nabila Resta Nasya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nabila Resta Nasya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nabila Resta Nasya', 'present', '2025-07-10 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Qisti Salsabila Fauhani
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Qisti Salsabila Fauhani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Qisti Salsabila Fauhani', 'present', '2025-07-10 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ichsan Nur Fahmi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ichsan Nur Fahmi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ichsan Nur Fahmi', 'present', '2025-07-10 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Farrand Hafizh
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Farrand Hafizh' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Farrand Hafizh', 'present', '2025-07-10 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Alfian Ilyassa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Alfian Ilyassa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Alfian Ilyassa', 'present', '2025-07-10 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Divisi Humas D'Basic (2025-07-10)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-07-10' AND title = 'Rapat Divisi Humas D''Basic';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Divisi Humas D''Basic', '2025-07-10', 'https://meet.google.com/fvo-ooob-dni', 'Rapat Divisi Humas D''Basic', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-07-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-07-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'present', '2025-07-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'present', '2025-07-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-07-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Latia Fatimah Dewi Apriliyani
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Latia Fatimah Dewi Apriliyani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Latia Fatimah Dewi Apriliyani', 'present', '2025-07-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Ali Akbar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Ali Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Ali Akbar', 'present', '2025-07-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Pembahasan Progres Studi Banding (2025-07-17)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-07-17' AND title = 'Rapat Pembahasan Progres Studi Banding';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Pembahasan Progres Studi Banding', '2025-07-17', 'Sekretariat DIGCITY', 'Rapat Pembahasan Progres Studi Banding', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-07-17 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-07-17 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-07-17 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-07-17 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-07-17 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-07-17 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-07-17 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-07-17 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-07-17 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-07-17 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-07-17 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-07-17 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Evaluasi Studi Banding (2025-07-21)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-07-21' AND title = 'Rapat Evaluasi Studi Banding';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi Studi Banding', '2025-07-21', 'Sekretariat DIGCITY', 'Rapat Evaluasi Studi Banding', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-07-21 10:20:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Evaluasi BPH Umum (2025-07-21)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-07-21' AND title = 'Rapat Evaluasi BPH Umum';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi BPH Umum', '2025-07-21', 'Sekretariat DIGCITY', 'Rapat Evaluasi BPH Umum', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-07-21 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-07-21 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-07-21 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-07-21 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Progres D'Basic (2025-07-31)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-07-31' AND title = 'Progres D''Basic';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Progres D''Basic', '2025-07-31', 'Sekretariat FEB', 'Progres D''Basic', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Farrand Hafizh
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Farrand Hafizh' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Farrand Hafizh', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Ali Akbar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Ali Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Ali Akbar', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rakha Fathin Budiman
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Rakha Fathin Budiman' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rakha Fathin Budiman', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Akbar Supia Dirja
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Akbar Supia Dirja' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Akbar Supia Dirja', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Luqman Baihaqi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luqman Baihaqi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luqman Baihaqi', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ichsan Nur Fahmi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ichsan Nur Fahmi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ichsan Nur Fahmi', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fara Diba
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fara Diba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fara Diba', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salsakinah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Salsakinah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salsakinah', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syifa Sakina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syifa Sakina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syifa Sakina', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nesya Alia Putri Purba
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nesya Alia Putri Purba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nesya Alia Putri Purba', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tiffany
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tiffany' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tiffany', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Indah Ramadan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Indah Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Indah Ramadan', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Putri Nadia Rohimah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Putri Nadia Rohimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Putri Nadia Rohimah', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Naprisa Tri Hapsari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Naprisa Tri Hapsari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Naprisa Tri Hapsari', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nayla Rania Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nayla Rania Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nayla Rania Putri', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Annisa Aulia Supriyadi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Annisa Aulia Supriyadi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Annisa Aulia Supriyadi', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ayu Maudya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ayu Maudya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ayu Maudya', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri Ramadhoan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri Ramadhoan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri Ramadhoan', 'present', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'excused', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hana Aurora Aida Rahma
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hana Aurora Aida Rahma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hana Aurora Aida Rahma', 'excused', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Kayla Fika Assyfa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Kayla Fika Assyfa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Kayla Fika Assyfa', 'excused', '2025-07-31 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Acara dan Koor D'Basic Perihal Fiksasi Timeline, (2025-08-05)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-08-05' AND title = 'Rapat BPH Acara dan Koor D''Basic Perihal Fiksasi Timeline,';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Acara dan Koor D''Basic Perihal Fiksasi Timeline,', '2025-08-05', 'https://meet.google.com/hrq-jknk-bfr', 'Rapat BPH Acara dan Koor D''Basic Perihal Fiksasi Timeline,', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-08-05 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-08-05 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-08-05 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nabila Resta Nasya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nabila Resta Nasya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nabila Resta Nasya', 'present', '2025-08-05 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syifa Sakina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syifa Sakina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syifa Sakina', 'present', '2025-08-05 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri Ramadhoan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri Ramadhoan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri Ramadhoan', 'present', '2025-08-05 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'excused', '2025-08-05 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'absent', '2025-08-05 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Umum, Kadiv dan Sekdiv (2025-08-11)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-08-11' AND title = 'Rapat BPH Umum, Kadiv dan Sekdiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum, Kadiv dan Sekdiv', '2025-08-11', 'https://meet.google.com/rrk-yokm-ohg', 'Rapat BPH Umum, Kadiv dan Sekdiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-08-11 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-08-11 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-08-11 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-08-11 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-08-11 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-08-11 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-08-11 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-08-11 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-08-11 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'excused', '2025-08-11 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-08-11 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Divisi Acara D'Basic (2025-08-15)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-08-15' AND title = 'Rapat Divisi Acara D''Basic';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Divisi Acara D''Basic', '2025-08-15', 'https://meet.google.com/tup-xjpn-dsf', 'Rapat Divisi Acara D''Basic', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-08-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-08-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nabila Resta Nasya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nabila Resta Nasya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nabila Resta Nasya', 'present', '2025-08-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri Ramadhoan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri Ramadhoan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri Ramadhoan', 'present', '2025-08-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ayu Maudya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ayu Maudya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ayu Maudya', 'present', '2025-08-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rakha Fathin Budiman
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Rakha Fathin Budiman' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rakha Fathin Budiman', 'present', '2025-08-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salsakinah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Salsakinah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salsakinah', 'present', '2025-08-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Faqih Alfarizi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Faqih Alfarizi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Faqih Alfarizi', 'present', '2025-08-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Anggi Marsuna
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Anggi Marsuna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Anggi Marsuna', 'present', '2025-08-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabby Putra Malkiswa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabby Putra Malkiswa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabby Putra Malkiswa', 'present', '2025-08-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fara Diba
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fara Diba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fara Diba', 'present', '2025-08-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Akbar Supia Dirja
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Akbar Supia Dirja' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Akbar Supia Dirja', 'present', '2025-08-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Perdana ACE (A Company Exploration) / Company Visit (2025-08-20)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-08-20' AND title = 'Rapat Perdana ACE (A Company Exploration) / Company Visit';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Perdana ACE (A Company Exploration) / Company Visit', '2025-08-20', 'https://meet.google.com/aiv-iehh-kqk', 'Rapat Perdana ACE (A Company Exploration) / Company Visit', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Satrio Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar', 'present', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'excused', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'excused', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'excused', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Andhika Surya Pratama
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Andhika Surya Pratama' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Andhika Surya Pratama', 'excused', '2025-08-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Kegiatan Digitalk (2025-08-28)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-08-28' AND title = 'Rapat Kegiatan Digitalk';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Kegiatan Digitalk', '2025-08-28', 'Ruang Creative', 'Rapat Kegiatan Digitalk', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-08-28 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-08-28 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-08-28 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-08-28 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Elsha Nurdwi Baharsyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Elsha Nurdwi Baharsyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Elsha Nurdwi Baharsyah', 'present', '2025-08-28 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Andini Aulia Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Andini Aulia Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Andini Aulia Putri', 'present', '2025-08-28 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Latia Fatimah Dewi Apriliyani
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Latia Fatimah Dewi Apriliyani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Latia Fatimah Dewi Apriliyani', 'present', '2025-08-28 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Juliana Putri Husnul Khotimah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Juliana Putri Husnul Khotimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Juliana Putri Husnul Khotimah', 'present', '2025-08-28 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Sakia Nurisma
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Sakia Nurisma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Sakia Nurisma', 'present', '2025-08-28 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Humaira Alifah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Humaira Alifah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Humaira Alifah', 'present', '2025-08-28 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Ali Akbar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Ali Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Ali Akbar', 'present', '2025-08-28 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Najmi Ramadhan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Najmi Ramadhan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Najmi Ramadhan', 'present', '2025-08-28 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Maulana Farid Fatin
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Maulana Farid Fatin' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Maulana Farid Fatin', 'present', '2025-08-28 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Perdana ACE (2025-09-02)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-09-02' AND title = 'Rapat Perdana ACE';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Perdana ACE', '2025-09-02', 'Ruang Creative', 'Rapat Perdana ACE', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-09-02 9:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-09-02 9:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-09-02 9:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-09-02 9:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-09-02 9:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-09-02 9:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-09-02 9:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-09-02 9:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat D'Basic Perihal Sponsorship dan Pelaksanaan Techmeet (2025-09-04)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-09-04' AND title = 'Rapat D''Basic Perihal Sponsorship dan Pelaksanaan Techmeet';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat D''Basic Perihal Sponsorship dan Pelaksanaan Techmeet', '2025-09-04', 'https://meet.google.com/wkk-furf-ugj', 'Rapat D''Basic Perihal Sponsorship dan Pelaksanaan Techmeet', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-09-04 20:10:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-09-04 20:10:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-09-04 20:10:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'present', '2025-09-04 20:10:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Divisi POD Perihal TTS, Bounding Akt 25, Perkaderan Digcity (2025-09-08)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-09-08' AND title = 'Rapat Divisi POD Perihal TTS, Bounding Akt 25, Perkaderan Digcity';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Divisi POD Perihal TTS, Bounding Akt 25, Perkaderan Digcity', '2025-09-08', 'Sekretariat FEB', 'Rapat Divisi POD Perihal TTS, Bounding Akt 25, Perkaderan Digcity', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-09-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-09-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Akbar Supia Dirja
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Akbar Supia Dirja' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Akbar Supia Dirja', 'present', '2025-09-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-09-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ichsan Nur Fahmi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ichsan Nur Fahmi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ichsan Nur Fahmi', 'present', '2025-09-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Luqman Baihaqi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luqman Baihaqi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luqman Baihaqi', 'present', '2025-09-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Farrand Hafizh
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Farrand Hafizh' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Farrand Hafizh', 'present', '2025-09-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'present', '2025-09-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rakha Fathin Budiman
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Rakha Fathin Budiman' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rakha Fathin Budiman', 'present', '2025-09-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ayu Maudya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ayu Maudya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ayu Maudya', 'present', '2025-09-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syifa Sakina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syifa Sakina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syifa Sakina', 'present', '2025-09-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nabila Resta Nasya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nabila Resta Nasya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nabila Resta Nasya', 'present', '2025-09-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-09-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Acara dan Koor ACE, Perihal Progres Per Divisi (2025-09-10)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-09-10' AND title = 'Rapat BPH Acara dan Koor ACE, Perihal Progres Per Divisi';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Acara dan Koor ACE, Perihal Progres Per Divisi', '2025-09-10', 'https://meet.google.com/nvf-vpux-cyf', 'Rapat BPH Acara dan Koor ACE, Perihal Progres Per Divisi', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-09-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-09-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-09-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-09-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-09-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-09-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Acara dan Koor D'Basic (2025-09-12)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-09-12' AND title = 'Rapat BPH Acara dan Koor D''Basic';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Acara dan Koor D''Basic', '2025-09-12', 'https://meet.google.com/ejr-fidt-ope', 'Rapat BPH Acara dan Koor D''Basic', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-09-12 20:38:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-09-12 20:38:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-09-12 20:38:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri Ramadhoan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri Ramadhoan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri Ramadhoan', 'present', '2025-09-12 20:38:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'present', '2025-09-12 20:38:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syifa Sakina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syifa Sakina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syifa Sakina', 'present', '2025-09-12 20:38:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Koordinasi BPH Umum, Kadiv (2025-09-13)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-09-13' AND title = 'Rapat Koordinasi BPH Umum, Kadiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Koordinasi BPH Umum, Kadiv', '2025-09-13', 'Ruang Creative', 'Rapat Koordinasi BPH Umum, Kadiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Sowan Perdana Membahas Proker ACE (2025-09-16)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-09-16' AND title = 'Sowan Perdana Membahas Proker ACE';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Sowan Perdana Membahas Proker ACE', '2025-09-16', 'Ruang Kaprodi Bisnis DIgital', 'Sowan Perdana Membahas Proker ACE', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-09-16 8:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-09-16 8:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-09-16 8:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-09-16 8:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-09-16 8:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Evaluasi dan Penyebaran Undangan ke Sekolah Proker D'BASIC (2025-09-16)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-09-16' AND title = 'Rapat Evaluasi dan Penyebaran Undangan ke Sekolah Proker D''BASIC';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi dan Penyebaran Undangan ke Sekolah Proker D''BASIC', '2025-09-16', 'Sekretariat FEB Lt. 2', 'Rapat Evaluasi dan Penyebaran Undangan ke Sekolah Proker D''BASIC', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ichsan Nur Fahmi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ichsan Nur Fahmi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ichsan Nur Fahmi', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Farrand Hafizh
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Farrand Hafizh' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Farrand Hafizh', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rakha Fathin Budiman
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Rakha Fathin Budiman' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rakha Fathin Budiman', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Ali Akbar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Ali Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Ali Akbar', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Anggi Marsuna
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Anggi Marsuna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Anggi Marsuna', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salsakinah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Salsakinah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salsakinah', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syifa Sakina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syifa Sakina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syifa Sakina', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tiffany
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tiffany' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tiffany', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Putri Nadia Rohimah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Putri Nadia Rohimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Putri Nadia Rohimah', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fara Diba
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fara Diba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fara Diba', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Kayla Fika Assyfa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Kayla Fika Assyfa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Kayla Fika Assyfa', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Gyana Nisrina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Gyana Nisrina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Gyana Nisrina', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Naprisa Tri Hapsari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Naprisa Tri Hapsari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Naprisa Tri Hapsari', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ayu Maudya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ayu Maudya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ayu Maudya', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Indah Ramadan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Indah Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Indah Ramadan', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri Ramadhoan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri Ramadhoan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri Ramadhoan', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Acara dan BPH Umum Perihal Lomba Bisnis Start-up, (2025-09-24)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-09-24' AND title = 'Rapat BPH Acara dan BPH Umum Perihal Lomba Bisnis Start-up,';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Acara dan BPH Umum Perihal Lomba Bisnis Start-up,', '2025-09-24', 'https://meet.google.com/ksg-bvxr-ttt', 'Rapat BPH Acara dan BPH Umum Perihal Lomba Bisnis Start-up,', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-09-24 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-09-24 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-09-24 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'present', '2025-09-24 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-09-24 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nabila Resta Nasya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nabila Resta Nasya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nabila Resta Nasya', 'present', '2025-09-24 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Umum, Kadiv dan Sekdiv (2025-09-27)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-09-27' AND title = 'Rapat BPH Umum, Kadiv dan Sekdiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum, Kadiv dan Sekdiv', '2025-09-27', 'https://meet.google.com/kvd-qasq-cdp', 'Rapat BPH Umum, Kadiv dan Sekdiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Umum, Perihal Persiapan Rapat Evaluasi dan (2025-11-05)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-11-05' AND title = 'Rapat BPH Umum, Perihal Persiapan Rapat Evaluasi dan';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum, Perihal Persiapan Rapat Evaluasi dan', '2025-11-05', 'Sekretariat DIGCITY', 'Rapat BPH Umum, Perihal Persiapan Rapat Evaluasi dan', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-11-05 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-05 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-05 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-05 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Evaluasi Proker D'BASIC (2025-11-08)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-11-08' AND title = 'Rapat Evaluasi Proker D''BASIC';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi Proker D''BASIC', '2025-11-08', 'Sekretaiat FEB Lt. 2', 'Rapat Evaluasi Proker D''BASIC', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nabila Resta Nasya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nabila Resta Nasya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nabila Resta Nasya', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Farrand Hafizh
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Farrand Hafizh' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Farrand Hafizh', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ichsan Nur Fahmi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ichsan Nur Fahmi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ichsan Nur Fahmi', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syifa Sakina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syifa Sakina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syifa Sakina', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ayu Maudya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Ayu Maudya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ayu Maudya', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri Ramadhoan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri Ramadhoan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri Ramadhoan', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salsakinah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Salsakinah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salsakinah', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rakha Fathin Budiman
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Rakha Fathin Budiman' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rakha Fathin Budiman', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Putri Nadia Rohimah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Putri Nadia Rohimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Putri Nadia Rohimah', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nayla Rania Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nayla Rania Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nayla Rania Putri', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tiffany
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tiffany' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tiffany', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE (2025-11-08)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-11-08' AND title = 'Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE', '2025-11-08', 'https://meet.google.com/iqy-ucab-xmc', 'Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-08 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-08 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-11-08 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-11-08 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-11-08 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-11-08 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Evaluasi BPH Umum, Kadiv, Sekdiv, dan (2025-11-08)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-11-08' AND title = 'Rapat Evaluasi BPH Umum, Kadiv, Sekdiv, dan';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi BPH Umum, Kadiv, Sekdiv, dan', '2025-11-08', 'Rumah Yola, Cilebut Timur', 'Rapat Evaluasi BPH Umum, Kadiv, Sekdiv, dan', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE (2025-11-10)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-11-10' AND title = 'Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE', '2025-11-10', 'Ruang Kelas FEB lt.3 (308)', 'Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Satrio Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'absent', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mohammad Sunjaya Putra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Mohammad Sunjaya Putra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Mohammad Sunjaya Putra', 'absent', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Evaluasi All Staff DIGCITY (2025-11-16)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-11-16' AND title = 'Rapat Evaluasi All Staff DIGCITY';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi All Staff DIGCITY', '2025-11-16', 'Kanopi FEB UIKA Bogor', 'Rapat Evaluasi All Staff DIGCITY', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Akbar Supia Dirja
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Akbar Supia Dirja' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Akbar Supia Dirja', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rakha Fathin Budiman
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Rakha Fathin Budiman' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rakha Fathin Budiman', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Luqman Baihaqi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luqman Baihaqi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luqman Baihaqi', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hana Aurora Aida Rahma
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hana Aurora Aida Rahma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hana Aurora Aida Rahma', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salsakinah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Salsakinah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salsakinah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Farrand Hafizh
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Farrand Hafizh' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Farrand Hafizh', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Putri Nadia Rohimah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Putri Nadia Rohimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Putri Nadia Rohimah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Gyana Nisrina
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Gyana Nisrina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Gyana Nisrina', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahrul Ramadhan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syahrul Ramadhan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahrul Ramadhan', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Kayla Fika Assyfa
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Kayla Fika Assyfa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Kayla Fika Assyfa', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Aghnia Fatihin
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Adinda Aghnia Fatihin' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Aghnia Fatihin', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salma Difa Aristawidya
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Salma Difa Aristawidya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salma Difa Aristawidya', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Juliana Putri Husnul Khotimah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Juliana Putri Husnul Khotimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Juliana Putri Husnul Khotimah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Sakia Nurisma
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Sakia Nurisma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Sakia Nurisma', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Humaira Alifah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Humaira Alifah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Humaira Alifah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Najmi Ramadhan
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Najmi Ramadhan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Najmi Ramadhan', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Syafiq Al Ghifari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Syafiq Al Ghifari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Syafiq Al Ghifari', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rian Kurniawan Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Rian Kurniawan Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rian Kurniawan Saputra', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Ali Akbar
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Ali Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Ali Akbar', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar Sanyoto
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Satrio Akbar Sanyoto' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar Sanyoto', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Progres dan Pembahasan Dispensasi (2025-11-20)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-11-20' AND title = 'Rapat Progres dan Pembahasan Dispensasi';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Progres dan Pembahasan Dispensasi', '2025-11-20', 'https://meet.google.com/prh-pkoy-hdv', 'Rapat Progres dan Pembahasan Dispensasi', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat Pembahasan Teknis Acara A Company Exploration (2025-11-22)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-11-22' AND title = 'Rapat Pembahasan Teknis Acara A Company Exploration';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Pembahasan Teknis Acara A Company Exploration', '2025-11-22', 'Sekretariat DIGCITY', 'Rapat Pembahasan Teknis Acara A Company Exploration', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar Sanyoto
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Satrio Akbar Sanyoto' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar Sanyoto', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;

DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Technical Meeting A Company Exploration (2025-11-23)
  SELECT id INTO v_event_id FROM public.internal_events WHERE date = '2025-11-23' AND title = 'Technical Meeting A Company Exploration';
  
  IF v_event_id IS NULL THEN
    INSERT INTO public.internal_events (title, date, location, description, type, division)
    VALUES ('Technical Meeting A Company Exploration', '2025-11-23', 'https://meet.google.com/xta-msju-gqg', 'Technical Meeting A Company Exploration', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar Sanyoto
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Satrio Akbar Sanyoto' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar Sanyoto', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mohammad Sunjaya Putra
    SELECT id INTO v_member_id FROM public.organization_members WHERE full_name ILIKE 'Mohammad Sunjaya Putra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO public.attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Mohammad Sunjaya Putra', 'absent', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;
