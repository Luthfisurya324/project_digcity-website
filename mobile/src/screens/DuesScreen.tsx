import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    StatusBar,
    RefreshControl,
    ActivityIndicator,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
    Wallet,
    CheckCircle2,
    AlertCircle,
    Clock,
    Calendar,
    CreditCard,
} from 'lucide-react-native'
import { useTheme, spacing, borderRadius, shadows } from '../ui/theme'
import { supabase } from '../lib/supabase'

interface DuesScreenProps {
    userEmail: string
    member: any
}

interface DueItem {
    id: string
    period: string
    amount: number
    paid_amount: number
    status: 'unpaid' | 'partial' | 'paid'
    due_date: string
    paid_date?: string
}

export default function DuesScreen({ userEmail, member }: DuesScreenProps) {
    const { colors, gradients, mode } = useTheme()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [dues, setDues] = useState<DueItem[]>([])
    const [summary, setSummary] = useState({ total: 0, paid: 0, pending: 0 })

    const loadDues = async () => {
        if (!member?.id && !member?.full_name) return
        try {
            // Try to load by member_id first
            let data: any[] = []

            if (member.id) {
                const { data: byId } = await supabase
                    .from('member_dues')
                    .select('*')
                    .eq('member_id', member.id)
                    .order('due_date', { ascending: false })
                data = byId || []
            }

            // If no data by member_id, try by member_name
            if (data.length === 0 && member.full_name) {
                const { data: byName } = await supabase
                    .from('member_dues')
                    .select('*')
                    .eq('member_name', member.full_name)
                    .order('due_date', { ascending: false })
                data = byName || []
            }

            if (data.length > 0) {
                const mapped = data.map((item: any) => ({
                    id: item.id,
                    period: item.notes || `${new Date(item.due_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`,
                    amount: item.amount || 0,
                    paid_amount: item.status === 'paid' ? (item.amount || 0) : (item.status === 'partial' ? (item.amount / 2) : 0),
                    status: item.status || 'unpaid',
                    due_date: item.due_date,
                    paid_date: item.status === 'paid' ? item.due_date : undefined,
                }))
                setDues(mapped)

                const total = mapped.reduce((sum, d) => sum + d.amount, 0)
                const paid = mapped.reduce((sum, d) => sum + d.paid_amount, 0)
                setSummary({ total, paid, pending: total - paid })
            }
        } catch (error) {
            console.log('Dues load error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDues()
    }, [member?.id, member?.full_name])

    const onRefresh = async () => {
        setRefreshing(true)
        await loadDues()
        setRefreshing(false)
    }

    const getStatusConfig = (status: DueItem['status']) => {
        switch (status) {
            case 'paid':
                return { label: 'Lunas', color: colors.success, bg: colors.successBg, icon: CheckCircle2 }
            case 'partial':
                return { label: 'Cicilan', color: colors.warning, bg: colors.warningBg, icon: Clock }
            case 'unpaid':
                return { label: 'Belum Bayar', color: colors.danger, bg: colors.dangerBg, icon: AlertCircle }
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
    }

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
                    <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>Iuran Saya</Text>
                    <Text style={{ color: colors.muted, fontSize: 14, marginTop: 4 }}>
                        Status pembayaran iuran anggota
                    </Text>
                </View>

                {/* Summary Card */}
                <View style={{
                    borderRadius: borderRadius.xl,
                    overflow: 'hidden',
                    marginBottom: spacing.lg,
                    ...shadows.lg,
                }}>
                    <LinearGradient
                        colors={['#f59e0b', '#d97706']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ padding: spacing.lg }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                            <View style={{
                                width: 48,
                                height: 48,
                                borderRadius: 14,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: spacing.md,
                            }}>
                                <Wallet color="#ffffff" size={24} />
                            </View>
                            <View>
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Total Iuran</Text>
                                <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700' }}>
                                    {formatCurrency(summary.total)}
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{
                                flex: 1,
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: borderRadius.md,
                                padding: spacing.sm,
                                marginRight: spacing.sm,
                            }}>
                                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Sudah Bayar</Text>
                                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                                    {formatCurrency(summary.paid)}
                                </Text>
                            </View>
                            <View style={{
                                flex: 1,
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: borderRadius.md,
                                padding: spacing.sm,
                            }}>
                                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Sisa Tagihan</Text>
                                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                                    {formatCurrency(summary.pending)}
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Payment History */}
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: spacing.md }}>
                    Riwayat Iuran
                </Text>

                {dues.length === 0 ? (
                    <View style={{
                        backgroundColor: colors.glass,
                        borderRadius: borderRadius.lg,
                        padding: spacing.xl,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: colors.glassBorder,
                    }}>
                        <CreditCard color={colors.muted} size={48} />
                        <Text style={{ color: colors.muted, fontSize: 14, marginTop: spacing.md }}>
                            Belum ada data iuran
                        </Text>
                    </View>
                ) : (
                    dues.map((due) => {
                        const statusConfig = getStatusConfig(due.status)
                        const StatusIcon = statusConfig.icon
                        const dueDate = new Date(due.due_date)

                        return (
                            <View
                                key={due.id}
                                style={{
                                    backgroundColor: colors.glass,
                                    borderRadius: borderRadius.lg,
                                    padding: spacing.md,
                                    marginBottom: spacing.sm,
                                    borderWidth: 1,
                                    borderColor: colors.glassBorder,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 12,
                                            backgroundColor: statusConfig.bg,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: spacing.sm,
                                        }}>
                                            <StatusIcon color={statusConfig.color} size={20} />
                                        </View>
                                        <View>
                                            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                                                {due.period}
                                            </Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                                <Calendar color={colors.muted} size={12} />
                                                <Text style={{ color: colors.muted, fontSize: 11, marginLeft: 4 }}>
                                                    Jatuh tempo: {dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{
                                        backgroundColor: statusConfig.bg,
                                        paddingHorizontal: spacing.sm,
                                        paddingVertical: 4,
                                        borderRadius: borderRadius.sm,
                                    }}>
                                        <Text style={{ color: statusConfig.color, fontSize: 11, fontWeight: '600' }}>
                                            {statusConfig.label}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border }}>
                                    <View>
                                        <Text style={{ color: colors.muted, fontSize: 11 }}>Nominal</Text>
                                        <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                                            {formatCurrency(due.amount)}
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ color: colors.muted, fontSize: 11 }}>Terbayar</Text>
                                        <Text style={{ color: colors.success, fontSize: 14, fontWeight: '600' }}>
                                            {formatCurrency(due.paid_amount)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                )}
            </View>
        </ScrollView>
    )
}
