import React, { useState, useRef } from 'react'
import {
    View,
    Text,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Switch,
    Animated,
    Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
    Mail,
    Building2,
    Briefcase,
    LogOut,
    ChevronRight,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Sun,
    Moon,
    Palette,
    CreditCard,
    QrCode,
    RotateCcw,
    Star,
    Zap,
    Trophy,
    Award,
    TrendingUp,
} from 'lucide-react-native'
import { useTheme, spacing, borderRadius, shadows } from '../ui/theme'
import { supabase } from '../lib/supabase'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface ProfileScreenProps {
    userEmail: string
    member: any
    onLogout: () => void
}

export default function ProfileScreen({ userEmail, member, onLogout }: ProfileScreenProps) {
    const { mode, colors, gradients, toggleTheme } = useTheme()
    const [showPasswordSection, setShowPasswordSection] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [pwError, setPwError] = useState('')
    const [pwSuccess, setPwSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    // E-ID Card flip animation
    const [isCardFlipped, setIsCardFlipped] = useState(false)
    const flipAnimation = useRef(new Animated.Value(0)).current

    const handleCardFlip = () => {
        Animated.spring(flipAnimation, {
            toValue: isCardFlipped ? 0 : 1,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start()
        setIsCardFlipped(!isCardFlipped)
    }

    // Interpolate rotation values
    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    })
    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    })
    const frontOpacity = flipAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 0],
    })
    const backOpacity = flipAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    })

    const name = member?.full_name || 'Anggota DigCity'
    const npm = member?.npm || '-'
    const division = member?.division || '-'
    const position = member?.position || 'Anggota'
    const joinDate = member?.created_at ? new Date(member.created_at) : null

    const updatePassword = async () => {
        setPwError('')
        setPwSuccess('')

        if (!newPassword || newPassword.length < 8) {
            setPwError('Password minimal 8 karakter')
            return
        }
        if (newPassword !== confirmPassword) {
            setPwError('Konfirmasi password tidak cocok')
            return
        }

        setLoading(true)
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        setLoading(false)

        if (error) {
            setPwError(error.message || 'Gagal memperbarui password')
        } else {
            setPwSuccess('Password berhasil diperbarui')
            setNewPassword('')
            setConfirmPassword('')
            setShowPasswordSection(false)
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        onLogout()
    }

    const isDark = mode === 'dark'

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.bg }}
            contentContainerStyle={{ paddingBottom: 100 }}
        >
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>

                {/* Header */}
                <View style={{ marginBottom: spacing.lg }}>
                    <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>Profil Saya</Text>
                    <Text style={{ color: colors.muted, fontSize: 14, marginTop: 4 }}>
                        Kelola informasi akun Anda
                    </Text>
                </View>

                {/* E-ID Card - Digital Member Card with Flip Animation */}
                <View style={{ marginBottom: spacing.lg }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CreditCard color={colors.primary} size={18} />
                            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginLeft: spacing.sm }}>Kartu Anggota Digital</Text>
                        </View>
                        <TouchableOpacity onPress={handleCardFlip} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <RotateCcw color={colors.muted} size={14} />
                            <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 4 }}>Tap untuk balik</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity activeOpacity={0.95} onPress={handleCardFlip}>
                        <View style={{ height: 200, width: '100%' }}>
                            {/* Front Side */}
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
                                    opacity: frontOpacity,
                                }}
                            >
                                <LinearGradient
                                    colors={gradients.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        flex: 1,
                                        borderRadius: borderRadius.xl,
                                        padding: spacing.lg,
                                        ...shadows.lg,
                                    }}
                                >
                                    {/* Card Header */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md }}>
                                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '700', letterSpacing: 1 }}>
                                            DIGCITY
                                        </Text>
                                        <View style={{
                                            backgroundColor: 'rgba(16, 185, 129, 0.3)',
                                            paddingHorizontal: 10, paddingVertical: 4,
                                            borderRadius: 12,
                                        }}>
                                            <Text style={{ color: '#34d399', fontSize: 10, fontWeight: '700' }}>AKTIF</Text>
                                        </View>
                                    </View>

                                    {/* Member Info */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <View style={{
                                            width: 64, height: 64, borderRadius: 20,
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            justifyContent: 'center', alignItems: 'center',
                                            borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
                                            marginRight: spacing.md,
                                        }}>
                                            <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: '700' }}>
                                                {name.slice(0, 1).toUpperCase()}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700' }} numberOfLines={1}>
                                                {name}
                                            </Text>
                                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>
                                                {position}
                                            </Text>
                                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>
                                                {division}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* NPM at bottom */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <View>
                                            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 1 }}>NPM</Text>
                                            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600', letterSpacing: 2 }}>{npm}</Text>
                                        </View>
                                        <QrCode color="rgba(255,255,255,0.3)" size={32} />
                                    </View>
                                </LinearGradient>
                            </Animated.View>

                            {/* Back Side */}
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
                                    opacity: backOpacity,
                                }}
                            >
                                <LinearGradient
                                    colors={isDark ? ['#312e81', '#1e1b4b'] : ['#6366f1', '#4f46e5']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        flex: 1,
                                        borderRadius: borderRadius.xl,
                                        padding: spacing.lg,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        ...shadows.lg,
                                    }}
                                >
                                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: spacing.sm, letterSpacing: 2 }}>
                                        MEMBER ID
                                    </Text>
                                    <View style={{
                                        width: 120, height: 120,
                                        backgroundColor: 'rgba(255,255,255,0.95)',
                                        borderRadius: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: spacing.md,
                                    }}>
                                        <QrCode color="#312e81" size={80} />
                                    </View>
                                    <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700', letterSpacing: 3 }}>
                                        {npm}
                                    </Text>
                                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: spacing.xs }}>
                                        Scan untuk verifikasi
                                    </Text>
                                </LinearGradient>
                            </Animated.View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* XP & Level Section - Gamification */}
                <View style={{
                    backgroundColor: colors.glass,
                    borderRadius: borderRadius.xl,
                    padding: spacing.lg,
                    marginBottom: spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.glassBorder,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                        <Zap color={colors.warning} size={18} />
                        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginLeft: spacing.sm }}>
                            Level & Progress
                        </Text>
                    </View>

                    {/* Level Display */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg }}>
                        <LinearGradient
                            colors={isDark ? ['#f59e0b', '#d97706'] : ['#fbbf24', '#f59e0b']}
                            style={{
                                width: 60, height: 60, borderRadius: 16,
                                justifyContent: 'center', alignItems: 'center',
                                marginRight: spacing.md,
                            }}
                        >
                            <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '800' }}>3</Text>
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: '600' }}>LEVEL</Text>
                        </LinearGradient>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                <Star color={colors.warning} size={14} fill={colors.warning} />
                                <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600', marginLeft: 4 }}>
                                    Anggota Aktif
                                </Text>
                            </View>
                            <Text style={{ color: colors.muted, fontSize: 12 }}>
                                750 / 1000 XP menuju Level 4
                            </Text>
                            {/* XP Progress Bar */}
                            <View style={{
                                height: 6, backgroundColor: colors.border, borderRadius: 3,
                                marginTop: spacing.sm, overflow: 'hidden',
                            }}>
                                <LinearGradient
                                    colors={['#f59e0b', '#fbbf24']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{ width: '75%', height: '100%', borderRadius: 3 }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Badges */}
                    <View>
                        <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600', marginBottom: spacing.sm }}>
                            LENCANA YANG DIRAIH
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: spacing.sm }}>
                            <View style={{ alignItems: 'center' }}>
                                <View style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    backgroundColor: colors.successBg,
                                    justifyContent: 'center', alignItems: 'center',
                                    marginBottom: 4,
                                }}>
                                    <CheckCircle2 color={colors.success} size={22} />
                                </View>
                                <Text style={{ color: colors.muted, fontSize: 9, textAlign: 'center' }}>On Time</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <View style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    backgroundColor: colors.primaryBg,
                                    justifyContent: 'center', alignItems: 'center',
                                    marginBottom: 4,
                                }}>
                                    <TrendingUp color={colors.primary} size={22} />
                                </View>
                                <Text style={{ color: colors.muted, fontSize: 9, textAlign: 'center' }}>Top KPI</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <View style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    backgroundColor: colors.warningBg,
                                    justifyContent: 'center', alignItems: 'center',
                                    marginBottom: 4,
                                }}>
                                    <Trophy color={colors.warning} size={22} />
                                </View>
                                <Text style={{ color: colors.muted, fontSize: 9, textAlign: 'center' }}>Winner</Text>
                            </View>
                            <View style={{ alignItems: 'center', opacity: 0.4 }}>
                                <View style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    backgroundColor: colors.surface,
                                    justifyContent: 'center', alignItems: 'center',
                                    marginBottom: 4,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                    borderStyle: 'dashed',
                                }}>
                                    <Award color={colors.muted} size={22} />
                                </View>
                                <Text style={{ color: colors.muted, fontSize: 9, textAlign: 'center' }}>???</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Account Info Section */}
                <View style={{
                    backgroundColor: colors.glass,
                    borderRadius: borderRadius.xl,
                    padding: spacing.lg,
                    marginBottom: spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.glassBorder,
                }}>
                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: spacing.md }}>
                        Informasi Akun
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm }}>
                        <View style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            backgroundColor: colors.infoBg,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: spacing.sm,
                        }}>
                            <Mail color={colors.info} size={18} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.muted, fontSize: 11 }}>Email</Text>
                            <Text style={{ color: colors.text, fontSize: 14 }}>{userEmail || '-'}</Text>
                        </View>
                    </View>

                    {joinDate && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm }}>
                            <View style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                backgroundColor: colors.successBg,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: spacing.sm,
                            }}>
                                <Calendar color={colors.success} size={18} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: colors.muted, fontSize: 11 }}>Bergabung Sejak</Text>
                                <Text style={{ color: colors.text, fontSize: 14 }}>
                                    {joinDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Appearance Section - Theme Toggle */}
                <View style={{
                    backgroundColor: colors.glass,
                    borderRadius: borderRadius.xl,
                    padding: spacing.lg,
                    marginBottom: spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.glassBorder,
                }}>
                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: spacing.md }}>
                        Tampilan
                    </Text>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: spacing.sm,
                    }}>
                        <View style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            backgroundColor: isDark ? colors.accentLight + '20' : colors.warningBg,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: spacing.sm,
                        }}>
                            {isDark ? (
                                <Moon color={colors.accent} size={18} />
                            ) : (
                                <Sun color={colors.warning} size={18} />
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>
                                Mode {isDark ? 'Gelap' : 'Terang'}
                            </Text>
                            <Text style={{ color: colors.muted, fontSize: 11 }}>
                                {isDark ? 'Tema gelap untuk kenyamanan mata' : 'Tema terang untuk visibilitas lebih baik'}
                            </Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={isDark ? colors.accent : '#ffffff'}
                            ios_backgroundColor={colors.border}
                        />
                    </View>

                    {/* Theme Preview */}
                    <View style={{
                        flexDirection: 'row',
                        marginTop: spacing.md,
                        paddingTop: spacing.md,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                    }}>
                        <TouchableOpacity
                            onPress={() => toggleTheme()}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: spacing.sm,
                                borderRadius: borderRadius.md,
                                backgroundColor: !isDark ? colors.primary + '20' : 'transparent',
                                borderWidth: 1,
                                borderColor: !isDark ? colors.primary : colors.border,
                                marginRight: spacing.xs,
                            }}
                        >
                            <Sun color={!isDark ? colors.primary : colors.muted} size={16} />
                            <Text style={{
                                color: !isDark ? colors.primary : colors.muted,
                                fontSize: 12,
                                fontWeight: '600',
                                marginLeft: 6
                            }}>
                                Light
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => toggleTheme()}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: spacing.sm,
                                borderRadius: borderRadius.md,
                                backgroundColor: isDark ? colors.primary + '20' : 'transparent',
                                borderWidth: 1,
                                borderColor: isDark ? colors.primary : colors.border,
                                marginLeft: spacing.xs,
                            }}
                        >
                            <Moon color={isDark ? colors.primary : colors.muted} size={16} />
                            <Text style={{
                                color: isDark ? colors.primary : colors.muted,
                                fontSize: 12,
                                fontWeight: '600',
                                marginLeft: 6
                            }}>
                                Dark
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Security Section */}
                <View style={{
                    backgroundColor: colors.glass,
                    borderRadius: borderRadius.xl,
                    padding: spacing.lg,
                    marginBottom: spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.glassBorder,
                }}>
                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: spacing.md }}>
                        Keamanan
                    </Text>

                    <TouchableOpacity
                        onPress={() => setShowPasswordSection(!showPasswordSection)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: spacing.sm,
                        }}
                    >
                        <View style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            backgroundColor: colors.warningBg,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: spacing.sm,
                        }}>
                            <Lock color={colors.warning} size={18} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>Ganti Password</Text>
                            <Text style={{ color: colors.muted, fontSize: 11 }}>Perbarui password akun Anda</Text>
                        </View>
                        <ChevronRight
                            color={colors.muted}
                            size={18}
                            style={{ transform: [{ rotate: showPasswordSection ? '90deg' : '0deg' }] }}
                        />
                    </TouchableOpacity>

                    {showPasswordSection && (
                        <View style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }}>
                            {pwError ? (
                                <View style={{
                                    backgroundColor: colors.dangerBg,
                                    padding: spacing.sm,
                                    borderRadius: borderRadius.sm,
                                    marginBottom: spacing.sm,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <AlertCircle color={colors.danger} size={16} style={{ marginRight: spacing.xs }} />
                                    <Text style={{ color: colors.danger, fontSize: 12 }}>{pwError}</Text>
                                </View>
                            ) : null}
                            {pwSuccess ? (
                                <View style={{
                                    backgroundColor: colors.successBg,
                                    padding: spacing.sm,
                                    borderRadius: borderRadius.sm,
                                    marginBottom: spacing.sm,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <CheckCircle2 color={colors.success} size={16} style={{ marginRight: spacing.xs }} />
                                    <Text style={{ color: colors.success, fontSize: 12 }}>{pwSuccess}</Text>
                                </View>
                            ) : null}

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: colors.surface,
                                borderRadius: borderRadius.md,
                                borderWidth: 1,
                                borderColor: colors.border,
                                paddingHorizontal: spacing.md,
                                paddingVertical: spacing.sm,
                                marginBottom: spacing.sm,
                            }}>
                                <TextInput
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    placeholder="Password baru"
                                    placeholderTextColor={colors.muted}
                                    secureTextEntry={!showNewPassword}
                                    style={{ flex: 1, color: colors.text, fontSize: 14 }}
                                />
                                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                                    {showNewPassword ? <EyeOff color={colors.muted} size={18} /> : <Eye color={colors.muted} size={18} />}
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: colors.surface,
                                borderRadius: borderRadius.md,
                                borderWidth: 1,
                                borderColor: colors.border,
                                paddingHorizontal: spacing.md,
                                paddingVertical: spacing.sm,
                                marginBottom: spacing.md,
                            }}>
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Konfirmasi password"
                                    placeholderTextColor={colors.muted}
                                    secureTextEntry={!showConfirmPassword}
                                    style={{ flex: 1, color: colors.text, fontSize: 14 }}
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff color={colors.muted} size={18} /> : <Eye color={colors.muted} size={18} />}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                onPress={updatePassword}
                                disabled={loading}
                                style={{ opacity: loading ? 0.7 : 1 }}
                            >
                                <LinearGradient
                                    colors={gradients.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        paddingVertical: 12,
                                        borderRadius: borderRadius.md,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '600' }}>
                                        {loading ? 'Menyimpan...' : 'Simpan Password'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    onPress={signOut}
                    style={{
                        backgroundColor: colors.dangerBg,
                        borderRadius: borderRadius.lg,
                        padding: spacing.md,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: colors.danger,
                    }}
                >
                    <LogOut color={colors.danger} size={18} style={{ marginRight: spacing.sm }} />
                    <Text style={{ color: colors.danger, fontSize: 15, fontWeight: '600' }}>
                        Keluar
                    </Text>
                </TouchableOpacity>

                {/* Version */}
                <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
                    <Text style={{ color: colors.muted, fontSize: 11 }}>DigCity Mobile v0.1.0</Text>
                    <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>© 2024 DigCity</Text>
                </View>
            </View>
        </ScrollView>
    )
}
