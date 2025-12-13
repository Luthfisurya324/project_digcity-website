import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    RefreshControl,
    Image,
    Dimensions,
    Animated,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
    Bell,
    Users,
    MapPin,
    CheckCircle2,
    BarChart3,
    Briefcase,
    Wallet,
    Trophy,
    ChevronRight,
    Calendar,
    Clock,
    Sun,
    Moon,
    Sunrise,
    Newspaper,
    TrendingUp,
    Zap,
} from 'lucide-react-native'
import { useTheme, spacing, borderRadius, shadows } from '../ui/theme'
import { supabase } from '../lib/supabase'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type ScreenName = 'welcome' | 'attendance' | 'history' | 'sanctions' | 'profile' | 'scan' | 'kpi' | 'tasks' | 'dues' | 'leaderboard'

interface WelcomeScreenProps {
    onNavigate: (screen: ScreenName) => void
    userEmail: string
    member: any
    todayEvents?: any[]
    history?: any[]
    onQuickCheckIn?: (eventId: string) => void
}

interface NewsItem {
    id: string
    title: string
    category: string
    image_url?: string
    published_date: string
}

export default function WelcomeScreen({
    onNavigate,
    userEmail,
    member,
    todayEvents = [],
    history = [],
    onQuickCheckIn,
}: WelcomeScreenProps) {
    const { colors, gradients, mode } = useTheme()
    const [refreshing, setRefreshing] = useState(false)
    const [news, setNews] = useState<NewsItem[]>([])

    const loadNews = async () => {
        try {
            const { data } = await supabase
                .from('news')
                .select('id, title, category, image_url, published_date')
                .order('published_date', { ascending: false })
                .limit(5)
            if (data) setNews(data)
        } catch (error) {
            console.log('News load error:', error)
        }
    }

    useEffect(() => {
        loadNews()
    }, [])

    const name = member?.full_name || 'Anggota DigCity'
    const firstName = name.split(' ')[0]
    const npm = member?.npm || '-'
    const division = member?.division || '-'
    const position = member?.position || 'Anggota'
    const presence = member?.presence_percent ?? 92

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour >= 5 && hour < 11) return { text: 'Selamat Pagi', icon: Sunrise, emoji: '☀️' }
        if (hour >= 11 && hour < 15) return { text: 'Selamat Siang', icon: Sun, emoji: '🌤️' }
        if (hour >= 15 && hour < 18) return { text: 'Selamat Sore', icon: Sun, emoji: '🌅' }
        return { text: 'Selamat Malam', icon: Moon, emoji: '🌙' }
    }

    const greeting = getGreeting()
    const isDark = mode === 'dark'

    const onRefresh = async () => {
        setRefreshing(true)
        await loadNews()
        setRefreshing(false)
    }

    const quickActions = [
        { key: 'kpi' as ScreenName, label: 'KPI', sublabel: 'Lihat performa', icon: TrendingUp, gradient: ['#6366f1', '#8b5cf6'] },
        { key: 'tasks' as ScreenName, label: 'Proker', sublabel: 'Tugas aktif', icon: Briefcase, gradient: ['#10b981', '#059669'] },
        { key: 'dues' as ScreenName, label: 'Iuran', sublabel: 'Status bayar', icon: Wallet, gradient: ['#f59e0b', '#d97706'] },
        { key: 'leaderboard' as ScreenName, label: 'Ranking', sublabel: 'Peringkat', icon: Trophy, gradient: ['#ec4899', '#d946ef'] },
    ]

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.bg }}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
            }
        >
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Hero Header */}
            <LinearGradient
                colors={isDark ? ['#1e1b4b', '#312e81', '#1e1b4b'] : ['#6366f1', '#8b5cf6', '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ paddingTop: spacing.xl, paddingBottom: spacing.xxl + 40, paddingHorizontal: spacing.lg }}
            >
                {/* Top Row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 4 }}>
                            {greeting.emoji} {greeting.text}
                        </Text>
                        <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: '700', letterSpacing: -0.5 }}>
                            {firstName}!
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Bell color="#ffffff" size={22} />
                        {history.length > 0 && (
                            <View style={{
                                position: 'absolute', top: 10, right: 10,
                                width: 10, height: 10, borderRadius: 5,
                                backgroundColor: '#ef4444', borderWidth: 2, borderColor: '#6366f1'
                            }} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Member Card */}
                <View style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 20,
                    padding: spacing.lg,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.2)',
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                        <View style={{
                            width: 56, height: 56, borderRadius: 18,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            justifyContent: 'center', alignItems: 'center',
                            borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
                        }}>
                            <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700' }}>
                                {name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={{ marginLeft: spacing.md, flex: 1 }}>
                            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600' }} numberOfLines={1}>
                                {name}
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                                {position} • {division}
                            </Text>
                        </View>
                        <View style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.25)',
                            paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
                        }}>
                            <Text style={{ color: '#34d399', fontSize: 12, fontWeight: '600' }}>Aktif</Text>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View style={{ flexDirection: 'row', marginTop: spacing.sm }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 }}>NPM</Text>
                            <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{npm}</Text>
                        </View>
                        <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 }}>Kehadiran</Text>
                            <Text style={{ color: '#34d399', fontSize: 15, fontWeight: '700' }}>{presence}%</Text>
                        </View>
                        <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 }}>Divisi</Text>
                            <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }} numberOfLines={1}>{division}</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            {/* Content Area - Overlapping Cards */}
            <View style={{ marginTop: -40, paddingHorizontal: spacing.lg }}>

                {/* Quick Actions - Horizontal Scroll */}
                <View style={{ marginBottom: spacing.lg }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: spacing.lg }}
                    >
                        {quickActions.map((action, index) => {
                            const Icon = action.icon
                            return (
                                <TouchableOpacity
                                    key={action.key}
                                    onPress={() => onNavigate(action.key)}
                                    activeOpacity={0.8}
                                    style={{ marginRight: spacing.md }}
                                >
                                    <LinearGradient
                                        colors={action.gradient as [string, string]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={{
                                            width: 100,
                                            height: 110,
                                            borderRadius: 20,
                                            padding: spacing.md,
                                            justifyContent: 'space-between',
                                            ...shadows.md,
                                        }}
                                    >
                                        <View style={{
                                            width: 40, height: 40, borderRadius: 12,
                                            backgroundColor: 'rgba(255,255,255,0.25)',
                                            justifyContent: 'center', alignItems: 'center',
                                        }}>
                                            <Icon color="#ffffff" size={22} />
                                        </View>
                                        <View>
                                            <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>{action.label}</Text>
                                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{action.sublabel}</Text>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>

                {/* Today's Agenda Section */}
                <View style={{ marginBottom: spacing.lg }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Agenda Hari Ini</Text>
                        <TouchableOpacity onPress={() => onNavigate('attendance')}>
                            <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>Lihat Semua</Text>
                        </TouchableOpacity>
                    </View>

                    {todayEvents.length === 0 ? (
                        <View style={{
                            backgroundColor: colors.card,
                            borderRadius: 20,
                            padding: spacing.xl,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: colors.border,
                        }}>
                            <View style={{
                                width: 64, height: 64, borderRadius: 32,
                                backgroundColor: colors.glass,
                                justifyContent: 'center', alignItems: 'center',
                                marginBottom: spacing.md,
                            }}>
                                <Calendar color={colors.muted} size={28} />
                            </View>
                            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 4 }}>Tidak ada agenda</Text>
                            <Text style={{ color: colors.muted, fontSize: 13, textAlign: 'center' }}>Nikmati hari bebas tugas! 🎉</Text>
                        </View>
                    ) : (
                        todayEvents.slice(0, 2).map((event, index) => (
                            <TouchableOpacity
                                key={String(event.id)}
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor: colors.card,
                                    borderRadius: 16,
                                    padding: spacing.lg,
                                    marginBottom: spacing.sm,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <LinearGradient
                                    colors={gradients.primary}
                                    style={{
                                        width: 50, height: 50, borderRadius: 14,
                                        justifyContent: 'center', alignItems: 'center',
                                        marginRight: spacing.md,
                                    }}
                                >
                                    <Calendar color="#ffffff" size={22} />
                                </LinearGradient>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600', marginBottom: 4 }} numberOfLines={1}>
                                        {event.title}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Clock color={colors.muted} size={12} />
                                        <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 4, marginRight: 12 }}>
                                            {event.time_range || '09:00'}
                                        </Text>
                                        <MapPin color={colors.muted} size={12} />
                                        <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 4 }} numberOfLines={1}>
                                            {event.location || 'Online'}
                                        </Text>
                                    </View>
                                </View>
                                <ChevronRight color={colors.muted} size={20} />
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                {/* News Section */}
                <View style={{ marginBottom: spacing.lg }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Newspaper color={colors.primary} size={20} />
                            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginLeft: spacing.sm }}>Berita Terbaru</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>Explore</Text>
                        </TouchableOpacity>
                    </View>

                    {news.length === 0 ? (
                        <View style={{
                            backgroundColor: colors.card,
                            borderRadius: 20,
                            padding: spacing.xl,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: colors.border,
                        }}>
                            <Newspaper color={colors.muted} size={32} />
                            <Text style={{ color: colors.muted, fontSize: 14, marginTop: spacing.sm }}>Belum ada berita</Text>
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: spacing.lg }}
                        >
                            {news.map((item) => {
                                const publishDate = new Date(item.published_date)
                                const now = new Date()
                                const diffDays = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24))
                                const dateLabel = diffDays === 0 ? 'Hari ini' : diffDays === 1 ? 'Kemarin' : `${diffDays} hari lalu`

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        activeOpacity={0.8}
                                        style={{
                                            width: SCREEN_WIDTH * 0.7,
                                            marginRight: spacing.md,
                                            backgroundColor: colors.card,
                                            borderRadius: 20,
                                            overflow: 'hidden',
                                            borderWidth: 1,
                                            borderColor: colors.border,
                                            ...shadows.md,
                                        }}
                                    >
                                        {item.image_url ? (
                                            <Image
                                                source={{ uri: item.image_url }}
                                                style={{ width: '100%', height: 140 }}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View style={{
                                                width: '100%', height: 140,
                                                backgroundColor: colors.glass,
                                                justifyContent: 'center', alignItems: 'center',
                                            }}>
                                                <Newspaper color={colors.muted} size={40} />
                                            </View>
                                        )}
                                        <View style={{ padding: spacing.md }}>
                                            <View style={{
                                                backgroundColor: colors.primaryBg,
                                                paddingHorizontal: 8, paddingVertical: 4,
                                                borderRadius: 6, alignSelf: 'flex-start',
                                                marginBottom: spacing.sm,
                                            }}>
                                                <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '600' }}>{item.category}</Text>
                                            </View>
                                            <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600', marginBottom: 4 }} numberOfLines={2}>
                                                {item.title}
                                            </Text>
                                            <Text style={{ color: colors.muted, fontSize: 12 }}>{dateLabel}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    )}
                </View>

                {/* Recent Activity Section */}
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Zap color={colors.warning} size={20} />
                            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginLeft: spacing.sm }}>Aktivitas Terbaru</Text>
                        </View>
                    </View>

                    {history.length === 0 ? (
                        <View style={{
                            backgroundColor: colors.card,
                            borderRadius: 16,
                            padding: spacing.lg,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: colors.border,
                        }}>
                            <Text style={{ color: colors.muted, fontSize: 14 }}>Belum ada aktivitas terbaru</Text>
                        </View>
                    ) : (
                        history.slice(0, 3).map((h, index) => (
                            <View
                                key={String(h.id)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.card,
                                    borderRadius: 14,
                                    padding: spacing.md,
                                    marginBottom: spacing.sm,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}
                            >
                                <View style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    backgroundColor: colors.successBg,
                                    justifyContent: 'center', alignItems: 'center',
                                    marginRight: spacing.md,
                                }}>
                                    <CheckCircle2 color={colors.success} size={22} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }}>Presensi Berhasil</Text>
                                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                                        {new Date(h.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

            </View>
        </ScrollView>
    )
}
