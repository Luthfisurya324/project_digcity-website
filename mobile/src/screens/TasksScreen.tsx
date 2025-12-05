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
    Briefcase,
    Calendar,
    MapPin,
    Users,
    Clock,
    CheckCircle2,
    Circle,
    ChevronRight,
} from 'lucide-react-native'
import { colors, gradients, spacing, borderRadius, shadows } from '../ui/theme'
import { supabase } from '../lib/supabase'

interface TasksScreenProps {
    userEmail: string
    member: any
}

interface WorkProgram {
    id: string
    title: string
    division: string
    date: string
    location: string
    status: 'upcoming' | 'ongoing' | 'completed'
    description?: string
}

export default function TasksScreen({ userEmail, member }: TasksScreenProps) {
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [programs, setPrograms] = useState<WorkProgram[]>([])
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all')

    const loadPrograms = async () => {
        try {
            // Load work programs (proker) from internal_events
            const { data } = await supabase
                .from('internal_events')
                .select('*')
                .order('date', { ascending: true })

            if (data) {
                const mapped = data.map((item: any) => {
                    const eventDate = new Date(item.date)
                    const now = new Date()
                    let status: WorkProgram['status'] = 'upcoming'
                    if (eventDate < now) {
                        status = 'completed'
                    } else if (eventDate.toDateString() === now.toDateString()) {
                        status = 'ongoing'
                    }

                    return {
                        id: item.id,
                        title: item.title,
                        division: item.division || 'Umum',
                        date: item.date,
                        location: item.location || '-',
                        status,
                        description: item.description,
                    }
                })
                setPrograms(mapped)
            }
        } catch (error) {
            console.log('Tasks load error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPrograms()
    }, [])

    const onRefresh = async () => {
        setRefreshing(true)
        await loadPrograms()
        setRefreshing(false)
    }

    const getStatusConfig = (status: WorkProgram['status']) => {
        switch (status) {
            case 'upcoming':
                return { label: 'Akan Datang', color: colors.info, bg: colors.infoBg, icon: Clock }
            case 'ongoing':
                return { label: 'Sedang Berlangsung', color: colors.warning, bg: colors.warningBg, icon: Circle }
            case 'completed':
                return { label: 'Selesai', color: colors.success, bg: colors.successBg, icon: CheckCircle2 }
        }
    }

    const filteredPrograms = filter === 'all'
        ? programs
        : programs.filter(p => p.status === filter)

    const filterOptions = [
        { key: 'all' as const, label: 'Semua' },
        { key: 'upcoming' as const, label: 'Akan Datang' },
        { key: 'ongoing' as const, label: 'Berlangsung' },
        { key: 'completed' as const, label: 'Selesai' },
    ]

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
                <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>Program Kerja</Text>
                <Text style={{ color: colors.muted, fontSize: 14, marginTop: 4 }}>
                    Kegiatan dan tugas organisasi
                </Text>

                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: spacing.md }}
                    contentContainerStyle={{ paddingVertical: spacing.xs }}
                >
                    {filterOptions.map((opt) => (
                        <TouchableOpacity
                            key={opt.key}
                            onPress={() => setFilter(opt.key)}
                            style={{
                                paddingHorizontal: spacing.md,
                                paddingVertical: spacing.sm,
                                borderRadius: borderRadius.full,
                                backgroundColor: filter === opt.key ? colors.primary : colors.glass,
                                marginRight: spacing.sm,
                                borderWidth: 1,
                                borderColor: filter === opt.key ? colors.primary : colors.glassBorder,
                            }}
                        >
                            <Text style={{
                                color: filter === opt.key ? colors.text : colors.muted,
                                fontSize: 13,
                                fontWeight: '600',
                            }}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Programs List */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {filteredPrograms.length === 0 ? (
                    <View style={{ alignItems: 'center', paddingVertical: spacing.xxl }}>
                        <Briefcase color={colors.muted} size={48} />
                        <Text style={{ color: colors.muted, fontSize: 14, marginTop: spacing.md }}>
                            Tidak ada program kerja
                        </Text>
                    </View>
                ) : (
                    filteredPrograms.map((program) => {
                        const statusConfig = getStatusConfig(program.status)
                        const StatusIcon = statusConfig.icon
                        const eventDate = new Date(program.date)

                        return (
                            <View
                                key={program.id}
                                style={{
                                    backgroundColor: colors.glass,
                                    borderRadius: borderRadius.lg,
                                    padding: spacing.md,
                                    marginBottom: spacing.md,
                                    borderWidth: 1,
                                    borderColor: colors.glassBorder,
                                }}
                            >
                                {/* Status & Division */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{
                                            backgroundColor: colors.infoBg,
                                            paddingHorizontal: spacing.sm,
                                            paddingVertical: 2,
                                            borderRadius: borderRadius.sm,
                                            marginRight: spacing.sm,
                                        }}>
                                            <Text style={{ color: colors.info, fontSize: 11, fontWeight: '600' }}>
                                                {program.division}
                                            </Text>
                                        </View>
                                        <View style={{
                                            backgroundColor: statusConfig.bg,
                                            paddingHorizontal: spacing.sm,
                                            paddingVertical: 2,
                                            borderRadius: borderRadius.sm,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                            <StatusIcon color={statusConfig.color} size={10} />
                                            <Text style={{ color: statusConfig.color, fontSize: 11, fontWeight: '600', marginLeft: 4 }}>
                                                {statusConfig.label}
                                            </Text>
                                        </View>
                                    </View>
                                    <ChevronRight color={colors.muted} size={16} />
                                </View>

                                {/* Title */}
                                <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600', marginBottom: spacing.sm }}>
                                    {program.title}
                                </Text>

                                {/* Details */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Calendar color={colors.muted} size={14} />
                                    <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 6 }}>
                                        {eventDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MapPin color={colors.muted} size={14} />
                                    <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 6 }}>
                                        {program.location}
                                    </Text>
                                </View>
                            </View>
                        )
                    })
                )}
            </ScrollView>
        </View>
    )
}
