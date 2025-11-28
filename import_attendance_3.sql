
DO $$
DECLARE
  v_event_id uuid;
  v_member_id uuid;
BEGIN
  -- Event: Rapat BPH Acara dan Koor ACE, Perihal Progres Per Divisi (2025-09-10)
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-09-10' AND title = 'Rapat BPH Acara dan Koor ACE, Perihal Progres Per Divisi';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Acara dan Koor ACE, Perihal Progres Per Divisi', '2025-09-10', 'https://meet.google.com/nvf-vpux-cyf', 'Rapat BPH Acara dan Koor ACE, Perihal Progres Per Divisi', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-09-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-09-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-09-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-09-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-09-10 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-09-12' AND title = 'Rapat BPH Acara dan Koor D''Basic';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Acara dan Koor D''Basic', '2025-09-12', 'https://meet.google.com/ejr-fidt-ope', 'Rapat BPH Acara dan Koor D''Basic', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-09-12 20:38:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-09-12 20:38:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-09-12 20:38:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri Ramadhoan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Fikri Ramadhoan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri Ramadhoan', 'present', '2025-09-12 20:38:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'present', '2025-09-12 20:38:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syifa Sakina
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syifa Sakina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-09-13' AND title = 'Rapat Koordinasi BPH Umum, Kadiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Koordinasi BPH Umum, Kadiv', '2025-09-13', 'Ruang Creative', 'Rapat Koordinasi BPH Umum, Kadiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-09-13 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-09-16' AND title = 'Sowan Perdana Membahas Proker ACE';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Sowan Perdana Membahas Proker ACE', '2025-09-16', 'Ruang Kaprodi Bisnis DIgital', 'Sowan Perdana Membahas Proker ACE', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-09-16 8:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-09-16 8:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-09-16 8:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-09-16 8:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-09-16' AND title = 'Rapat Evaluasi dan Penyebaran Undangan ke Sekolah Proker D''BASIC';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi dan Penyebaran Undangan ke Sekolah Proker D''BASIC', '2025-09-16', 'Sekretariat FEB Lt. 2', 'Rapat Evaluasi dan Penyebaran Undangan ke Sekolah Proker D''BASIC', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ichsan Nur Fahmi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Ichsan Nur Fahmi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ichsan Nur Fahmi', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Farrand Hafizh
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Farrand Hafizh' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Farrand Hafizh', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rakha Fathin Budiman
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Rakha Fathin Budiman' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rakha Fathin Budiman', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Ali Akbar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Ali Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Ali Akbar', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Anggi Marsuna
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Anggi Marsuna' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Anggi Marsuna', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salsakinah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Salsakinah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salsakinah', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syifa Sakina
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syifa Sakina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syifa Sakina', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tiffany
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tiffany' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tiffany', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Putri Nadia Rohimah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Putri Nadia Rohimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Putri Nadia Rohimah', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fara Diba
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fara Diba' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fara Diba', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Kayla Fika Assyfa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Kayla Fika Assyfa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Kayla Fika Assyfa', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Gyana Nisrina
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Gyana Nisrina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Gyana Nisrina', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Naprisa Tri Hapsari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Naprisa Tri Hapsari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Naprisa Tri Hapsari', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ayu Maudya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Ayu Maudya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ayu Maudya', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Indah Ramadan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Indah Ramadan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Indah Ramadan', 'present', '2025-09-16 10:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri Ramadhoan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Fikri Ramadhoan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-09-24' AND title = 'Rapat BPH Acara dan BPH Umum Perihal Lomba Bisnis Start-up,';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Acara dan BPH Umum Perihal Lomba Bisnis Start-up,', '2025-09-24', 'https://meet.google.com/ksg-bvxr-ttt', 'Rapat BPH Acara dan BPH Umum Perihal Lomba Bisnis Start-up,', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-09-24 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-09-24 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'present', '2025-09-24 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'present', '2025-09-24 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-09-24 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nabila Resta Nasya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nabila Resta Nasya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-09-27' AND title = 'Rapat BPH Umum, Kadiv dan Sekdiv';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum, Kadiv dan Sekdiv', '2025-09-27', 'https://meet.google.com/kvd-qasq-cdp', 'Rapat BPH Umum, Kadiv dan Sekdiv', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-09-27 21:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-11-05' AND title = 'Rapat BPH Umum, Perihal Persiapan Rapat Evaluasi dan';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat BPH Umum, Perihal Persiapan Rapat Evaluasi dan', '2025-11-05', 'Sekretariat DIGCITY', 'Rapat BPH Umum, Perihal Persiapan Rapat Evaluasi dan', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-11-05 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-05 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-05 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-11-08' AND title = 'Rapat Evaluasi Proker D''BASIC';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi Proker D''BASIC', '2025-11-08', 'Sekretaiat FEB Lt. 2', 'Rapat Evaluasi Proker D''BASIC', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Iqbal Fauzi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhamad Iqbal Fauzi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Iqbal Fauzi', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nabila Resta Nasya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nabila Resta Nasya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nabila Resta Nasya', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Farrand Hafizh
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Farrand Hafizh' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Farrand Hafizh', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ichsan Nur Fahmi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Ichsan Nur Fahmi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ichsan Nur Fahmi', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syifa Sakina
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syifa Sakina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syifa Sakina', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Ayu Maudya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Ayu Maudya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Ayu Maudya', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri Ramadhoan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Fikri Ramadhoan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri Ramadhoan', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salsakinah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Salsakinah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salsakinah', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rakha Fathin Budiman
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Rakha Fathin Budiman' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rakha Fathin Budiman', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Putri Nadia Rohimah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Putri Nadia Rohimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Putri Nadia Rohimah', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nayla Rania Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nayla Rania Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nayla Rania Putri', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tiffany
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tiffany' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tiffany', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-08 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-11-08' AND title = 'Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE', '2025-11-08', 'https://meet.google.com/iqy-ucab-xmc', 'Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-08 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-08 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-11-08 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-11-08 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-11-08 11:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-11-08' AND title = 'Rapat Evaluasi BPH Umum, Kadiv, Sekdiv, dan';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi BPH Umum, Kadiv, Sekdiv, dan', '2025-11-08', 'Rumah Yola, Cilebut Timur', 'Rapat Evaluasi BPH Umum, Kadiv, Sekdiv, dan', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-08 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-11-10' AND title = 'Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE', '2025-11-10', 'Ruang Kelas FEB lt.3 (308)', 'Rapat Pembahasan Lebih Lanjut Kebutuhan Persiapan Proker ACE', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Satrio Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar', 'present', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'absent', '2025-11-10 15:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mohammad Sunjaya Putra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Mohammad Sunjaya Putra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-11-16' AND title = 'Rapat Evaluasi All Staff DIGCITY';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Evaluasi All Staff DIGCITY', '2025-11-16', 'Kanopi FEB UIKA Bogor', 'Rapat Evaluasi All Staff DIGCITY', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for M. Fadilah Muhtar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'M. Fadilah Muhtar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'M. Fadilah Muhtar', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Akbar Supia Dirja
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Akbar Supia Dirja' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Akbar Supia Dirja', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rakha Fathin Budiman
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Rakha Fathin Budiman' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rakha Fathin Budiman', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Luqman Baihaqi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luqman Baihaqi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luqman Baihaqi', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hana Aurora Aida Rahma
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hana Aurora Aida Rahma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hana Aurora Aida Rahma', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salsakinah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Salsakinah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salsakinah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Farrand Hafizh
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Farrand Hafizh' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Farrand Hafizh', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Febrina Rahmadianti Putri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Febrina Rahmadianti Putri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Febrina Rahmadianti Putri', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Miftahul Jannah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Miftahul Jannah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Miftahul Jannah', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hanun Syahidah Ulfya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hanun Syahidah Ulfya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hanun Syahidah Ulfya', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhamad Rizky Ardiansyah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhamad Rizky Ardiansyah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhamad Rizky Ardiansyah', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Yola Tirta Nurfajriya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Yola Tirta Nurfajriya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Yola Tirta Nurfajriya', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahira Nasywa Andina Humaedi
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syahira Nasywa Andina Humaedi' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahira Nasywa Andina Humaedi', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Farhatun Nisa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Farhatun Nisa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Farhatun Nisa', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Putri Nadia Rohimah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Putri Nadia Rohimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Putri Nadia Rohimah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Gyana Nisrina
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Gyana Nisrina' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Gyana Nisrina', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syahrul Ramadhan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syahrul Ramadhan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syahrul Ramadhan', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Kayla Fika Assyfa
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Kayla Fika Assyfa' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Kayla Fika Assyfa', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Aghnia Fatihin
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Adinda Aghnia Fatihin' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Aghnia Fatihin', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Salma Difa Aristawidya
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Salma Difa Aristawidya' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Salma Difa Aristawidya', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Zaieq Zidane Alfaza
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Zaieq Zidane Alfaza' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Zaieq Zidane Alfaza', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Adinda Rahmawati
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Adinda Rahmawati' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Adinda Rahmawati', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Juliana Putri Husnul Khotimah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Juliana Putri Husnul Khotimah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Juliana Putri Husnul Khotimah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Sakia Nurisma
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Sakia Nurisma' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Sakia Nurisma', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Humaira Alifah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nazwa Humaira Alifah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Humaira Alifah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Najmi Ramadhan
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Najmi Ramadhan' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Najmi Ramadhan', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Syafiq Al Ghifari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Syafiq Al Ghifari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Syafiq Al Ghifari', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Rian Kurniawan Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Rian Kurniawan Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Rian Kurniawan Saputra', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Ali Akbar
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Ali Akbar' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Ali Akbar', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'excused', '2025-11-16 9:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar Sanyoto
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Satrio Akbar Sanyoto' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-11-20' AND title = 'Rapat Progres dan Pembahasan Dispensasi';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Progres dan Pembahasan Dispensasi', '2025-11-20', 'https://meet.google.com/prh-pkoy-hdv', 'Rapat Progres dan Pembahasan Dispensasi', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Luthfi Surya Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Luthfi Surya Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Luthfi Surya Saputra', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Syawalinizareva
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Syawalinizareva' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Syawalinizareva', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-11-20 20:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-11-22' AND title = 'Rapat Pembahasan Teknis Acara A Company Exploration';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Rapat Pembahasan Teknis Acara A Company Exploration', '2025-11-22', 'Sekretariat DIGCITY', 'Rapat Pembahasan Teknis Acara A Company Exploration', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar Sanyoto
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Satrio Akbar Sanyoto' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar Sanyoto', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-11-22 13:00:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
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
  SELECT id INTO v_event_id FROM internal_events WHERE date = '2025-11-23' AND title = 'Technical Meeting A Company Exploration';
  
  IF v_event_id IS NULL THEN
    INSERT INTO internal_events (title, date, location, description, type, division)
    VALUES ('Technical Meeting A Company Exploration', '2025-11-23', 'https://meet.google.com/xta-msju-gqg', 'Technical Meeting A Company Exploration', 'meeting', 'BPH')
    RETURNING id INTO v_event_id;
  END IF;

    -- Attendance for Fahtir Angger Prabowo
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Fahtir Angger Prabowo' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Fahtir Angger Prabowo', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Pinkan Prilia Mahmudah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Pinkan Prilia Mahmudah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Pinkan Prilia Mahmudah', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Tabita Nurtirta Purwita Sari
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Tabita Nurtirta Purwita Sari' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Tabita Nurtirta Purwita Sari', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Razan Satya Prayuda
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Razan Satya Prayuda' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Razan Satya Prayuda', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Restiayu Sekar Utami
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Restiayu Sekar Utami' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Restiayu Sekar Utami', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Hirsyal Saputra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Hirsyal Saputra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Hirsyal Saputra', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Meli Islamiah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Meli Islamiah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Meli Islamiah', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Kurnia Fadli
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Kurnia Fadli' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Kurnia Fadli', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nazwa Safa Felisha
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nazwa Safa Felisha' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nazwa Safa Felisha', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Satrio Akbar Sanyoto
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Satrio Akbar Sanyoto' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Satrio Akbar Sanyoto', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Nada Savaira Rizqin Priyatno
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Nada Savaira Rizqin Priyatno' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Nada Savaira Rizqin Priyatno', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Laila Nur Azizah
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Laila Nur Azizah' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Laila Nur Azizah', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Muhammad Fikri
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Muhammad Fikri' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Muhammad Fikri', 'present', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Attendance for Mohammad Sunjaya Putra
    SELECT id INTO v_member_id FROM organization_members WHERE full_name ILIKE 'Mohammad Sunjaya Putra' LIMIT 1;
    
    IF v_member_id IS NOT NULL THEN
      INSERT INTO attendance (event_id, member_id, name, status, check_in_time)
      VALUES (v_event_id, v_member_id, 'Mohammad Sunjaya Putra', 'absent', '2025-11-23 19:30:00')
      ON CONFLICT DO NOTHING;
    END IF;
    
END $$;
