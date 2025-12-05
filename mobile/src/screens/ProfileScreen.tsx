import React, { useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Switch,
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
} from 'lucide-react-native'
import { useTheme, spacing, borderRadius, shadows } from '../ui/theme'
import { supabase } from '../lib/supabase'

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

                {/* Member Card */}
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
                        style={{ padding: spacing.lg }}
                    >
                        {/* Profile Photo & Basic Info */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg }}>
                            <View style={{
                                width: 72,
                                height: 72,
                                borderRadius: 24,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: spacing.md,
                                borderWidth: 2,
                                borderColor: 'rgba(255,255,255,0.3)',
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
                                    NPM: {npm}
                                </Text>
                                <View style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    paddingHorizontal: spacing.sm,
                                    paddingVertical: 2,
                                    borderRadius: borderRadius.sm,
                                    alignSelf: 'flex-start',
                                    marginTop: 6,
                                }}>
                                    <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '600' }}>
                                        • Aktif
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Stats Row */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{
                                flex: 1,
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: borderRadius.md,
                                padding: spacing.sm,
                                marginRight: spacing.sm,
                                alignItems: 'center',
                            }}>
                                <Building2 color="rgba(255,255,255,0.7)" size={16} />
                                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 4 }}>Divisi</Text>
                                <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '600' }}>{division}</Text>
                            </View>
                            <View style={{
                                flex: 1,
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: borderRadius.md,
                                padding: spacing.sm,
                                alignItems: 'center',
                            }}>
                                <Briefcase color="rgba(255,255,255,0.7)" size={16} />
                                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 4 }}>Jabatan</Text>
                                <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '600' }}>{position}</Text>
                            </View>
                        </View>
                    </LinearGradient>
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
