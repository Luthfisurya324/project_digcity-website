import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    StatusBar,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
    Trophy,
    Medal,
    Crown,
    Star,
    TrendingUp,
    Users,
    Filter,
} from 'lucide-react-native'
import { useTheme, spacing, borderRadius, shadows } from '../ui/theme'
import { supabase } from '../lib/supabase'

interface LeaderboardScreenProps {
    userEmail: string
    member: any
}

interface LeaderboardItem {
    id: string
    name: string
    division: string
    attendanceCount: number
    rank: number
}

export default function LeaderboardScreen({ userEmail, member }: LeaderboardScreenProps) {
    const { colors, gradients, mode } = useTheme()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([])
    const [myRank, setMyRank] = useState<number | null>(null)
    const [filter, setFilter] = useState<'all' | string>('all')
    const [divisions, setDivisions] = useState<string[]>([])

    const loadLeaderboard = async () => {
        try {
            const { data: members } = await supabase
                .from('organization_members')
                .select('id, full_name, division')
                .eq('status', 'active')

            const { data: attendance } = await supabase
                .from('attendance')
                .select('member_id')

            if (members && attendance) {
                const counts: Record<string, number> = {}
                attendance.forEach((a: any) => {
                    if (a.member_id) {
                        counts[a.member_id] = (counts[a.member_id] || 0) + 1
                    }
                })

                const lb = members.map((m: any) => ({
                    id: m.id,
                    name: m.full_name,
                    division: m.division || 'Umum',
                    attendanceCount: counts[m.id] || 0,
                    rank: 0,
                }))

                lb.sort((a, b) => b.attendanceCount - a.attendanceCount)
                lb.forEach((item, index) => { item.rank = index + 1 })

                setLeaderboard(lb)

                if (member?.id) {
                    const userItem = lb.find(item => item.id === member.id)
                    setMyRank(userItem?.rank || null)
                }

                const divs = [...new Set(members.map((m: any) => m.division || 'Umum'))]
                setDivisions(divs)
            }
        } catch (error) {
            console.log('Leaderboard load error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadLeaderboard()
    }, [member?.id])

    const onRefresh = async () => {
        setRefreshing(true)
        await loadLeaderboard()
        setRefreshing(false)
    }

    const getRankIcon = (rank: number) => {
        if (rank === 1) return { icon: Crown, color: '#fbbf24', bg: '#fef3c7' }
        if (rank === 2) return { icon: Medal, color: '#9ca3af', bg: '#f3f4f6' }
        if (rank === 3) return { icon: Medal, color: '#d97706', bg: '#fef3c7' }
        return { icon: Star, color: colors.muted, bg: colors.glass }
    }

    const filteredLeaderboard = filter === 'all'
        ? leaderboard
        : leaderboard.filter(item => item.division === filter)

    const isDark = mode === 'dark'

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>Leaderboard</Text>
                        <Text style={{ color: colors.muted, fontSize: 14, marginTop: 4 }}>
                            Peringkat kehadiran anggota
                        </Text>
                    </View>
                    {myRank && (
                        <View style={{
                            backgroundColor: colors.primaryLight + '20',
                            paddingHorizontal: spacing.md,
                            paddingVertical: spacing.sm,
                            borderRadius: borderRadius.md,
                            borderWidth: 1,
                            borderColor: colors.primary,
                        }}>
                            <Text style={{ color: colors.muted, fontSize: 10 }}>Peringkat Anda</Text>
                            <Text style={{ color: colors.primary, fontSize: 20, fontWeight: '700', textAlign: 'center' }}>
                                #{myRank}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: spacing.md }}
                    contentContainerStyle={{ paddingVertical: spacing.xs }}
                >
                    <TouchableOpacity
                        onPress={() => setFilter('all')}
                        style={{
                            paddingHorizontal: spacing.md,
                            paddingVertical: spacing.sm,
                            borderRadius: borderRadius.full,
                            backgroundColor: filter === 'all' ? colors.primary : colors.glass,
                            marginRight: spacing.sm,
                            borderWidth: 1,
                            borderColor: filter === 'all' ? colors.primary : colors.glassBorder,
                        }}
                    >
                        <Text style={{
                            color: filter === 'all' ? '#ffffff' : colors.muted,
                            fontSize: 13,
                            fontWeight: '600',
                        }}>
                            Semua
                        </Text>
                    </TouchableOpacity>
                    {divisions.map((div) => (
                        <TouchableOpacity
                            key={div}
                            onPress={() => setFilter(div)}
                            style={{
                                paddingHorizontal: spacing.md,
                                paddingVertical: spacing.sm,
                                borderRadius: borderRadius.full,
                                backgroundColor: filter === div ? colors.primary : colors.glass,
                                marginRight: spacing.sm,
                                borderWidth: 1,
                                borderColor: filter === div ? colors.primary : colors.glassBorder,
                            }}
                        >
                            <Text style={{
                                color: filter === div ? '#ffffff' : colors.muted,
                                fontSize: 13,
                                fontWeight: '600',
                            }}>
                                {div}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Leaderboard List */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {/* Top 3 Podium */}
                {filteredLeaderboard.length >= 3 && (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.lg }}>
                        {[1, 0, 2].map((idx) => {
                            const item = filteredLeaderboard[idx]
                            if (!item) return null
                            const isFirst = idx === 0
                            const rankConfig = getRankIcon(item.rank)
                            const RankIcon = rankConfig.icon

                            return (
                                <View
                                    key={item.id}
                                    style={{
                                        alignItems: 'center',
                                        marginHorizontal: spacing.xs,
                                        marginTop: isFirst ? 0 : spacing.lg,
                                    }}
                                >
                                    <View style={{
                                        width: isFirst ? 72 : 60,
                                        height: isFirst ? 72 : 60,
                                        borderRadius: isFirst ? 24 : 20,
                                        backgroundColor: colors.glass,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 2,
                                        borderColor: rankConfig.color,
                                        marginBottom: spacing.xs,
                                    }}>
                                        <Text style={{ color: colors.text, fontSize: isFirst ? 24 : 20, fontWeight: '700' }}>
                                            {item.name.slice(0, 1)}
                                        </Text>
                                    </View>
                                    <View style={{
                                        position: 'absolute',
                                        top: isFirst ? -8 : spacing.lg - 8,
                                        backgroundColor: rankConfig.bg,
                                        width: 24,
                                        height: 24,
                                        borderRadius: 12,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <RankIcon color={rankConfig.color} size={14} />
                                    </View>
                                    <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600', textAlign: 'center' }} numberOfLines={1}>
                                        {item.name.split(' ')[0]}
                                    </Text>
                                    <Text style={{ color: colors.accent, fontSize: 12, fontWeight: '700' }}>
                                        {item.attendanceCount}x
                                    </Text>
                                </View>
                            )
                        })}
                    </View>
                )}

                {/* Rest of leaderboard */}
                {filteredLeaderboard.slice(3).map((item) => {
                    const isCurrentUser = member?.id === item.id

                    return (
                        <View
                            key={item.id}
                            style={{
                                backgroundColor: isCurrentUser ? colors.primaryLight + '15' : colors.glass,
                                borderRadius: borderRadius.lg,
                                padding: spacing.md,
                                marginBottom: spacing.sm,
                                borderWidth: 1,
                                borderColor: isCurrentUser ? colors.primary : colors.glassBorder,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            {/* Rank */}
                            <View style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                backgroundColor: colors.surface,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: spacing.sm,
                            }}>
                                <Text style={{ color: colors.muted, fontSize: 14, fontWeight: '700' }}>
                                    {item.rank}
                                </Text>
                            </View>

                            {/* Name & Division */}
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                                    {item.name}
                                    {isCurrentUser && <Text style={{ color: colors.primary }}> (Anda)</Text>}
                                </Text>
                                <Text style={{ color: colors.muted, fontSize: 12 }}>{item.division}</Text>
                            </View>

                            {/* Attendance Count */}
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ color: colors.accent, fontSize: 16, fontWeight: '700' }}>
                                    {item.attendanceCount}
                                </Text>
                                <Text style={{ color: colors.muted, fontSize: 10 }}>kehadiran</Text>
                            </View>
                        </View>
                    )
                })}

                {filteredLeaderboard.length === 0 && (
                    <View style={{ alignItems: 'center', paddingVertical: spacing.xxl }}>
                        <Trophy color={colors.muted} size={48} />
                        <Text style={{ color: colors.muted, fontSize: 14, marginTop: spacing.md }}>
                            Belum ada data leaderboard
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}
