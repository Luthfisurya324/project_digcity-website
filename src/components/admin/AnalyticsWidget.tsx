import React from 'react'
import { TrendingUp, Users, Eye, Clock, ChevronRight } from 'lucide-react'

interface AnalyticsWidgetProps {
    className?: string
}

/**
 * AnalyticsWidget - Komponen untuk menampilkan statistik website
 * 
 * NOTE: Komponen ini siap diintegrasikan dengan layanan analytics seperti:
 * - Google Analytics 4
 * - Vercel Analytics
 * - Plausible
 * - Umami
 * 
 * Untuk integrasi:
 * 1. Install SDK analytics pilihan
 * 2. Fetch data dari API analytics
 * 3. Replace dummy data dengan real data
 */
const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({ className = '' }) => {
    // Placeholder data - ganti dengan real analytics data
    const stats = {
        pageViews: {
            value: '12,450',
            change: '+12%',
            positive: true
        },
        uniqueVisitors: {
            value: '3,280',
            change: '+8%',
            positive: true
        },
        avgSessionDuration: {
            value: '3m 24s',
            change: '-2%',
            positive: false
        },
        bounceRate: {
            value: '42%',
            change: '-5%',
            positive: true
        }
    }

    const topPages = [
        { path: '/', title: 'Homepage', views: 4250 },
        { path: '/events', title: 'Events', views: 2180 },
        { path: '/blog', title: 'Blog', views: 1890 },
        { path: '/gallery', title: 'Gallery', views: 1450 },
        { path: '/kontak', title: 'Kontak', views: 980 }
    ]

    const StatCard = ({
        title,
        value,
        change,
        positive,
        icon: Icon
    }: {
        title: string
        value: string
        change: string
        positive: boolean
        icon: React.ElementType
    }) => (
        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
                <Icon size={16} className="text-slate-400" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className={`text-xs mt-1 ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {change} vs bulan lalu
            </p>
        </div>
    )

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Website Analytics</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">30 hari terakhir</p>
                </div>
                <a
                    href="https://vercel.com/analytics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                    Lihat Detail <ChevronRight size={14} />
                </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                    title="Page Views"
                    value={stats.pageViews.value}
                    change={stats.pageViews.change}
                    positive={stats.pageViews.positive}
                    icon={Eye}
                />
                <StatCard
                    title="Unique Visitors"
                    value={stats.uniqueVisitors.value}
                    change={stats.uniqueVisitors.change}
                    positive={stats.uniqueVisitors.positive}
                    icon={Users}
                />
                <StatCard
                    title="Avg. Session"
                    value={stats.avgSessionDuration.value}
                    change={stats.avgSessionDuration.change}
                    positive={stats.avgSessionDuration.positive}
                    icon={Clock}
                />
                <StatCard
                    title="Bounce Rate"
                    value={stats.bounceRate.value}
                    change={stats.bounceRate.change}
                    positive={stats.bounceRate.positive}
                    icon={TrendingUp}
                />
            </div>

            {/* Top Pages */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] p-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Top Pages</h4>
                <div className="space-y-2">
                    {topPages.map((page, index) => (
                        <div
                            key={page.path}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2A2A2A] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{page.title}</p>
                                    <p className="text-xs text-slate-500">{page.path}</p>
                                </div>
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {page.views.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Integration Note */}
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-800 dark:text-amber-300">
                    <strong>💡 Catatan:</strong> Data ini adalah placeholder. Integrasikan dengan Google Analytics atau Vercel Analytics untuk data real-time.
                </p>
            </div>
        </div>
    )
}

export default AnalyticsWidget
