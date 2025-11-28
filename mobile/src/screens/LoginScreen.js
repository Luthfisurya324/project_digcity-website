import React, { useState } from 'react'
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StatusBar, Image, ActivityIndicator } from 'react-native'
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckSquare, Square } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../ui/theme'
import { supabase } from '../lib/supabase'

export default function LoginScreen({ onLoggedIn }) {
  const [emailOrNpm, setEmailOrNpm] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [remember, setRemember] = useState(false)

  const resolveEmail = async (identifier) => {
    if (!identifier) return ''
    if (identifier.includes('@')) return identifier
    const { data } = await supabase.from('organization_members').select('email').eq('npm', identifier).single()
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
    } catch (e) {
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
    <SafeAreaView className="flex-1 bg-bg">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 justify-center px-4">
        <View className="rounded-2xl mb-4 overflow-hidden">
          <LinearGradient colors={["#0b1a3a", "#0e1f4a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 16, alignItems: 'center' }}>
            <View className="mb-3">
              <Image source={{ uri: 'https://digcity.my.id/logo_digcity.png' }} style={{ width: 64, height: 64, borderRadius: 16 }} />
            </View>
            <Text className="text-text text-2xl font-bold text-center">Selamat Datang</Text>
            <Text className="text-muted text-xs text-center">Masuk ke akun Anda</Text>
          </LinearGradient>
        </View>
        {error ? <Text className="text-danger text-center mb-2">{error}</Text> : null}
        {info ? <Text className="text-success text-center mb-2">{info}</Text> : null}
        <View className="bg-card rounded-2xl border border-border p-4 mb-4">
          <View className="bg-surface border border-border rounded-lg flex-row items-center px-3 py-2 mb-2">
            <Mail color={colors.muted} size={18} />
            <TextInput value={emailOrNpm} onChangeText={setEmailOrNpm} placeholder="Email atau NPM" placeholderTextColor="#94a3b8" keyboardType="email-address" autoFocus returnKeyType="next" className="flex-1 text-text px-2" />
          </View>
          <View className="bg-surface border border-border rounded-lg flex-row items-center px-3 py-2 mb-2">
            <Lock color={colors.muted} size={18} />
            <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#94a3b8" secureTextEntry={!showPassword} returnKeyType="go" onSubmitEditing={login} className="flex-1 text-text px-2" />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff color={colors.muted} size={18} /> : <Eye color={colors.muted} size={18} />}
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <TouchableOpacity onPress={() => setRemember((v) => !v)} className="flex-row items-center">
              {remember ? <CheckSquare color={colors.muted} size={18} /> : <Square color={colors.muted} size={18} />}
              <Text className="text-muted text-xs ml-2">Ingat saya</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={forgotPassword}>
              <Text className="text-primary text-xs">Lupa password?</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={login} disabled={loading} className={`mt-2 ${loading ? 'opacity-70' : ''}`}>
            <LinearGradient colors={["#2563eb", "#7c3aed"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}>
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View className="flex-row items-center">
                  <Text className="text-white text-[15px] font-semibold mr-2">Masuk</Text>
                  <ArrowRight color="#ffffff" size={18} />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={forgotPassword} className="mt-3">
            <Text className="text-primary text-center">Lupa Password?</Text>
          </TouchableOpacity>
        </View>
        <View className="items-center">
          <Text className="text-muted text-xs">© 2024 DigCity. All rights reserved.</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
