import React, { useEffect, useState } from 'react'
import { X, Download, Calendar, Clock, MapPin, RefreshCw } from 'lucide-react'
import { InternalEvent, attendanceAPI } from '../../lib/supabase'

interface EventQRModalProps {
  event: InternalEvent
  onClose: () => void
}

const EventQRModal: React.FC<EventQRModalProps> = ({ event, onClose }) => {
  const [qrCode, setQrCode] = useState(event.qr_code || '')
  const [countdown, setCountdown] = useState(60)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  // Construct the check-in URL with latest QR token
  const baseUrl = window.location.origin
  const checkInUrl = qrCode ? `${baseUrl}/internal/checkin?event=${event.id}&token=${qrCode}` : `${baseUrl}/internal/checkin?event=${event.id}`
  const qrImageUrl = qrCode
    ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(checkInUrl)}&bgcolor=ffffff`
    : ''

  useEffect(() => {
    let refreshInterval: ReturnType<typeof setInterval> | null = null
    let countdownInterval: ReturnType<typeof setInterval> | null = null

    const refreshQr = async () => {
      try {
        setRefreshing(true)
        setError('')
        const newCode = await attendanceAPI.refreshQrCode(event.id)
        setQrCode(newCode)
        setCountdown(60)
      } catch (err) {
        console.error('Failed to refresh QR code', err)
        setError('Gagal memuat QR baru, coba ulangi dalam beberapa detik.')
      } finally {
        setRefreshing(false)
      }
    }

    refreshQr()
    refreshInterval = setInterval(refreshQr, 60000)
    countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      if (refreshInterval) clearInterval(refreshInterval)
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, [event.id])

  const handleDownload = async () => {
    try {
      const response = await fetch(qrImageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `QR-${event.title.replace(/\s+/g, '-')}.png`
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
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all">
        <div className="relative bg-blue-600 p-6 text-center text-white">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          <h3 className="text-lg font-bold mb-1">Scan untuk Presensi</h3>
          <p className="text-blue-100 text-xs">Arahkan kamera ke kode QR ini</p>
        </div>

        <div className="p-8 flex flex-col items-center">
          <div className="bg-white p-4 rounded-2xl shadow-inner border-2 border-dashed border-slate-200 mb-6 min-h-[220px] flex items-center justify-center">
            {qrImageUrl ? (
              <img 
                src={qrImageUrl} 
                alt="QR Code Presensi" 
                className="w-48 h-48 object-contain"
              />
            ) : (
              <div className="flex flex-col items-center text-center text-slate-400 gap-3">
                <div className="w-12 h-12 border-4 border-blue-500/40 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium">Menyiapkan QR dinamis...</p>
              </div>
            )}
          </div>

          <div className="w-full text-center space-y-2 mb-6">
            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{event.title}</h4>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Calendar size={14} />
              <span>{new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
              <span>•</span>
              <Clock size={14} />
              <span>{new Date(event.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <MapPin size={12} />
              <span>{event.location}</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw size={12} className={refreshing ? 'animate-spin text-blue-500' : 'text-blue-500'} />
              <span>QR ganti otomatis dalam {countdown}s</span>
            </div>
            {error && <p className="text-xs text-rose-500">{error}</p>}
          </div>

          <div className="flex gap-3 w-full">
            <button 
              onClick={handleDownload}
              className="flex-1 py-2.5 bg-slate-100 dark:bg-[#2A2A2A] text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              disabled={!qrImageUrl}
            >
              <Download size={16} />
              Simpan QR
            </button>
            <button 
              onClick={() => window.open(checkInUrl, '_blank')}
              disabled={!qrImageUrl}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              Buka Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventQRModal
