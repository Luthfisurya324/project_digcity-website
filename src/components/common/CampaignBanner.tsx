import React from 'react'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CampaignBannerProps {
    onDismiss?: () => void
}

const CampaignBanner: React.FC<CampaignBannerProps> = ({ onDismiss }) => {
    return (
        <div className="relative w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden border-b border-white/10">
            {/* Abstract Shapes / Background Effects - Simplified for distinctness */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="container mx-auto px-4 py-3 md:py-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Left Content */}
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="hidden md:flex p-2.5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10 shadow-lg ring-1 ring-white/5 group-hover:bg-white/10 transition-colors">
                        <Sparkles className="text-amber-300 w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-sm md:text-base font-bold tracking-wide text-white drop-shadow-md">
                            RECAP KEPENGURUSAN 2025
                        </h3>
                        <p className="text-xs md:text-sm text-blue-100/90 font-medium">
                            Sebuah perjalanan penuh makna. Menuju <span className="text-amber-300 font-bold">Pemira 2026!</span>
                        </p>
                    </div>
                </div>

                {/* Right Content / CTA */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Link
                            to="/blog/recap-2025"
                            className="group relative px-6 py-2 rounded-full bg-white text-blue-950 text-xs md:text-sm font-bold hover:bg-blue-50 transition-all duration-300 shadow-xl shadow-blue-900/20 hover:shadow-blue-500/20 active:scale-95 flex items-center gap-2 overflow-hidden ring-2 ring-transparent hover:ring-white/50"
                        >
                            <span className="relative z-10">Lihat Recap</span>
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform relative z-10" />

                            {/* Shine Effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0"></div>
                        </Link>
                    </div>

                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            aria-label="Tutup banner"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CampaignBanner
