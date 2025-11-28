const fs = require('fs');

const incomeData = `
1. 14/01/2025 Sisa uang DIGCITY 2023/2024 Rp 545.000
2. 18/02/2025 Uang dari HOK Rp 4.627.500
3. 07/03/2025 Sisa uang DIGIMON 2025 Rp 839.000
4. 25/02/2025 UPM Rp 2.000.000
5. 24/05/2025 Uang dari SOB Rp 377.581
6. 25/05/2025 Sisa uang dari BUBARAN & HTM Rp 390.500
7. 30/06/2025 Uang dari SOB Rp 375.738
8. 30/06/2025 Sisa uang workshop CMI Rp 265.000
9. 03/07/2025 UPM Rp 1.000.000
10. 24/07/2025 Sisa STUBAN Rp 1.049.000
11. 21/07/2025 Surplus stuban Rp 209.000
12. 22/07/2025 surplus digitalk Rp 315.100
13. 23/07/2025 surplus pdh Rp 571.420
14. 24/07/2025 Uang dari SOB Rp 234.450
15. 25/07/2025 surplus DBASIC Rp 962.000
`;

const expenseData = `
1. 23/01/2025 Pengeluaran Program Kerja DIGIMON Rp 460.000
2. 24/01/2025 print Rp 4.000
3. 07/02/2025 Pengeluaran EKRAV SOB Rp 100.000
4. 18/02/2025 Pengeluaran HOK JUARA 1 Rp 1.000.000
5. 18/02/2025 Pengeluaran HOK JUARA 2 Rp 750.500
6. 18/02/2025 Pengeluaran HOK JUARA 3 Rp 250.000
7. 20/02/2025 Pengeluaran Ganti Uang Digimon Rp 1.000.000
8. 25/02/2025 DP Villa Digimon Rp 2.000.000
9. 25/02/2025 Uang Kopi ke MARTABAK Rp 31.000
10. 24/02/2025 Ganti Uang HOK iqbal Rp 58.000
11. 02/03/2025 Beli kertas HVS Rp 43.900
12. 09/03/2025 Fotocopy untuk raker Rp 15.000
13. 09/03/2025 Beli Aqua gelas 2 dus Rp 35.000
14. 09/03/2025 Beli gorengan untuk bukaan Rp 100.000
15. 13/03/2025 Beli gorengan untuk bukaan Rp 50.000
16. 13/03/2025 Beli air aqua Rp 14.000
17. 14/03/2025 Cetak banner Rp 70.000
18. 06/03/2025 CMI beli canva Rp 32.000
19. 11/04/2025 EKRAV modal SOB Rp 515.000
20. 12/04/2025 POD Rp 33.500
21. 21/04/2025 POD SCBD Rp 160.000
22. 07/05/2025 beli batre ABC Rp 17.500
23. 07/05/2025 konsum rapat 12 Rp 120.000
24. 15/05/2025 Lomba Piala Dekan Rp 125.000
25. 21/05/2025 lakban Rp 18.000
26. 22/05/2025 Kabel VGA Rp 35.000
27. 22/05/2025 bensin razan Rp 20.000
28. 23/05/2025 dorprise series Rp 70.000
29. 27/05/2025 POD SCBD Rp 132.000
30. 26/05/2025 EKRAV DIATAP Rp 100.000
31. 02/06/2025 Beli kertas HVS A4 Rp 65.000
32. 27/06/2025 Beli kertas HVS F4 Rp 42.000
33. 27/06/2025 Amplop 1 pak Rp 24.000
34. 27/06/2025 stepler & isi Rp 10.500
35. 26/06/2025 jilid 7 Rp 35.000
36. 30/06/2025 mika + kertas jilid Rp 25.000
37. 26/06/2025 double tipe Rp 5.000
38. 25/06/2025 print Rp 2.500
39. 26/06/2025 amplop 10 pcs Rp 5.000
40. 09/07/2025 studi banding Rp 2.070.000
41. 23/07/2025 beli hvs & amplop 1 pack Rp 50.000
42. 23/07/2025 beli mic Rp 300.000
43. 14/08/2025 beli kertas bufalo & mikanya Rp 54.000
44. 14/08/2025 bikin cap panpel Rp 50.000
45. 11/08/2025 beli kertas jilid dan lakban Rp 58.000
46. 11/08/2025 beli straple & isi Rp 43.000
47. 24/07/2025 beli hvs a4 1rim Rp 35.000
48. 29/07/2025 beli cutter & bufalo Rp 28.000
49. 18/08/2025 beli materai elektronik Rp 16.000
50. 22/08/2025 hadiah lomba agustusan Rp 100.000
51. 22/08/2025 paku Rp 2.000
52. 22/08/2025 cup & tali plastik Rp 26.000
53. 22/08/2025 kerupuk 5 Rp 25.000
54. 04/08/2025 nengok syafiq Rp 20.000
55. 03/09/2025 beli bolu talas Rp 39.000
56. 18/09/2025 bayar fakultaria Rp 100.500
57. 21/09/2025 beli bendera 2 Rp 336.000
58. 23/09/2025 kertas a4 1 rim Rp 35.000
59. 13/09/2025 beli lakban 3 & kuitansi 3 Rp 32.000
60. 25/09/2025 Beli laci kasir sob Rp 300.000
61. 03/10/2025 Digitalk Rp 200.000
62. 01/10/2025 print Rp 3.000
63. 23/09/2025 hvs Rp 35.000
64. 02/10/2025 print Rp 27.000
65. 03/10/2025 snack dan piring mabimpro Rp 80.000
66. 08/11/2025 konsum rapat Rp 126.000
`;

function parseLine(line, type) {
    if (!line.trim()) return null;
    const parts = line.trim().split(/\s+/);
    // Format: No. Date Description... Amount
    // Example: 1. 14/01/2025 Sisa uang DIGCITY 2023/2024 Rp 545.000

    const dateStr = parts[1];
    const [day, month, year] = dateStr.split('/');
    const date = `${year}-${month}-${day}`;

    // Find amount starting from the end
    let amountIndex = -1;
    for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i] === 'Rp') {
            amountIndex = i;
            break;
        }
    }

    if (amountIndex === -1) return null;

    const amountStr = parts.slice(amountIndex + 1).join('');
    const amount = parseInt(amountStr.replace(/\./g, ''), 10);

    const description = parts.slice(2, amountIndex).join(' ');

    return {
        date,
        description,
        amount,
        type,
        category: 'Umum', // Default category
        created_by: '00000000-0000-0000-0000-000000000000', // Placeholder or system user
        status: 'approved'
    };
}

const transactions = [];

incomeData.trim().split('\n').forEach(line => {
    const t = parseLine(line, 'income');
    if (t) transactions.push(t);
});

expenseData.trim().split('\n').forEach(line => {
    const t = parseLine(line, 'expense');
    if (t) transactions.push(t);
});

let sql = `
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

`;

transactions.forEach(t => {
    sql += `  INSERT INTO public.finance_transactions (date, description, amount, type, category, created_by, status)
  VALUES ('${t.date}', '${t.description.replace(/'/g, "''")}', ${t.amount}, '${t.type}', '${t.category}', v_user_id, '${t.status}');\n`;
});

sql += `END $$;`;

fs.writeFileSync('import_finance.sql', sql);
console.log('SQL generated in import_finance.sql');
