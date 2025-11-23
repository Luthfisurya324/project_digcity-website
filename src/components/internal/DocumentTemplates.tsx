import React from 'react'
import { X, Download, FileText } from 'lucide-react'

interface DocumentTemplatesProps {
  onClose: () => void
}

const DocumentTemplates: React.FC<DocumentTemplatesProps> = ({ onClose }) => {
  const templates = [
    {
      id: 'spj',
      title: 'Template SPJ Kegiatan',
      description: 'Format standar untuk Surat Pertanggungjawaban kegiatan organisasi.',
      format: 'DOCX',
      size: '245 KB',
      filename: 'Template-SPJ.docx',
      mimeType: 'application/msword',
      content: `SURAT PERTANGGUNGJAWABAN KEGIATAN\n\n1. Nama Kegiatan : \n2. Penanggung Jawab : \n3. Realisasi Dana : \n4. Rincian Pengeluaran :\n   - Item 1 .............. Rp\n   - Item 2 .............. Rp\n\nDilampirkan bukti transaksi dan dokumentasi kegiatan.\n\nHormat kami,\nBidang Keuangan`
    },
    {
      id: 'invitation',
      title: 'Surat Undangan Resmi',
      description: 'Template surat undangan untuk pembicara atau tamu VIP.',
      format: 'DOCX',
      size: '180 KB',
      filename: 'Template-Undangan.docx',
      mimeType: 'application/msword',
      content: `SURAT UNDANGAN\nNomor : ORG/UND/___/I/2025\n\nYth. ______________________\nDi Tempat\n\nDengan hormat,\nKami mengundang Saudara/i untuk menghadiri __________________ pada:\nHari/Tanggal :\nWaktu        :\nTempat       :\nAcara        :\n\nDemikian undangan ini kami sampaikan.`
    },
    {
      id: 'report',
      title: 'Laporan Pertanggungjawaban (LPJ)',
      description: 'Format lengkap penyusunan laporan akhir kegiatan.',
      format: 'DOCX',
      size: '500 KB',
      filename: 'Template-LPJ.docx',
      mimeType: 'application/msword',
      content: `LAPORAN PERTANGGUNGJAWABAN (LPJ)\n\n1. Latar Belakang Kegiatan\n2. Tujuan Kegiatan\n3. Pelaksanaan\n4. Evaluasi\n5. Realisasi Anggaran\n6. Dokumentasi`
    },
    {
      id: 'memo',
      title: 'Memo Internal',
      description: 'Format surat untuk komunikasi internal pengurus.',
      format: 'PDF',
      size: '120 KB',
      filename: 'Template-Memo.pdf',
      mimeType: 'application/pdf',
      content: `MEMO INTERNAL\nTanggal : \nKepada  : \nDari    : \nPerihal : \n\nIsi memo:`
    }
  ]

  const handleDownload = (template: typeof templates[number]) => {
    const blob = new Blob([template.content], { type: template.mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = template.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl transform transition-all flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A]">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Template Dokumen</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Unduh format standar organisasi</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className="p-4 border border-slate-200 dark:border-[#2A2A2A] rounded-xl hover:border-blue-300 hover:shadow-md transition-all group bg-white dark:bg-[#232323]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FileText size={20} />
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-[#1A1A1A] text-slate-600 dark:text-slate-300 rounded uppercase">
                  {template.format}
                </span>
              </div>
              
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{template.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                {template.description}
              </p>
              
              <button 
                onClick={() => handleDownload(template)}
                className="w-full py-2 flex items-center justify-center gap-2 bg-slate-50 dark:bg-[#1A1A1A] text-slate-700 dark:text-slate-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors text-sm font-medium"
              >
                <Download size={16} />
                Download ({template.size})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DocumentTemplates
