import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, StatusBar } from 'react-native'
import { supabase } from './src/lib/supabase'
import { colors, spacing } from './src/ui/theme'

type Screen = 'login' | 'attendance' | 'profile'

type ButtonVariant = 'primary' | 'success' | 'outline'

function Button({ title, onPress, variant = 'primary', disabled }: { title: string; onPress: () => void; variant?: ButtonVariant; disabled?: boolean }) {
  const bg = variant === 'primary' ? colors.primary : variant === 'success' ? colors.success : 'transparent'
  const border = variant === 'outline' ? colors.border : 'transparent'
  const color = variant === 'outline' ? colors.text : '#fff'
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.button, { backgroundColor: bg, borderColor: border, opacity: disabled ? 0.7 : 1 }]}> 
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
    </TouchableOpacity>
  )
}

function Input({ value, onChangeText, placeholder, secureTextEntry, keyboardType }: { value: string; onChangeText: (t: string) => void; placeholder: string; secureTextEntry?: boolean; keyboardType?: 'default' | 'email-address' | 'numeric' }) {
  return (
    <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} secureTextEntry={secureTextEntry} keyboardType={keyboardType} style={styles.input} />
  )
}

function Header({ title, onRightPress, rightLabel }: { title: string; onRightPress?: () => void; rightLabel?: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {rightLabel ? (
        <TouchableOpacity onPress={onRightPress} style={styles.headerRight}>
          <Text style={styles.headerRightText}>{rightLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [emailOrNpm, setEmailOrNpm] = useState('')
  const [password, setPassword] = useState('')
  const [events, setEvents] = useState<any[]>([])
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const e = data.user?.email || ''
      setUserEmail(e)
      if (e) {
        setScreen('attendance')
        loadEvents()
      }
    })
  }, [])

  const login = async () => {
    setLoading(true)
    setError('')
    let loginEmail = emailOrNpm.trim()
    try {
      if (loginEmail && !loginEmail.includes('@')) {
        const { data } = await supabase.from('organization_members').select('email').eq('npm', loginEmail).single()
        loginEmail = (data as any)?.email || ''
      }
      const res = await supabase.auth.signInWithPassword({ email: loginEmail, password })
      if (res.data.user) {
        setUserEmail(res.data.user.email || '')
        setScreen('attendance')
        loadEvents()
      } else if (res.error) {
        setError(res.error.message || 'Gagal masuk')
      }
    } catch (e: any) {
      setError(e?.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const loadEvents = async () => {
    setRefreshing(true)
    const { data } = await supabase.from('internal_events').select('*').order('date', { ascending: false })
    setEvents(data || [])
    setRefreshing(false)
  }

  const checkIn = async (eventId: string) => {
    const { data: member } = await supabase.from('organization_members').select('id, full_name, npm').eq('email', userEmail).single()
    await supabase.from('attendance').insert([{ event_id: eventId, member_id: member?.id || null, name: member?.full_name || 'Anggota', npm: member?.npm || '-', status: 'present' }])
  }

  if (screen === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loginWrap}>
          <Text style={styles.title}>Masuk Anggota</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.card}>
            <Input value={emailOrNpm} onChangeText={setEmailOrNpm} placeholder="Email atau NPM" keyboardType="email-address" />
            <Input value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
            <Button title={loading ? 'Masuk...' : 'Masuk'} onPress={login} variant="primary" disabled={loading} />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (screen === 'attendance') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Header title="Agenda & Presensi" rightLabel="Profil" onRightPress={() => setScreen('profile')} />
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          refreshing={refreshing}
          onRefresh={loadEvents}
          contentContainerStyle={{ paddingVertical: spacing.md }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>{item.division}</Text>
              <Button title="Check-in" onPress={() => checkIn(item.id)} variant="success" />
            </View>
          )}
        />
      </SafeAreaView>
    )
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setScreen('login')
    setUserEmail('')
    setEmailOrNpm('')
    setPassword('')
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header title="Profil" />
      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Email</Text>
          <Text style={styles.cardSub}>{userEmail || '-'}</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Button title="Kembali" onPress={() => setScreen('attendance')} variant="outline" />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Button title="Keluar" onPress={signOut} variant="primary" />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  headerRight: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  headerRightText: { color: '#fff' },
  loginWrap: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.md },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: spacing.md, textAlign: 'center' },
  card: { backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: spacing.xs },
  cardSub: { color: colors.muted, fontSize: 13, marginBottom: spacing.sm },
  input: { backgroundColor: colors.surface, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginBottom: spacing.sm },
  button: { paddingVertical: spacing.sm, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginTop: spacing.sm },
  buttonText: { fontSize: 15, fontWeight: '600' },
  error: { color: colors.danger, textAlign: 'center', marginBottom: spacing.sm }
})
