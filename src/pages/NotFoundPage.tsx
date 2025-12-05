import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, AlertTriangle } from 'lucide-react'

interface NotFoundPageProps {
    type?: 'main' | 'admin' | 'internal'
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ type = 'main' }) => {
    const navigate = useNavigate()

    const config = {
        main: {
            title: 'Halaman Tidak Ditemukan',
            description: 'Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.',
            homeLink: '/',
            homeText: 'Kembali ke Beranda',
            bgClass: 'bg-white dark:bg-slate-900',
            textClass: 'text-slate-900 dark:text-white',
            subTextClass: 'text-slate-600 dark:text-slate-400'
        },
        admin: {
            title: 'Admin Page Not Found',
            description: 'The requested admin resource could not be found.',
            homeLink: '/admin',
            homeText: 'Back to Dashboard',
            bgClass: 'bg-slate-50 dark:bg-[#111]',
            textClass: 'text-slate-900 dark:text-white',
            subTextClass: 'text-slate-600 dark:text-slate-400'
        },
        internal: {
            title: 'Halaman Internal Tidak Ditemukan',
            description: 'Halaman yang Anda cari di dashboard internal tidak tersedia.',
            homeLink: '/internal',
            homeText: 'Kembali ke Dashboard',
            bgClass: 'bg-slate-50 dark:bg-[#111]',
            textClass: 'text-slate-900 dark:text-white',
            subTextClass: 'text-slate-600 dark:text-slate-400'
        }
    }

    const currentConfig = config[type]

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 ${currentConfig.bgClass}`}>
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-500">
                        <AlertTriangle size={48} />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className={`text-3xl font-bold ${currentConfig.textClass}`}>
                        404
                    </h1>
                    <h2 className={`text-xl font-semibold ${currentConfig.textClass}`}>
                        {currentConfig.title}
                    </h2>
                    <p className={currentConfig.subTextClass}>
                        {currentConfig.description}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <ArrowLeft size={18} />
                        Kembali
                    </button>
                    <Link
                        to={currentConfig.homeLink}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-200 dark:shadow-none"
                    >
                        <Home size={18} />
                        {currentConfig.homeText}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage
