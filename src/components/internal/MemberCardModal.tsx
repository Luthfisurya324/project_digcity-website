import React, { useMemo } from 'react'
import { X, Download, QrCode, Mail, Phone } from 'lucide-react'
import type { OrganizationMember } from '../../lib/supabase'

interface MemberCardModalProps {
  member: OrganizationMember
  onClose: () => void
}

const MemberCardModal: React.FC<MemberCardModalProps> = ({ member, onClose }) => {
  const payload = useMemo(() => {
    const data = {
      type: 'DIGCITY_MEMBER',
      id: member.id,
      name: member.full_name,
      npm: member.npm,
      division: member.division,
      position: member.position,
      join_year: member.join_year
    }
    return JSON.stringify(data)
  }, [member])

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(payload)}&bgcolor=ffffff`

  const handleDownload = async () => {
    try {
      const response = await fetch(qrImageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `DIGCITY-MEMBER-${member.npm}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to download QR', error)
      alert('Gagal mengunduh QR Code')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-6 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <X size={20} />
          </button>
          <h3 className="text-lg font-bold">Kartu Anggota Digital</h3>
          <p className="text-blue-100 text-xs">Tunjukkan QR untuk verifikasi identitas</p>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-2xl shadow-inner border border-slate-200 overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden border">
                {member.image_url ? (
                  <img src={member.image_url} alt={member.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <QrCode size={24} />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{member.full_name}</p>
                <p className="text-xs text-slate-500">{member.position} • {member.division}</p>
                <p className="text-xs text-slate-500">Angkatan {member.join_year}</p>
              </div>
            </div>

            <div className="p-4 flex flex-col items-center">
              <img src={qrImageUrl} alt="QR Code Member" className="w-40 h-40 object-contain" />
              <div className="mt-4 text-center">
                <p className="text-xs font-mono text-slate-500">NPM: {member.npm}</p>
                <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-500">
                  <a href={`mailto:${member.email}`} className="flex items-center gap-1 hover:text-blue-600"><Mail size={12} /> {member.email}</a>
                  {member.phone && (<a href={`https://wa.me/${member.phone.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-emerald-600"><Phone size={12} /> {member.phone}</a>)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button 
              onClick={handleDownload}
              className="flex-1 py-2.5 bg-slate-100 dark:bg-[#2A2A2A] text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} /> Simpan QR
            </button>
            <button 
              onClick={() => window.print()}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors"
            >
              Cetak
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberCardModal
