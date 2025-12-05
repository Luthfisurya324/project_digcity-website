import React, { useState, useRef, useEffect } from 'react'
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Image,
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckSquare, Square } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, gradients, spacing, borderRadius, shadows } from '../ui/theme'
import { supabase } from '../lib/supabase'

interface LoginScreenProps {
    onLoggedIn: (email: string) => void
}

export default function LoginScreen({ onLoggedIn }: LoginScreenProps) {
    const [emailOrNpm, setEmailOrNpm] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [info, setInfo] = useState('')
    const [remember, setRemember] = useState(false)

    // Animation values
    const logoScale = useRef(new Animated.Value(0.5)).current
    const logoOpacity = useRef(new Animated.Value(0)).current
    const formTranslateY = useRef(new Animated.Value(50)).current
    const formOpacity = useRef(new Animated.Value(0)).current

    useEffect(() => {
        // Entrance animations
        Animated.parallel([
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(formTranslateY, {
                toValue: 0,
                duration: 500,
                delay: 200,
                useNativeDriver: true,
            }),
            Animated.timing(formOpacity, {
                toValue: 1,
                duration: 500,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start()
    }, [])

    const resolveEmail = async (identifier: string): Promise<string> => {
        if (!identifier) return ''
        if (identifier.includes('@')) return identifier
        const { data } = await supabase
            .from('organization_members')
            .select('email')
            .eq('npm', identifier)
            .single()
        return (data && data.email) || ''
    }

    const login = async () => {
        setLoading(true)
        setError('')
        setInfo('')
        try {
            const loginEmail = await resolveEmail(emailOrNpm.trim())
            if (!loginEmail) {
                setError('NPM/email tidak ditemukan')
                return
            }
            const res = await supabase.auth.signInWithPassword({ email: loginEmail, password })
            if (res.data.user) {
                onLoggedIn(res.data.user.email || '')
            } else if (res.error) {
                setError(res.error.message || 'Gagal masuk')
            }
        } catch (e: any) {
            setError(e?.message || 'Terjadi kesalahan')
        } finally {
            setLoading(false)
        }
    }

    const forgotPassword = async () => {
        setError('')
        setInfo('')
        const loginEmail = await resolveEmail(emailOrNpm.trim())
        if (!loginEmail) {
            setError('Masukkan email atau NPM terlebih dahulu')
            return
        }
        const { error } = await supabase.auth.resetPasswordForEmail(loginEmail)
        if (error) {
            setError(error.message || 'Gagal mengirim email reset password')
        } else {
            setInfo('Email reset password telah dikirim')
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg }}>
                    {/* Logo Section with Animation */}
                    <Animated.View style={{
                        alignItems: 'center',
                        marginBottom: spacing.xl,
                        transform: [{ scale: logoScale }],
                        opacity: logoOpacity,
                    }}>
                        <LinearGradient
                            colors={gradients.cardDark}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                padding: spacing.lg,
                                borderRadius: borderRadius.xl,
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: colors.glassBorder,
                                ...shadows.lg,
                            }}
                        >
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 20,
                                backgroundColor: colors.glass,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: spacing.md,
                                borderWidth: 1,
                                borderColor: colors.glassBorder,
                            }}>
                                <Image
                                    source={{ uri: 'https://digcity.my.id/logo_digcity.png' }}
                                    style={{ width: 64, height: 64, borderRadius: 16 }}
                                />
                            </View>
                            <Text style={{
                                fontSize: 24,
                                fontWeight: '700',
                                color: colors.text,
                                textAlign: 'center',
                            }}>
                                Selamat Datang
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: colors.muted,
                                textAlign: 'center',
                                marginTop: 4,
                            }}>
                                Masuk ke akun Anda
                            </Text>
                        </LinearGradient>
                    </Animated.View>

                    {/* Error/Info Messages */}
                    {error ? (
                        <View style={{
                            backgroundColor: colors.dangerBg,
                            padding: spacing.md,
                            borderRadius: borderRadius.md,
                            marginBottom: spacing.md,
                            borderWidth: 1,
                            borderColor: colors.danger,
                        }}>
                            <Text style={{ color: colors.danger, textAlign: 'center' }}>{error}</Text>
                        </View>
                    ) : null}
                    {info ? (
                        <View style={{
                            backgroundColor: colors.successBg,
                            padding: spacing.md,
                            borderRadius: borderRadius.md,
                            marginBottom: spacing.md,
                            borderWidth: 1,
                            borderColor: colors.success,
                        }}>
                            <Text style={{ color: colors.success, textAlign: 'center' }}>{info}</Text>
                        </View>
                    ) : null}

                    {/* Login Form with Glassmorphism */}
                    <Animated.View style={{
                        transform: [{ translateY: formTranslateY }],
                        opacity: formOpacity,
                    }}>
                        <View style={{
                            backgroundColor: colors.glass,
                            borderRadius: borderRadius.xl,
                            padding: spacing.lg,
                            borderWidth: 1,
                            borderColor: colors.glassBorder,
                            ...shadows.md,
                        }}>
                            {/* Email/NPM Input */}
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
                                <Mail color={colors.muted} size={20} />
                                <TextInput
                                    value={emailOrNpm}
                                    onChangeText={setEmailOrNpm}
                                    placeholder="Email atau NPM"
                                    placeholderTextColor={colors.muted}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    style={{
                                        flex: 1,
                                        color: colors.text,
                                        fontSize: 15,
                                        paddingHorizontal: spacing.sm,
                                        paddingVertical: spacing.xs,
                                    }}
                                />
                            </View>

                            {/* Password Input */}
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
                                <Lock color={colors.muted} size={20} />
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Password"
                                    placeholderTextColor={colors.muted}
                                    secureTextEntry={!showPassword}
                                    returnKeyType="go"
                                    onSubmitEditing={login}
                                    style={{
                                        flex: 1,
                                        color: colors.text,
                                        fontSize: 15,
                                        paddingHorizontal: spacing.sm,
                                        paddingVertical: spacing.xs,
                                    }}
                                />
                                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                                    {showPassword ? (
                                        <EyeOff color={colors.muted} size={20} />
                                    ) : (
                                        <Eye color={colors.muted} size={20} />
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Remember & Forgot Password Row */}
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: spacing.lg,
                            }}>
                                <TouchableOpacity
                                    onPress={() => setRemember((v) => !v)}
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                >
                                    {remember ? (
                                        <CheckSquare color={colors.primary} size={18} />
                                    ) : (
                                        <Square color={colors.muted} size={18} />
                                    )}
                                    <Text style={{ color: colors.muted, fontSize: 13, marginLeft: spacing.sm }}>
                                        Ingat saya
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={forgotPassword}>
                                    <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>
                                        Lupa password?
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={login}
                                disabled={loading}
                                activeOpacity={0.8}
                                style={{ opacity: loading ? 0.7 : 1 }}
                            >
                                <LinearGradient
                                    colors={gradients.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingVertical: 14,
                                        borderRadius: borderRadius.md,
                                    }}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#ffffff" />
                                    ) : (
                                        <>
                                            <Text style={{
                                                color: colors.text,
                                                fontSize: 16,
                                                fontWeight: '600',
                                                marginRight: spacing.sm,
                                            }}>
                                                Masuk
                                            </Text>
                                            <ArrowRight color="#ffffff" size={20} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Footer */}
                    <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
                        <Text style={{ color: colors.muted, fontSize: 12 }}>
                            © 2024 DigCity. All rights reserved.
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
