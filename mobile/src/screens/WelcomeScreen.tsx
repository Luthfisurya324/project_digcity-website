import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    RefreshControl,
    Alert,
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
} from 'lucide-react-native'
import { useTheme, spacing, borderRadius, shadows } from '../ui/theme'

type ScreenName = 'welcome' | 'attendance' | 'history' | 'sanctions' | 'profile' | 'scan' | 'kpi' | 'tasks' | 'dues' | 'leaderboard'

interface WelcomeScreenProps {
    onNavigate: (screen: ScreenName) => void
    userEmail: string
    member: any
    todayEvents?: any[]
    history?: any[]
    onQuickCheckIn?: (eventId: string) => void
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

    const name = member?.full_name || 'Anggota DigCity'
    const npm = member?.npm || '-'
    const division = member?.division || '-'
    const position = member?.position || 'Anggota'
    const presence = member?.presence_percent ? `${member.presence_percent}%` : '92%'

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour >= 5 && hour < 11) return { text: 'Selamat Pagi', icon: Sunrise, color: '#f59e0b' }
        if (hour >= 11 && hour < 15) return { text: 'Selamat Siang', icon: Sun, color: '#eab308' }
        if (hour >= 15 && hour < 18) return { text: 'Selamat Sore', icon: Sun, color: '#f97316' }
        return { text: 'Selamat Malam', icon: Moon, color: '#8b5cf6' }
    }

    const greeting = getGreeting()
    const GreetingIcon = greeting.icon

    const quickActions = [
        { key: 'kpi' as ScreenName, label: 'KPI Saya', icon: BarChart3, color: colors.primary, gradient: gradients.primary },
        { key: 'tasks' as ScreenName, label: 'Tugas', icon: Briefcase, color: colors.success, gradient: gradients.success },
        { key: 'dues' as ScreenName, label: 'Iuran', icon: Wallet, color: colors.warning, gradient: ['#f59e0b', '#d97706'] as const },
        { key: 'leaderboard' as ScreenName, label: 'Peringkat', icon: Trophy, color: colors.accent, gradient: ['#8b5cf6', '#7c3aed'] as const },
    ]

    const onRefresh = async () => {
        setRefreshing(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setRefreshing(false)
    }

    const isDark = mode === 'dark'

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.bg }}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
            }
        >
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>

                {/* Header Card */}
                <View style={{
                    borderRadius: borderRadius.xl,
                    overflow: 'hidden',
                    marginBottom: spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.glassBorder,
                    ...shadows.lg,
                }}>
                    <LinearGradient colors={gradients.cardDark} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: spacing.lg }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <LinearGradient
                                    colors={gradients.primary}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: spacing.md,
                                    }}
                                >
                                    <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 18 }}>
                                        {name.slice(0, 1).toUpperCase()}
                                    </Text>
                                </LinearGradient>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <GreetingIcon color={greeting.color} size={16} />
                                        <Text style={{ color: colors.muted, fontSize: 13, marginLeft: 6 }}>{greeting.text}</Text>
                                    </View>
                                    <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }} numberOfLines={1}>
                                        {name}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    const notifCount = history.length
                                    Alert.alert(
                                        '🔔 Notifikasi',
                                        notifCount > 0
                                            ? `Anda memiliki ${notifCount} aktivitas terbaru.\n\nLihat di bagian "Aktivitas Terbaru" di bawah.`
                                            : 'Tidak ada notifikasi baru saat ini.',
                                        [{ text: 'OK' }]
                                    )
                                }}
                                activeOpacity={0.7}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    backgroundColor: colors.glass,
                                    borderWidth: 1,
                                    borderColor: colors.glassBorder,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Bell color={colors.text} size={20} />
                                {history.length > 0 && (
                                    <View style={{
                                        position: 'absolute',
                                        top: 6,
                                        right: 6,
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: colors.danger,
                                    }} />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Member Info */}
                        <View style={{
                            backgroundColor: colors.glass,
                            borderRadius: borderRadius.lg,
                            padding: spacing.md,
                            marginTop: spacing.lg,
                            borderWidth: 1,
                            borderColor: colors.glassBorder,
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                                <Text style={{ color: colors.muted, fontSize: 13 }}>• Status Anggota</Text>
                                <View style={{ backgroundColor: colors.successBg, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm }}>
                                    <Text style={{ color: colors.success, fontSize: 12, fontWeight: '600' }}>Aktif</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: colors.muted, fontSize: 11 }}>NPM</Text>
                                    <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }}>{npm}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: colors.muted, fontSize: 11 }}>Divisi</Text>
                                    <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }}>{division}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: spacing.sm }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: colors.muted, fontSize: 11 }}>Jabatan</Text>
                                    <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }}>{position}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: colors.muted, fontSize: 11 }}>Kehadiran</Text>
                                    <Text style={{ color: colors.success, fontWeight: '700', fontSize: 14 }}>{presence}</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Quick Actions */}
                <View style={{ marginBottom: spacing.lg }}>
                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: spacing.md }}>Akses Cepat</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs }}>
                        {quickActions.map((action) => {
                            const Icon = action.icon
                            return (
                                <TouchableOpacity
                                    key={action.key}
                                    onPress={() => onNavigate(action.key)}
                                    style={{ width: '50%', padding: spacing.xs }}
                                    activeOpacity={0.7}
                                >
                                    <View style={{
                                        backgroundColor: colors.glass,
                                        borderRadius: borderRadius.lg,
                                        padding: spacing.md,
                                        borderWidth: 1,
                                        borderColor: colors.glassBorder,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <LinearGradient
                                            colors={action.gradient}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 12,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginRight: spacing.sm,
                                            }}
                                        >
                                            <Icon color="#ffffff" size={20} />
                                        </LinearGradient>
                                        <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', flex: 1 }}>{action.label}</Text>
                                        <ChevronRight color={colors.muted} size={16} />
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>

                {/* Today's Agenda */}
                <View style={{
                    backgroundColor: colors.glass,
                    borderRadius: borderRadius.xl,
                    padding: spacing.lg,
                    marginBottom: spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.glassBorder,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Calendar color={colors.primary} size={18} />
                            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginLeft: spacing.sm }}>Agenda Hari Ini</Text>
                        </View>
                        <TouchableOpacity onPress={() => onNavigate('attendance')}>
                            <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>Lihat Semua</Text>
                        </TouchableOpacity>
                    </View>

                    {todayEvents.length === 0 ? (
                        <View style={{ paddingVertical: spacing.lg, alignItems: 'center' }}>
                            <Calendar color={colors.muted} size={32} />
                            <Text style={{ color: colors.muted, fontSize: 13, marginTop: spacing.sm }}>Tidak ada agenda hari ini</Text>
                        </View>
                    ) : (
                        todayEvents.slice(0, 2).map((item) => (
                            <View
                                key={String(item.id)}
                                style={{
                                    backgroundColor: colors.surface,
                                    borderRadius: borderRadius.lg,
                                    padding: spacing.md,
                                    marginBottom: spacing.sm,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}
                            >
                                {/* Division Badge */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                                    <View style={{
                                        backgroundColor: colors.infoBg,
                                        paddingHorizontal: spacing.sm,
                                        paddingVertical: 3,
                                        borderRadius: borderRadius.sm,
                                    }}>
                                        <Text style={{ color: colors.info, fontSize: 11, fontWeight: '600' }}>{item.division || 'Umum'}</Text>
                                    </View>
                                </View>

                                {/* Title */}
                                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15, marginBottom: spacing.sm }}>{item.title}</Text>

                                {/* Time & Location Row */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                    <Clock color={colors.muted} size={14} />
                                    <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 6, flex: 1 }}>
                                        {item.time_range || (item.date ? new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-')}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Users color={colors.muted} size={14} />
                                        <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 4 }}>{item.attendees || 0} peserta</Text>
                                    </View>
                                </View>

                                {/* Location Row */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MapPin color={colors.muted} size={14} />
                                    <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 6 }}>{item.location || 'Lokasi belum ditentukan'}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* Recent Activity */}
                <View style={{
                    backgroundColor: colors.glass,
                    borderRadius: borderRadius.xl,
                    padding: spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.glassBorder,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Bell color={colors.accent} size={18} />
                            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginLeft: spacing.sm }}>Aktivitas Terbaru</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>Tandai Dibaca</Text>
                        </TouchableOpacity>
                    </View>

                    {history.length === 0 ? (
                        <View style={{ paddingVertical: spacing.lg, alignItems: 'center' }}>
                            <Bell color={colors.muted} size={32} />
                            <Text style={{ color: colors.muted, fontSize: 13, marginTop: spacing.sm }}>Belum ada aktivitas terbaru</Text>
                        </View>
                    ) : (
                        history.slice(0, 3).map((h) => (
                            <View
                                key={String(h.id)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.surface,
                                    borderRadius: borderRadius.lg,
                                    padding: spacing.md,
                                    marginBottom: spacing.sm,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}
                            >
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    backgroundColor: colors.successBg,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: spacing.md,
                                }}>
                                    <CheckCircle2 color={colors.success} size={20} />
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
