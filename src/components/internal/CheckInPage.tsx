import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { attendanceAPI, authAPI, supabase } from '../../lib/supabase'
import { CheckCircle, XCircle, MapPin, Clock, Calendar } from 'lucide-react'

const CheckInPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const eventId = searchParams.get('event')
  const tokenParam = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Memverifikasi data...')
  const [eventDetails, setEventDetails] = useState<any>(null)

  useEffect(() => {
    checkIn()
  }, [])

  const checkIn = async () => {
    if (!eventId) {
      setStatus('error')
      setMessage('Event ID tidak ditemukan.')
      return
    }
    if (!tokenParam) {
      setStatus('error')
      setMessage('QR tidak valid atau sudah kadaluwarsa. Silakan scan ulang.')
      return
    }

    try {
      // 1. Check Auth
      const user = await authAPI.getCurrentUser()
      if (!user) {
        // Redirect to login with return url
        // For now, simple error
        setStatus('error')
        setMessage('Silakan login terlebih dahulu.')
        return
      }
      // 2. Get Event Details
      const { data: event, error: eventError } = await supabase
        .from('internal_events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (eventError || !event) {
        throw new Error('Event tidak ditemukan.')
      }
      setEventDetails(event)
      if (event.qr_code && event.qr_code !== tokenParam) {
        setStatus('error')
        setMessage('QR sudah kadaluwarsa. Silakan scan ulang kode terbaru.')
        return
      }

      // Ideally we need to find the organization_member record for this auth user
      const { data: member } = await supabase
        .from('organization_members')
        .select('id, full_name, npm')
        .eq('email', user.email)
        .single()

      const { data: existing } = await supabase
        .from('attendance')
        .select('id, member_id, name')
        .eq('event_id', eventId)
        .limit(10000)

      const alreadyChecked = (existing || []).some((record) => {
        if (member?.id && record.member_id === member.id) return true
        const identifier = member?.full_name || user.user_metadata?.full_name || user.email
        return identifier ? record.name === identifier : false
      })

      if (alreadyChecked) {
        navigate(`/internal?status=already_attended&event=${encodeURIComponent(event.title)}`)
        return
      }

      // 4. Record Attendance
      await attendanceAPI.recordAttendance({
        event_id: eventId,
        member_id: member?.id || undefined, // Optional if external user
        name: member?.full_name || user.user_metadata?.full_name || user.email || 'Unknown',
        npm: member?.npm || '-',
        status: 'present',
        check_in_time: new Date().toISOString(),
        notes: 'QR Check-in'
      })

      navigate(`/internal?status=success&event=${encodeURIComponent(event.title)}`)

    } catch (error: any) {
      console.error('Check-in error:', error)
      setStatus('error')
      setMessage(error.message || 'Gagal melakukan presensi.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0e0e0e] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Memproses Presensi...</h2>
              <p className="text-slate-500 mt-2">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Berhasil!</h2>
              <p className="text-slate-500 mt-2">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                <XCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gagal</h2>
              <p className="text-slate-500 mt-2">{message}</p>
            </div>
          )}
        </div>

        {eventDetails && (
          <div className="bg-slate-50 dark:bg-[#232323] p-6 border-t border-slate-100 dark:border-[#2A2A2A]">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Detail Event</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{eventDetails.title}</p>
                  <p className="text-sm text-slate-500">{new Date(eventDetails.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {new Date(eventDetails.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{eventDetails.location}</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50 dark:bg-[#232323] border-t border-slate-100 dark:border-[#2A2A2A] flex justify-center">
          <button
            onClick={() => navigate('/internal/attendance')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckInPage
