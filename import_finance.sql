
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Try to get a user ID, or use a fallback if needed. 
  -- For now we will just use the current user if running via RLS, but here we are running raw SQL.
  -- Let's try to find an admin user or just insert with a specific ID if we knew one.
  -- Since we don't know a specific user ID, we will try to fetch one from auth.users or just use a dummy UUID if constraints allow.
  -- However, created_by usually references auth.users.
  -- Let's try to select the first user from auth.users as a fallback creator.
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found to assign transactions to';
  END IF;

  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-01-14', 'Sisa uang DIGCITY 2023/2024', 545000, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-02-18', 'Uang dari HOK', 4627500, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-03-07', 'Sisa uang DIGIMON 2025', 839000, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-02-25', 'UPM', 2000000, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-05-24', 'Uang dari SOB', 377581, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-05-25', 'Sisa uang dari BUBARAN & HTM', 390500, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-06-30', 'Uang dari SOB', 375738, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-06-30', 'Sisa uang workshop CMI', 265000, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-07-03', 'UPM', 1000000, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-07-24', 'Sisa STUBAN', 1049000, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-07-21', 'Surplus stuban', 209000, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-07-22', 'surplus digitalk', 315100, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-07-23', 'surplus pdh', 571420, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-07-24', 'Uang dari SOB', 234450, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-07-25', 'surplus DBASIC', 962000, 'income', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-01-23', 'Pengeluaran Program Kerja DIGIMON', 460000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-01-24', 'print', 4000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-02-07', 'Pengeluaran EKRAV SOB', 100000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-02-18', 'Pengeluaran HOK JUARA 1', 1000000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-02-18', 'Pengeluaran HOK JUARA 2', 750500, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-02-18', 'Pengeluaran HOK JUARA 3', 250000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-02-20', 'Pengeluaran Ganti Uang Digimon', 1000000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-02-25', 'DP Villa Digimon', 2000000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-02-25', 'Uang Kopi ke MARTABAK', 31000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-02-24', 'Ganti Uang HOK iqbal', 58000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-03-02', 'Beli kertas HVS', 43900, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-03-09', 'Fotocopy untuk raker', 15000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-03-09', 'Beli Aqua gelas 2 dus', 35000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-03-09', 'Beli gorengan untuk bukaan', 100000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-03-13', 'Beli gorengan untuk bukaan', 50000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-03-13', 'Beli air aqua', 14000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-03-14', 'Cetak banner', 70000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-03-06', 'CMI beli canva', 32000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-04-11', 'EKRAV modal SOB', 515000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-04-12', 'POD', 33500, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-04-21', 'POD SCBD', 160000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-05-07', 'beli batre ABC', 17500, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-05-07', 'konsum rapat 12', 120000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-05-15', 'Lomba Piala Dekan', 125000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-05-21', 'lakban', 18000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-05-22', 'Kabel VGA', 35000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-05-22', 'bensin razan', 20000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-05-23', 'dorprise series', 70000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-05-27', 'POD SCBD', 132000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-05-26', 'EKRAV DIATAP', 100000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-06-02', 'Beli kertas HVS A4', 65000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-06-27', 'Beli kertas HVS F4', 42000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-06-27', 'Amplop 1 pak', 24000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-06-27', 'stepler & isi', 10500, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-06-26', 'jilid 7', 35000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-06-30', 'mika + kertas jilid', 25000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-06-26', 'double tipe', 5000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-06-25', 'print', 2500, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-06-26', 'amplop 10 pcs', 5000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-07-09', 'studi banding', 2070000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-07-23', 'beli hvs & amplop 1 pack', 50000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-07-23', 'beli mic', 300000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-08-14', 'beli kertas bufalo & mikanya', 54000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-08-14', 'bikin cap panpel', 50000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-08-11', 'beli kertas jilid dan lakban', 58000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-08-11', 'beli straple & isi', 43000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-07-24', 'beli hvs a4 1rim', 35000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-07-29', 'beli cutter & bufalo', 28000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-08-18', 'beli materai elektronik', 16000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-08-22', 'hadiah lomba agustusan', 100000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-08-22', 'paku', 2000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-08-22', 'cup & tali plastik', 26000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-08-22', 'kerupuk 5', 25000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-08-04', 'nengok syafiq', 20000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-09-03', 'beli bolu talas', 39000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-09-18', 'bayar fakultaria', 100500, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-09-21', 'beli bendera 2', 336000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-09-23', 'kertas a4 1 rim', 35000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-09-13', 'beli lakban 3 & kuitansi 3', 32000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-09-25', 'Beli laci kasir sob', 300000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-10-03', 'Digitalk', 200000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-10-01', 'print', 3000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-09-23', 'hvs', 35000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-10-02', 'print', 27000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-10-03', 'snack dan piring mabimpro', 80000, 'expense', 'Umum', v_user_id, 'approved');
  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('2025-11-08', 'konsum rapat', 126000, 'expense', 'Umum', v_user_id, 'approved');
END $$;