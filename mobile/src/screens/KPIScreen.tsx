import React, { useEffect, useState, useRef } from 'react'
import {
    View,
    Text,
    ScrollView,
    StatusBar,
    RefreshControl,
    ActivityIndicator,
    Animated,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
    BarChart3,
    TrendingUp,
    Users,
    Briefcase,
    Heart,
    Sparkles,
    Award,
} from 'lucide-react-native'
import { useTheme, spacing, borderRadius, shadows, animation } from '../ui/theme'
import { supabase } from '../lib/supabase'

// Animated Progress Bar Component
function AnimatedProgressBar({ percentage, color, delay = 0 }: { percentage: number; color: string; delay?: number }) {
    const animatedWidth = useRef(new Animated.Value(0)).current
    const { colors } = useTheme()

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animatedWidth, {
                toValue: percentage,
                duration: 800,
                useNativeDriver: false,
            }),
        ]).start()
    }, [percentage])

    const width = animatedWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    })

    return (
        <View style={{
            height: 8,
            backgroundColor: colors.border,
            borderRadius: 4,
            overflow: 'hidden',
        }}>
            <Animated.View style={{
                width: width,
                height: '100%',
                backgroundColor: color,
                borderRadius: 4,
            }} />
        </View>
    )
}

interface KPIScreenProps {
    userEmail: string
    member: any
    onBack?: () => void
}

interface KPIData {
    kehadiran_score: number
    proyek_score: number
    sikap_score: number
    skill_score: number
    total_score: number
    grade: string
}

export default function KPIScreen({ userEmail, member }: KPIScreenProps) {
    const { colors, gradients, mode } = useTheme()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [kpiData, setKpiData] = useState<KPIData | null>(null)

    const loadKPI = async () => {
        if (!member?.id) {
            setLoading(false)
            return
        }
        try {
            // Try to get latest KPI for this member
            const { data, error } = await supabase
                .from('member_kpi')
                .select('*')
                .eq('member_id', member.id)
                .order('period', { ascending: false })
                .limit(1)
                .single()

            if (data && !error) {
                setKpiData({
                    kehadiran_score: data.attendance_score || 0,
                    proyek_score: data.project_score || 0,
                    sikap_score: data.attitude_score || 0,
                    skill_score: data.skill_score || 0,
                    total_score: data.final_score || 0,
                    grade: data.grade || '-',
                })
            } else {
                // No KPI data found - show empty state
                setKpiData(null)
            }
        } catch (error) {
            console.log('KPI load error:', error)
            setKpiData(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadKPI()
    }, [member?.id])

    const onRefresh = async () => {
        setRefreshing(true)
        await loadKPI()
        setRefreshing(false)
    }

    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return colors.success
        if (grade.startsWith('B')) return colors.info
        if (grade.startsWith('C')) return colors.warning
        return colors.danger
    }

    const categories = [
        { key: 'kehadiran', label: 'Kehadiran', weight: '20%', icon: Users, color: colors.info },
        { key: 'proyek', label: 'Proyek', weight: '40%', icon: Briefcase, color: colors.primary },
        { key: 'sikap', label: 'Sikap', weight: '25%', icon: Heart, color: colors.danger },
        { key: 'skill', label: 'Skill', weight: '15%', icon: Sparkles, color: colors.accent },
    ]

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
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.bg }}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
        >
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>

                {/* Header */}
                <View style={{ marginBottom: spacing.lg }}>
                    <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>KPI Saya</Text>
                    <Text style={{ color: colors.muted, fontSize: 14, marginTop: 4 }}>
                        Performa dan pencapaian Anda
                    </Text>
                </View>

                {/* Empty State if no KPI data */}
                {!kpiData && (
                    <View style={{
                        backgroundColor: colors.glass,
                        borderRadius: borderRadius.xl,
                        padding: spacing.xl,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: colors.glassBorder,
                    }}>
                        <BarChart3 color={colors.muted} size={48} />
                        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginTop: spacing.md, textAlign: 'center' }}>
                            Data KPI Belum Tersedia
                        </Text>
                        <Text style={{ color: colors.muted, fontSize: 13, marginTop: spacing.xs, textAlign: 'center', lineHeight: 20 }}>
                            Penilaian KPI Anda akan muncul di sini setelah administrator melakukan evaluasi.
                        </Text>
                    </View>
                )}

                {kpiData && (
                    <>

                        {/* Main Score Card */}
                        <View style={{
                            borderRadius: borderRadius.xl,
                            overflow: 'hidden',
                            marginBottom: spacing.lg,
                            ...shadows.lg,
                        }}>
                            <LinearGradient
                                colors={gradients.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{ padding: spacing.xl, alignItems: 'center' }}
                            >
                                {/* Grade Badge */}
                                <View style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 50,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: spacing.md,
                                }}>
                                    <View style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 40,
                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{ color: '#ffffff', fontSize: 36, fontWeight: '700' }}>
                                            {kpiData?.grade || '-'}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                                    Nilai Total
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 32, fontWeight: '700' }}>
                                    {kpiData?.total_score?.toFixed(1) || '0.0'}
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>
                                    dari 100 poin
                                </Text>
                            </LinearGradient>
                        </View>

                        {/* Category Breakdown */}
                        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: spacing.md }}>
                            Breakdown Nilai
                        </Text>

                        {categories.map((cat, index) => {
                            const Icon = cat.icon
                            const score = kpiData ? (kpiData as any)[`${cat.key}_score`] || 0 : 0
                            const percentage = Math.min(100, score)

                            return (
                                <View
                                    key={cat.key}
                                    style={{
                                        backgroundColor: colors.glass,
                                        borderRadius: borderRadius.lg,
                                        padding: spacing.md,
                                        marginBottom: spacing.sm,
                                        borderWidth: 1,
                                        borderColor: colors.glassBorder,
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                                        <View style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 10,
                                            backgroundColor: `${cat.color}20`,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: spacing.sm,
                                        }}>
                                            <Icon color={cat.color} size={18} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                                                {cat.label}
                                            </Text>
                                            <Text style={{ color: colors.muted, fontSize: 11 }}>
                                                Bobot: {cat.weight}
                                            </Text>
                                        </View>
                                        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>
                                            {score.toFixed(1)}
                                        </Text>
                                    </View>

                                    {/* Animated Progress Bar */}
                                    <AnimatedProgressBar
                                        percentage={percentage}
                                        color={cat.color}
                                        delay={index * 100}
                                    />
                                </View>
                            )
                        })}

                        {/* Info Card */}
                        <View style={{
                            backgroundColor: colors.infoBg,
                            borderRadius: borderRadius.lg,
                            padding: spacing.md,
                            marginTop: spacing.md,
                            borderWidth: 1,
                            borderColor: colors.info,
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                        }}>
                            <Award color={colors.info} size={20} style={{ marginRight: spacing.sm, marginTop: 2 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: colors.info, fontSize: 13, fontWeight: '600' }}>
                                    Tips Meningkatkan KPI
                                </Text>
                                <Text style={{ color: colors.info, fontSize: 12, marginTop: 4, lineHeight: 18 }}>
                                    Tingkatkan kehadiran di kegiatan, selesaikan tugas proker tepat waktu, dan aktif berkontribusi dalam organisasi.
                                </Text>
                            </View>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    )
}
