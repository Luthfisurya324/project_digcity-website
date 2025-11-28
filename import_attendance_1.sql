
DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Umum , Kadiv dan Sekdiv (2025-01-18)
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-01-18' AND title = 'Rapat BPH Umum , Kadiv dan Sekdiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum , Kadiv dan Sekdiv', '2025-01-18', 'Sekretariat DIGCITY', 'Rapat BPH Umum , Kadiv dan Sekdiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-01-18 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-01-29' AND title = 'Rapat BPH Umum dan Kadiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum dan Kadiv', '2025-01-29', 'Sekretariat DIGCITY', 'Rapat BPH Umum dan Kadiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-01-29 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-01-29 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-01-29 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-01-29 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-01-29 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-02-15' AND title = 'Rapat BPH Umum Perihal Teknis Open Recruitment Maba24';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum Perihal Teknis Open Recruitment Maba24', '2025-02-15', 'Sekretariat FEB', 'Rapat BPH Umum Perihal Teknis Open Recruitment Maba24', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-02-15 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-02-15 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-02-19' AND title = 'Rapat BPH Umum dan Kadiv Perihal Teknis Oprec Maba24';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum dan Kadiv Perihal Teknis Oprec Maba24', '2025-02-19', 'Sekretariat DIGCITY', 'Rapat BPH Umum dan Kadiv Perihal Teknis Oprec Maba24', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-02-19 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-02-19 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-02-19 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-02-19 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-02-19 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-02-27' AND title = 'Rapat BPH Umum, Kadiv dan Sekdiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum, Kadiv dan Sekdiv', '2025-02-27', 'Sekretariaf FEB', 'Rapat BPH Umum, Kadiv dan Sekdiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-02-27 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-03-01' AND title = 'Rapat BPH Umum Perihal Pelantikan dan Raker';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum Perihal Pelantikan dan Raker', '2025-03-01', 'https://meet.google.com/kbn-nsgv-nzy', 'Rapat BPH Umum Perihal Pelantikan dan Raker', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-03-01 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-03-01 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-03-01 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-03-09' AND title = 'Rapat Kerja Anggota DIGCITY Periode 2025';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Kerja Anggota DIGCITY Periode 2025', '2025-03-09', 'Sekretariat FEB Lt.2', 'Rapat Kerja Anggota DIGCITY Periode 2025', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Shintawati Khoirunnisa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Shintawati Khoirunnisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Shintawati Khoirunnisa', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hana Aurora Aida Rahma
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hana Aurora Aida Rahma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hana Aurora Aida Rahma', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salma Difa Aristawidya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Salma Difa Aristawidya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salma Difa Aristawidya', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ocha Nurfitriani
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Ocha Nurfitriani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ocha Nurfitriani', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Cika Jelita
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Cika Jelita' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Cika Jelita', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Arsya Syaira Olivia
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Arsya Syaira Olivia' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Arsya Syaira Olivia', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syifa Sakina
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syifa Sakina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syifa Sakina', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Riqzin Priyatno
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nada Savaira Riqzin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Riqzin Priyatno', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Gyana Nisrina
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Gyana Nisrina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Gyana Nisrina', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nayla Rania
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nayla Rania' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nayla Rania', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ayu Maudya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Ayu Maudya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ayu Maudya', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nabila Resta Nasya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nabila Resta Nasya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nabila Resta Nasya', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Putri Nadia Rohimah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Putri Nadia Rohimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Putri Nadia Rohimah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Juliana Putri Husnul Khotimah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Juliana Putri Husnul Khotimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Juliana Putri Husnul Khotimah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Annisa Aulia Supriyadi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Annisa Aulia Supriyadi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Annisa Aulia Supriyadi', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tiffany
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tiffany' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tiffany', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Kayla Fika Assyfa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Kayla Fika Assyfa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Kayla Fika Assyfa', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Indah Ramadan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Indah Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Indah Ramadan', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Sakia Nurisma
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Sakia Nurisma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Sakia Nurisma', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Humaira Afifah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nazwa Humaira Afifah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Humaira Afifah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Naprisa Tri Hapsari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Naprisa Tri Hapsari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Naprisa Tri Hapsari', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salsakinah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Salsakinah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salsakinah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Satrio Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Ali Akbar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Ali Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Ali Akbar', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fadhil Suprayitna
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fadhil Suprayitna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fadhil Suprayitna', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Anggi Marsuna
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Anggi Marsuna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Anggi Marsuna', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Farrand Hafizh
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Farrand Hafizh' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Farrand Hafizh', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Lana Aulia Salsabila
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Lana Aulia Salsabila' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Lana Aulia Salsabila', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fara Diba
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fara Diba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fara Diba', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ikhwanul Akmal
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Ikhwanul Akmal' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ikhwanul Akmal', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rakha Fathin Budiman
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Rakha Fathin Budiman' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rakha Fathin Budiman', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri Ramadhoan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Fikri Ramadhoan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri Ramadhoan', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Najmi Ramadhan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Najmi Ramadhan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Najmi Ramadhan', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahrul Ramadan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syahrul Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahrul Ramadan', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Faqih Alfarizi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Faqih Alfarizi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Faqih Alfarizi', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mohammad Sunjaya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Mohammad Sunjaya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Mohammad Sunjaya Saputra', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Akbar Supia Dirja
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Akbar Supia Dirja' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Akbar Supia Dirja', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ichsan Nur Fahmi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Ichsan Nur Fahmi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ichsan Nur Fahmi', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Luqman Baihaqi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luqman Baihaqi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luqman Baihaqi', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nesya Aulia Putri Purba
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nesya Aulia Putri Purba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nesya Aulia Putri Purba', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Qisti Salsabila Fauhani
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Qisti Salsabila Fauhani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Qisti Salsabila Fauhani', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabby Putra Malkiswa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabby Putra Malkiswa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabby Putra Malkiswa', 'present', '2025-03-09 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Anisa Nur Ramadhani
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Anisa Nur Ramadhani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-03-05' AND title = 'Rapat BPH Umum';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum', '2025-03-05', 'Sekretariat DIGCITY', 'Rapat BPH Umum', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-03-05 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-03-05 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-03-21' AND title = 'Rapat Evaluasi BPH Umum, Kadiv dan Sekdiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi BPH Umum, Kadiv dan Sekdiv', '2025-03-21', 'Sekretariat DIGCITY', 'Rapat Evaluasi BPH Umum, Kadiv dan Sekdiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-03-21 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-03-28' AND title = 'Rapat BPH Umum Perihal Pengembangan Sistem';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum Perihal Pengembangan Sistem', '2025-03-28', 'Online', 'Rapat BPH Umum Perihal Pengembangan Sistem', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-03-28 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-03-28 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-03-28 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-04-13' AND title = 'Membahas Stall of Business (SOB)';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Membahas Stall of Business (SOB)', '2025-04-13', 'https://meet.google.com/tme-cdkr-vnj', 'Membahas Stall of Business (SOB)', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Zaieq Zidane Al Faza
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Zaieq Zidane Al Faza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Al Faza', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Elsha Nurdwi Baharsyah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Elsha Nurdwi Baharsyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Elsha Nurdwi Baharsyah', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Cika Jelita
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Cika Jelita' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Cika Jelita', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Humaira Alifah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nazwa Humaira Alifah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Humaira Alifah', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Latia Fatimah Dewi Apriliyani
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Latia Fatimah Dewi Apriliyani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Latia Fatimah Dewi Apriliyani', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Sakia Nurisma
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Sakia Nurisma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Sakia Nurisma', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fadhil Suprayitna
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fadhil Suprayitna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fadhil Suprayitna', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Najmi Ramadhan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Najmi Ramadhan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Najmi Ramadhan', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Ali Akbar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Ali Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Ali Akbar', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Juliana Putri Husnul Khotimah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Juliana Putri Husnul Khotimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Juliana Putri Husnul Khotimah', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Alfiyyah Rima Afifah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Alfiyyah Rima Afifah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Alfiyyah Rima Afifah', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Syafiq Al Ghifari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Syafiq Al Ghifari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Syafiq Al Ghifari', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nadris A. Badrun
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nadris A. Badrun' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nadris A. Badrun', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Ikhsan Ramadhan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhamad Ikhsan Ramadhan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Ikhsan Ramadhan', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ocha Nurfitriani
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Ocha Nurfitriani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ocha Nurfitriani', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nesya Alia Putri Purba
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nesya Alia Putri Purba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nesya Alia Putri Purba', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rian Kurniawan Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Rian Kurniawan Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rian Kurniawan Saputra', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Akhdan Putra Hermawan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Akhdan Putra Hermawan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Akhdan Putra Hermawan', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Andini Aulia Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Andini Aulia Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Andini Aulia Putri', 'present', '2025-04-13 9:40:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Maulana Farid Fatin
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Maulana Farid Fatin' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-04-18' AND title = 'Pembahasan Workshop Desain Canva';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Pembahasan Workshop Desain Canva', '2025-04-18', 'Sekretariat FEB', 'Pembahasan Workshop Desain Canva', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fara Diba
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fara Diba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fara Diba', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Aghnia Fatihin
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Adinda Aghnia Fatihin' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Aghnia Fatihin', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salma Difa Aristawidya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Salma Difa Aristawidya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salma Difa Aristawidya', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Naprisa Tri Hapsari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Naprisa Tri Hapsari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Naprisa Tri Hapsari', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Gyana Nisrina
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Gyana Nisrina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Gyana Nisrina', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nayla Rania
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nayla Rania' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nayla Rania', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Indah Ramadan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Indah Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Indah Ramadan', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tiffany
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tiffany' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tiffany', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Qisti Salsabila Fauhani
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Qisti Salsabila Fauhani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Qisti Salsabila Fauhani', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Anggi Marsuna
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Anggi Marsuna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Anggi Marsuna', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabby Putra Malkiswa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabby Putra Malkiswa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabby Putra Malkiswa', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Annisa Aulia Supriyadi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Annisa Aulia Supriyadi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Annisa Aulia Supriyadi', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ilyas Lutfi Abdat
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Ilyas Lutfi Abdat' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ilyas Lutfi Abdat', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Rian Hermawan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Rian Hermawan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Rian Hermawan', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Luthfi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Luthfi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Luthfi', 'present', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mulya Nur Wicaksono
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Mulya Nur Wicaksono' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Mulya Nur Wicaksono', 'excused', '2025-04-18 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Kayla Fika Assyfa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Kayla Fika Assyfa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-04-23' AND title = 'Rapat Mengenai SERIES';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Mengenai SERIES', '2025-04-23', 'https://meet.google.com/vfy-ddfe-jxo', 'Rapat Mengenai SERIES', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar Sanyoto
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Satrio Akbar Sanyoto' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar Sanyoto', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-04-23 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-04-25' AND title = 'Rapat SERIES';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat SERIES', '2025-04-25', 'meet.google.com/kkf-bcxe-uac', 'Rapat SERIES', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar Sanyoto
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Satrio Akbar Sanyoto' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar Sanyoto', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-04-25 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-05-07' AND title = 'Rapat Koordinasi BPH Umum, Kadiv dan Sekdiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Koordinasi BPH Umum, Kadiv dan Sekdiv', '2025-05-07', 'Sekretariat DIGCITY', 'Rapat Koordinasi BPH Umum, Kadiv dan Sekdiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-05-07 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-05-26' AND title = 'Rapat Workshop Canva';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Workshop Canva', '2025-05-26', 'Ruang 207', 'Rapat Workshop Canva', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Qisti Salsabila Fauhani
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Qisti Salsabila Fauhani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Qisti Salsabila Fauhani', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Naprisa Tri Hapsari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Naprisa Tri Hapsari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Naprisa Tri Hapsari', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Kayla Fika Assyfa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Kayla Fika Assyfa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Kayla Fika Assyfa', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Indah Ramadan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Indah Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Indah Ramadan', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tiffany
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tiffany' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tiffany', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabby Putra Malkiswa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabby Putra Malkiswa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabby Putra Malkiswa', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Annisa Aulia Supriyadi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Annisa Aulia Supriyadi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Annisa Aulia Supriyadi', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Anggi Marsuna
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Anggi Marsuna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Anggi Marsuna', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salma Difa Aristawidya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Salma Difa Aristawidya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salma Difa Aristawidya', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Putri Nadia Rohimah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Putri Nadia Rohimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Putri Nadia Rohimah', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nayla Rania Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nayla Rania Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nayla Rania Putri', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Gyana Nisrina
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Gyana Nisrina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Gyana Nisrina', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mulya Nur Wicaksono
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Mulya Nur Wicaksono' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Mulya Nur Wicaksono', 'present', '2025-05-26 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-05-27' AND title = 'Rapat Progres Workshop Canva';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Progres Workshop Canva', '2025-05-27', 'Ruang 206', 'Rapat Progres Workshop Canva', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Annisa Aulia Supriyadi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Annisa Aulia Supriyadi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Annisa Aulia Supriyadi', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Indah Ramadan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Indah Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Indah Ramadan', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Naprisa Tri Hapsari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Naprisa Tri Hapsari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Naprisa Tri Hapsari', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Qisti Salsabila Fauhani
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Qisti Salsabila Fauhani' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Qisti Salsabila Fauhani', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fara Diba
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fara Diba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fara Diba', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ilyas Lutfi Abdat
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Ilyas Lutfi Abdat' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ilyas Lutfi Abdat', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Rian Hermawan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Rian Hermawan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Rian Hermawan', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Luthfi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhamad Luthfi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Luthfi', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Anggi Marsuna
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Anggi Marsuna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Anggi Marsuna', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabby Putra Malkiswa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabby Putra Malkiswa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabby Putra Malkiswa', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahrul Ramadan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syahrul Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahrul Ramadan', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mulya Nur Wicaksono
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Mulya Nur Wicaksono' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Mulya Nur Wicaksono', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nayla Rania Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nayla Rania Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nayla Rania Putri', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Gyana Nisrina
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Gyana Nisrina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Gyana Nisrina', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Kayla Fika Assyfa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Kayla Fika Assyfa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Kayla Fika Assyfa', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Putri Nadia Rohimah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Putri Nadia Rohimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Putri Nadia Rohimah', 'present', '2025-05-27 15:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tiffany
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tiffany' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-06-13' AND title = 'Rapat Pembahasan Studi Banding DIGCITY X HIMABISDIG UNAS';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Pembahasan Studi Banding DIGCITY X HIMABISDIG UNAS', '2025-06-13', 'https://meet.google.com/jdp-viyn-udb', 'Rapat Pembahasan Studi Banding DIGCITY X HIMABISDIG UNAS', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-06-13 19:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-06-15' AND title = 'Rapat Studi Banding';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Studi Banding', '2025-06-15', 'https://meet.google.com/tay-xpvg-rcb', 'Rapat Studi Banding', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar Sanyoto
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Satrio Akbar Sanyoto' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar Sanyoto', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'excused', '2025-06-15 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mohammad Sunjaya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Mohammad Sunjaya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-06-20' AND title = 'Evaluasi BPH Umum dan Perihal Permasalahan Lainnya';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Evaluasi BPH Umum dan Perihal Permasalahan Lainnya', '2025-06-20', 'Sekretariat DIGCITY', 'Evaluasi BPH Umum dan Perihal Permasalahan Lainnya', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-06-20 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-06-20 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-06-20 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-06-20 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;
