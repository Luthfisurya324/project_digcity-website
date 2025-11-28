import React, { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { Camera, AlertCircle, ScanLine, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { attendanceAPI, authAPI, supabase } from '../../lib/supabase'


const DashboardQRScanner: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false)
    const [error, setError] = useState<string>('')
    const [processing, setProcessing] = useState(false)
    const [result, setResult] = useState<{ status: 'success' | 'error', message: string, title?: string } | null>(null)
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const mountedRef = useRef(true)

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
            stopScanner()
        }
    }, [])

    const startScanner = async () => {
        setIsScanning(true)
        setError('')
        setResult(null)
        try {
            const devices = await Html5Qrcode.getCameras()
            if (devices && devices.length) {
                if (!mountedRef.current) return

                const html5QrCode = new Html5Qrcode("dashboard-qr-reader", {
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                    verbose: false
                })
                scannerRef.current = html5QrCode

                await html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0
                    },
                    (decodedText) => {
                        handleScanSuccess(decodedText)
                    },
                    () => {
                        // Ignore errors
                    }
                )
            } else {
                setError('Kamera tidak ditemukan.')
                setIsScanning(false)
            }
        } catch (err) {
            console.error('Error starting scanner:', err)
            setError('Gagal mengakses kamera. Pastikan izin kamera diberikan.')
            setIsScanning(false)
        }
    }

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop()
                scannerRef.current.clear()
            } catch (err) {
                console.error('Failed to stop scanner', err)
            }
            scannerRef.current = null
        }
        setIsScanning(false)
    }

    const handleScanSuccess = async (decodedText: string) => {
        if (!mountedRef.current || processing) return

        // Stop scanning immediately to prevent double reads
        await stopScanner()
        setProcessing(true)

        try {
            // Expected format: https://domain.com/internal/checkin?event=...&token=...
            const url = new URL(decodedText)
            const eventId = url.searchParams.get('event')
            const token = url.searchParams.get('token')

            // Verify it's a valid internal checkin URL
            if (!url.pathname.includes('/internal/checkin') || !eventId) {
                throw new Error('QR Code tidak valid untuk presensi.')
            }

            // 1. Check Auth
            const user = await authAPI.getCurrentUser()
            if (!user) {
                throw new Error('Sesi habis. Silakan login ulang.')
            }

            // 2. Get Event Details & Verify Token
            const { data: event, error: eventError } = await supabase
                .from('internal_events')
                .select('*')
                .eq('id', eventId)
                .single()

            if (eventError || !event) {
                throw new Error('Event tidak ditemukan.')
            }

            if (event.qr_code && event.qr_code !== token) {
                throw new Error('QR Code sudah kadaluwarsa.')
            }

            // 3. Check if already checked in
            // Get member details
            const { data: member } = await supabase
                .from('organization_members')
                .select('id, full_name, npm')
                .eq('email', user.email)
                .single()

            const { data: existing } = await supabase
                .from('attendance')
                .select('id, member_id, name')
                .eq('event_id', eventId)

            const alreadyChecked = (existing || []).some((record) => {
                if (member?.id && record.member_id === member.id) return true
                const identifier = member?.full_name || user.user_metadata?.full_name || user.email
                return identifier ? record.name === identifier : false
            })

            if (alreadyChecked) {
                setResult({
                    status: 'success',
                    title: 'Sudah Presensi',
                    message: `Anda sudah tercatat hadir di "${event.title}".`
                })
                setProcessing(false)
                return
            }

            // 4. Record Attendance
            await attendanceAPI.recordAttendance({
                event_id: eventId,
                member_id: member?.id || undefined,
                name: member?.full_name || user.user_metadata?.full_name || user.email || 'Unknown',
                npm: member?.npm || '-',
                status: 'present',
                check_in_time: new Date().toISOString(),
                notes: 'Dashboard QR Scan'
            })

            setResult({
                status: 'success',
                title: 'Presensi Berhasil!',
                message: `Kehadiran Anda di "${event.title}" telah tercatat.`
            })

        } catch (e: any) {
            console.error('Scan error:', e)
            setResult({
                status: 'error',
                title: 'Gagal Presensi',
                message: e.message || 'Terjadi kesalahan saat memproses data.'
            })
        } finally {
            setProcessing(false)
        }
    }

    const closeResult = () => {
        setResult(null)
    }

    return (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden shadow-sm relative">
            {/* Loading Overlay */}
            {processing && (
                <div className="absolute inset-0 bg-white/80 dark:bg-black/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
                    <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
                    <p className="font-medium text-slate-900 dark:text-white">Memproses Data...</p>
                </div>
            )}

            {/* Result Overlay */}
            {result && (
                <div className="absolute inset-0 bg-white dark:bg-[#1E1E1E] z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-200">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${result.status === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {result.status === 'success' ? <CheckCircle size={40} /> : <XCircle size={40} />}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{result.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">{result.message}</p>
                    <button
                        onClick={closeResult}
                        className="px-6 py-2 bg-slate-100 dark:bg-[#2A2A2A] hover:bg-slate-200 dark:hover:bg-[#333] text-slate-900 dark:text-white rounded-xl font-medium transition-colors"
                    >
                        Tutup & Scan Lagi
                    </button>
                </div>
            )}

            <div className="p-4 border-b border-slate-100 dark:border-[#2A2A2A] flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ScanLine size={20} className="text-blue-600" />
                    Scan Presensi Cepat
                </h3>
                {isScanning && (
                    <button
                        onClick={stopScanner}
                        className="text-xs font-medium text-rose-600 hover:text-rose-700 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20"
                    >
                        Stop Kamera
                    </button>
                )}
            </div>

            <div className="p-6">
                {error && (
                    <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm rounded-lg flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {!isScanning ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                            <Camera size={32} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Siap untuk Presensi?</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs">
                            Aktifkan kamera untuk memindai QR Code acara dan melakukan presensi secara instan.
                        </p>
                        <button
                            onClick={startScanner}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none"
                        >
                            <Camera size={18} />
                            Buka Kamera
                        </button>
                    </div>
                ) : (
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-square max-w-sm mx-auto">
                        <div id="dashboard-qr-reader" className="w-full h-full"></div>
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="w-48 h-48 border-2 border-white/50 rounded-2xl relative">
                                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DashboardQRScanner
