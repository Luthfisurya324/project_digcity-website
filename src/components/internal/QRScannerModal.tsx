import React, { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { X, Camera, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface QRScannerModalProps {
    onClose: () => void
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose }) => {
    const navigate = useNavigate()
    const [error, setError] = useState<string>('')
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const mountedRef = useRef(true)

    useEffect(() => {
        mountedRef.current = true
        const startScanner = async () => {
            try {
                const devices = await Html5Qrcode.getCameras()
                if (devices && devices.length) {
                    if (!mountedRef.current) return

                    const html5QrCode = new Html5Qrcode("qr-reader", {
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
                }
            } catch (err) {
                console.error('Error starting scanner:', err)
                setError('Gagal mengakses kamera. Pastikan izin kamera diberikan.')
            }
        }

        startScanner()

        return () => {
            mountedRef.current = false
            if (scannerRef.current) {
                scannerRef.current.stop().then(() => {
                    scannerRef.current?.clear()
                }).catch(err => {
                    console.error('Failed to stop scanner', err)
                })
            }
        }
    }, [])

    const handleScanSuccess = (decodedText: string) => {
        if (!mountedRef.current) return

        // Stop scanning immediately
        if (scannerRef.current) {
            scannerRef.current.stop().catch(console.error)
        }

        try {
            // Expected format: https://domain.com/internal/checkin?event=...&token=...
            const url = new URL(decodedText)

            // Verify it's a valid internal checkin URL
            if (url.pathname.includes('/internal/checkin') && url.searchParams.has('event')) {
                // Navigate to the checkin page with the params
                navigate(`${url.pathname}${url.search}`)
                onClose()
            } else {
                setError('QR Code tidak valid untuk presensi.')
            }
        } catch (e) {
            setError('Format QR Code tidak dikenali.')
        }
    }

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
                <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-[#2A2A2A]">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Camera size={20} className="text-blue-600" />
                        Scan QR Presensi
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-[#2A2A2A] rounded-full transition-colors text-slate-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center justify-center bg-black relative min-h-[400px]">
                    {error ? (
                        <div className="text-center text-white p-6">
                            <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <p className="font-medium mb-2">Terjadi Kesalahan</p>
                            <p className="text-sm opacity-80">{error}</p>
                            <button
                                onClick={onClose}
                                className="mt-6 px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    ) : (
                        <>
                            <div id="qr-reader" className="w-full h-full overflow-hidden rounded-xl"></div>
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
                                </div>
                            </div>
                            <p className="absolute bottom-8 text-white/80 text-sm font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                                Arahkan kamera ke QR Code
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default QRScannerModal
