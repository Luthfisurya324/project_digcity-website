import React, { useState, useRef, useEffect } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { HelpCircle, X, BookOpen } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { TUTORIALS, TutorialDefinition } from './tutorialData'

interface TutorialButtonProps {
    sidebarCollapsed?: boolean
}

const TutorialButton: React.FC<TutorialButtonProps> = () => {
    const location = useLocation()
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const activeTutorials = TUTORIALS.filter(t => {
        // Normalisasi current path
        let currentPath = location.pathname.replace(/\/$/, '') || '/'

        // Normalisasi target path dari definisi tutorial
        let targetPath = t.pathStr.replace(/\/$/, '') || '/'

        // 1. Direct match (e.g. localhost:3000/internal/finance === /internal/finance)
        if (currentPath === targetPath) return true

        // 2. Subdomain match logic
        // Definisi tutorial selalu pakai /internal/..., tapi di subdomain prefix itu hilang
        // Jadi kita coba strip '/internal' dari targetPath
        const strippedTarget = targetPath.replace(/^\/internal/, '') || '/'

        // Jika stripped target match dengan current path, berarti cocok untuk subdomain
        if (currentPath === strippedTarget) return true

        return false
    })

    const startTour = (tutorial: TutorialDefinition) => {
        setShowMenu(false)
        const driverObj = driver({
            showProgress: true,
            animate: true,
            nextBtnText: 'Lanjut',
            prevBtnText: 'Kembali',
            doneBtnText: 'Selesai',
            steps: tutorial.steps
        })

        driverObj.drive()
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={menuRef}>
            {/* Tutorial Menu */}
            {showMenu && (
                <div className="mb-4 w-72 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#333] overflow-hidden transform transition-all animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} />
                            <h3 className="font-bold">Pusat Bantuan</h3>
                        </div>
                        <button
                            onClick={() => setShowMenu(false)}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="p-2 max-h-[300px] overflow-y-auto">
                        {activeTutorials.length > 0 ? (
                            <div className="space-y-1">
                                {activeTutorials.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => startTour(t)}
                                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#2A2A2A] transition-colors group border border-transparent hover:border-slate-100 dark:hover:border-[#333]"
                                    >
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform"></span>
                                            {t.title}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-3.5 leading-relaxed">
                                            {t.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-slate-500 text-sm">
                                <p>Tidak ada tutorial khusus untuk halaman ini.</p>
                                <button
                                    onClick={() => {
                                        const dashTutorial = TUTORIALS.find(t => t.id === 'dashboard-intro')
                                        if (dashTutorial) startTour(dashTutorial)
                                    }}
                                    className="mt-3 text-blue-600 hover:underline font-medium"
                                >
                                    Buka Tur Dasar
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-[#252525] border-t border-slate-100 dark:border-[#333] text-center">
                        <p className="text-[10px] text-slate-400">DigCity Internal Guide</p>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center group ${showMenu ? 'bg-slate-800 text-white rotate-90' : 'bg-blue-600 text-white'}`}
                title="Bantuan / Tutorial"
            >
                {showMenu ? <X size={28} /> : <HelpCircle size={28} />}
                {!showMenu && (
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out whitespace-nowrap font-medium pr-1">
                        Bantuan
                    </span>
                )}
            </button>
        </div>
    )
}

export default TutorialButton
