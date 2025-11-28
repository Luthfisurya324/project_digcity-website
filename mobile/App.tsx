import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'
import './global.css'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, StatusBar, Animated } from 'react-native'
import { Home, History as HistoryIcon, AlertTriangle, User as UserIcon, QrCode } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { NativeModulesProxy } from 'expo-modules-core'
import { supabase } from './src/lib/supabase'
import { colors, spacing } from './src/ui/theme'
import LoginScreen from './src/screens/LoginScreen'
import WelcomeScreen from './src/screens/WelcomeScreen'


type ButtonVariant = 'primary' | 'success' | 'outline'

function Button({ title, onPress, variant = 'primary', disabled }: { title: string; onPress: () => void; variant?: ButtonVariant; disabled?: boolean }) {
  const base = 'py-2 rounded-lg items-center justify-center border mt-2'
  const variantCls =
    variant === 'primary'
      ? 'bg-primary border-primary'
      : variant === 'success'
      ? 'bg-success border-success'
      : 'bg-transparent border-border'
  const textCls = variant === 'outline' ? 'text-text' : 'text-white'
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} className={`${base} ${variantCls}`} style={{ opacity: disabled ? 0.7 : 1 }}>
      <Text className={`text-[15px] font-semibold ${textCls}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default function App() {
  const [userEmail, setUserEmail] = useState('')
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const e = data.user?.email || ''
      setUserEmail(e)
    })
  }, [])
  if (!userEmail) {
    return <LoginScreen onLoggedIn={(e) => setUserEmail(e)} />
  }
  return <MainApp userEmail={userEmail} onLogout={() => setUserEmail('')} />
}

function Input({ value, onChangeText, placeholder, secureTextEntry, keyboardType, autoFocus, onSubmitEditing, returnKeyType }: { value: string; onChangeText: (t: string) => void; placeholder: string; secureTextEntry?: boolean; keyboardType?: 'default' | 'email-address' | 'numeric'; autoFocus?: boolean; onSubmitEditing?: () => void; returnKeyType?: 'default' | 'next' | 'go' | 'done' }) {
  return (
    <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} secureTextEntry={secureTextEntry} keyboardType={keyboardType} autoFocus={autoFocus} onSubmitEditing={onSubmitEditing} returnKeyType={returnKeyType} className="bg-surface text-text border border-border rounded-lg px-4 py-2 mb-2" />
  )
}


type AuthedScreen = 'welcome' | 'attendance' | 'history' | 'sanctions' | 'profile' | 'scan'

function BottomBar({ active, onChange }: { active: AuthedScreen; onChange: (s: AuthedScreen) => void }) {
  function BarItem({ label, Icon, active, onPress }: { label: string; Icon: any; active: boolean; onPress: () => void }) {
    const sv = React.useRef(new Animated.Value(active ? 1 : 0)).current
    React.useEffect(() => {
      Animated.timing(sv, { toValue: active ? 1 : 0, duration: 250, useNativeDriver: true }).start()
    }, [active])
    const scale = sv.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] })
    const opacity = sv.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] })
    return (
      <TouchableOpacity onPress={onPress} style={styles.bottomItem}>
        <View style={styles.itemInner}>
          <Animated.View style={[styles.itemHighlight, { transform: [{ scale }], opacity }] }>
            <LinearGradient colors={["#0b1a3a", "#0e1f4a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.itemHighlightFill} />
          </Animated.View>
          <Icon color={active ? colors.primary : colors.muted} size={20} />
          <Text style={[styles.bottomLabel, { color: active ? colors.primary : colors.muted }]}>{label}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  const left: { key: AuthedScreen; label: string; Icon: any }[] = [
    { key: 'welcome', label: 'Beranda', Icon: Home },
    { key: 'history', label: 'Riwayat', Icon: HistoryIcon }
  ]
  const right: { key: AuthedScreen; label: string; Icon: any }[] = [
    { key: 'sanctions', label: 'Sanksi', Icon: AlertTriangle },
    { key: 'profile', label: 'Profil', Icon: UserIcon }
  ]
  return (
    <View style={styles.bottomBar}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {left.map((it) => {
          const isActive = it.key === active
          const IconComp = it.Icon
          return <BarItem key={it.key} label={it.label} Icon={IconComp} active={isActive} onPress={() => onChange(it.key)} />
        })}
      </View>
      <View style={{ width: 88 }} />
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
        {right.map((it) => {
          const isActive = it.key === active
          const IconComp = it.Icon
          return <BarItem key={it.key} label={it.label} Icon={IconComp} active={isActive} onPress={() => onChange(it.key)} />
        })}
      </View>
      <View pointerEvents="box-none" style={styles.fabOverlay}>
        <TouchableOpacity onPress={() => onChange('scan')} style={[styles.scanFab, { transform: [{ scale: active === 'scan' ? 1.08 : 1 }] }]}> 
          <QrCode color={'#ffffff'} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  )
}


function MainApp({ userEmail, onLogout }: { userEmail: string; onLogout: () => void }) {
  const [screen, setScreen] = useState<AuthedScreen>('welcome')
  const [events, setEvents] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [member, setMember] = useState<any>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const [sanctions, setSanctions] = useState<any[]>([])
  const [hasCamPermission, setHasCamPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const [scanMessage, setScanMessage] = useState('')
  const [scannerComp, setScannerComp] = useState<any>(null)
  const [nativeMissing, setNativeMissing] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        loadEvents()
        loadMember()
        loadHistory()
      }
    })
  }, [])

  useEffect(() => {
    if (screen === 'scan') {
      ;(async () => {
        const hasNative = !!(NativeModulesProxy as any)?.ExpoBarCodeScanner
        if (!hasNative) {
          setNativeMissing(true)
          return
        }
        try {
          const mod = await import('expo-barcode-scanner')
          setScannerComp(mod.BarCodeScanner)
          const { status } = await mod.BarCodeScanner.requestPermissionsAsync()
          setHasCamPermission(status === 'granted')
        } catch {
          setNativeMissing(true)
        }
      })()
    }
  }, [screen])

  const loadEvents = async () => {
    setRefreshing(true)
    const { data } = await supabase.from('internal_events').select('*').order('date', { ascending: false })
    setEvents(data || [])
    setRefreshing(false)
  }

  const checkIn = async (eventId: string) => {
    const { data: m } = await supabase.from('organization_members').select('id, full_name, npm').eq('email', userEmail).single()
    await supabase.from('attendance').insert([{ event_id: eventId, member_id: m?.id || null, name: m?.full_name || 'Anggota', npm: m?.npm || '-', status: 'present' }])
  }

  function extractEventIdFromPayload(payload: string): string | null {
    try {
      const obj = JSON.parse(payload)
      if (obj && obj.event_id) return String(obj.event_id)
    } catch {}
    const q1 = payload.match(/event_id=([\w-]+)/i)
    if (q1) return q1[1]
    const q2 = payload.match(/event[:=]([\w-]+)/i)
    if (q2) return q2[1]
    const trimmed = payload.trim()
    if (/^\d+$/.test(trimmed)) return trimmed
    return null
  }

  const handleScan = async (data: string) => {
    setScanned(true)
    setScanMessage('')
    const evId = extractEventIdFromPayload(data)
    if (!evId) {
      setScanMessage('QR tidak valid')
      return
    }
    try {
      await checkIn(evId)
      setScanMessage('Presensi berhasil')
    } catch (e: any) {
      setScanMessage(e?.message || 'Gagal presensi')
    }
  }

  const loadMember = async () => {
    const { data } = await supabase
      .from('organization_members')
      .select('id, full_name, npm, division, position, email')
      .eq('email', userEmail)
      .single()
    setMember(data || null)
  }

  useEffect(() => {
    if (screen === 'profile') loadMember()
    if (screen === 'welcome') loadHistory()
  }, [screen, userEmail])

  const loadHistory = async () => {
    if (!member?.id) await loadMember()
    const id = member?.id
    if (!id) return
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('member_id', id)
      .order('created_at', { ascending: false })
    setHistory(data || [])
  }

  const loadSanctionsList = async () => {
    if (!member?.id) await loadMember()
    const id = member?.id
    if (!id) return
    const { data } = await supabase
      .from('member_sanctions')
      .select('*')
      .eq('member_id', id)
      .order('sanction_date', { ascending: false })
    setSanctions(data || [])
  }

  useEffect(() => {
    if (screen === 'history') loadHistory()
    if (screen === 'sanctions') loadSanctionsList()
  }, [screen])

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
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPwError(error.message || 'Gagal memperbarui password')
    } else {
      setPwSuccess('Password berhasil diperbarui')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    onLogout()
  }

  if (screen === 'attendance') {
    return (
      <SafeAreaView style={styles.container} className="flex-1 bg-bg">
        <StatusBar barStyle="light-content" />
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          refreshing={refreshing}
          onRefresh={loadEvents}
          contentContainerStyle={{ paddingVertical: spacing.md, paddingHorizontal: spacing.md, paddingBottom: 90 }}
          renderItem={({ item }) => (
            <View className="bg-card rounded-xl border border-border p-4 mb-4">
              <Text className="text-text text-base font-semibold mb-1">{item.title}</Text>
              <Text className="text-muted text-xs mb-2">{item.division}</Text>
              <Button title="Check-in" onPress={() => checkIn(item.id)} variant="success" />
            </View>
          )}
        />
        <BottomBar active="attendance" onChange={setScreen} />
      </SafeAreaView>
    )
  }

  if (screen === 'scan') {
    return (
      <SafeAreaView style={styles.container} className="flex-1 bg-bg">
        <StatusBar barStyle="light-content" />
        <View className="px-4 pt-4" style={{ flex: 1 }}>
          <Text className="text-text text-base font-semibold mb-2">Scan QR Absensi</Text>
          {nativeMissing ? (
            <View className="bg-card rounded-xl border border-border p-4 items-center justify-center" style={{ flex: 1 }}>
              <Text className="text-danger">Fitur scan belum aktif</Text>
              <Text className="text-muted text-xs mt-2">Rebuild dev client diperlukan</Text>
            </View>
          ) : hasCamPermission === false ? (
            <View className="bg-card rounded-xl border border-border p-4 items-center justify-center" style={{ flex: 1 }}>
              <Text className="text-danger">Izin kamera ditolak</Text>
              <TouchableOpacity onPress={() => { const hasNative = !!(NativeModulesProxy as any)?.ExpoBarCodeScanner; if (!hasNative) { setNativeMissing(true); return } import('expo-barcode-scanner').then((m)=>m.BarCodeScanner.requestPermissionsAsync()).then(({ status }) => setHasCamPermission(status === 'granted')).catch(()=>setNativeMissing(true)) }} className="py-2 rounded-lg items-center justify-center border mt-2 bg-primary border-primary">
                <Text className="text-white font-semibold">Minta Izin</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View className="overflow-hidden rounded-2xl border border-border" style={{ flex: 1 }}>
                {scannerComp ? (
                  React.createElement(scannerComp, { onBarCodeScanned: scanned ? undefined : ({ data }: any) => handleScan(String(data)), style: { flex: 1 } })
                ) : (
                  <View className="items-center justify-center" style={{ flex: 1 }}>
                    <Text className="text-muted">Menyiapkan kamera...</Text>
                  </View>
                )}
              </View>
              <View className="mt-3 bg-card rounded-xl border border-border p-3">
                <Text className="text-muted text-xs">Arahkan kamera ke QR acara untuk presensi</Text>
                {scanMessage ? <Text className={`text-[13px] mt-2 ${scanMessage.includes('berhasil') ? 'text-success' : 'text-danger'}`}>{scanMessage}</Text> : null}
                {scanned ? (
                  <TouchableOpacity onPress={() => { setScanned(false); setScanMessage('') }} className="py-2 rounded-lg items-center justify-center border mt-2 bg-primary border-primary">
                    <Text className="text-white font-semibold">Scan Lagi</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          )}
        </View>
        <BottomBar active="scan" onChange={setScreen} />
      </SafeAreaView>
    )
  }

  if (screen === 'welcome') {
    return (
      <SafeAreaView style={styles.container} className="flex-1 bg-bg">
        <StatusBar barStyle="light-content" />
        <WelcomeScreen onNavigate={setScreen} userEmail={userEmail} member={member} todayEvents={events.filter((e)=>{ try { const d=new Date(e.date); const t=new Date(); return d.getDate()===t.getDate() && d.getMonth()===t.getMonth() && d.getFullYear()===t.getFullYear(); } catch { return false } })} history={history} onQuickCheckIn={(id)=>checkIn(id)} />
        <BottomBar active="welcome" onChange={setScreen} />
      </SafeAreaView>
    )
  }

  if (screen === 'history') {
    return (
      <SafeAreaView style={styles.container} className="flex-1 bg-bg">
        <StatusBar barStyle="light-content" />
        <FlatList
          data={history}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingVertical: spacing.md, paddingHorizontal: spacing.md, paddingBottom: 90 }}
          renderItem={({ item }) => {
            const ev = events.find((e) => e.id === item.event_id)
            return (
              <View className="bg-card rounded-xl border border-border p-4 mb-4">
                <Text className="text-text text-base font-semibold mb-1">{ev?.title || `Event ${item.event_id}`}</Text>
                <Text className="text-muted text-xs mb-2">{item.status || 'present'}</Text>
              </View>
            )
          }}
        />
        <BottomBar active="history" onChange={setScreen} />
      </SafeAreaView>
    )
  }

  if (screen === 'sanctions') {
    return (
      <SafeAreaView style={styles.container} className="flex-1 bg-bg">
        <StatusBar barStyle="light-content" />
        <FlatList
          data={sanctions}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingVertical: spacing.md, paddingHorizontal: spacing.md, paddingBottom: 90 }}
          renderItem={({ item }) => (
            <View className="bg-card rounded-xl border border-border p-4 mb-4">
              <Text className="text-text text-base font-semibold mb-1">{item.sanction_status || 'Sanksi'}</Text>
              <Text className="text-muted text-xs mb-2">{item.reason || '-'}</Text>
            </View>
          )}
        />
        <BottomBar active="sanctions" onChange={setScreen} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} className="flex-1 bg-bg">
      <StatusBar barStyle="light-content" />
      <View className="px-4 pt-4">
        <View className="bg-card rounded-xl border border-border p-4 mb-4">
          <Text className="text-text text-base font-semibold mb-1">{member?.full_name || 'Anggota'}</Text>
          <Text className="text-muted text-xs mb-2">{member?.npm ? `NPM ${member.npm}` : '-'}</Text>
          <View className="flex-row mb-2">
            <View className="px-2 py-1 rounded-lg border border-border mr-2">
              <Text className="text-muted">{member?.division || '-'}</Text>
            </View>
            <View className="px-2 py-1 rounded-lg border border-border">
              <Text className="text-muted">{member?.position || '-'}</Text>
            </View>
          </View>
          <Text className="text-muted text-xs mb-2">{userEmail || '-'}</Text>
        </View>

        <View className="bg-card rounded-xl border border-border p-4 mb-4">
          <Text className="text-text text-base font-semibold mb-1">Ganti Password</Text>
          {pwError ? <Text className="text-danger text-center mb-2">{pwError}</Text> : null}
          {pwSuccess ? <Text className="text-success text-center mb-2">{pwSuccess}</Text> : null}
          <Input value={newPassword} onChangeText={setNewPassword} placeholder="Password baru" secureTextEntry />
          <Input value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Konfirmasi password" secureTextEntry />
          <Button title="Simpan Password" onPress={updatePassword} variant="primary" />
        </View>

        <View className="flex-row">
          <View style={{ flex: 1 }}>
            <Button title="Agenda" onPress={() => setScreen('attendance')} variant="outline" />
          </View>
          <View style={{ flex: 1 }} className="ml-2">
            <Button title="Keluar" onPress={signOut} variant="primary" />
          </View>
        </View>
        <View style={{ height: 90 }} />
      </View>
      <BottomBar active="profile" onChange={setScreen} />
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: (StatusBar.currentHeight || 0) + spacing.sm },
  error: { color: colors.danger, textAlign: 'center', marginBottom: spacing.sm },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', paddingVertical: spacing.md, paddingBottom: spacing.lg, alignItems: 'center' },
  bottomItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  bottomLabel: { fontSize: 12, fontWeight: '600' },
  fabOverlay: { position: 'absolute', left: 0, right: 0, top: -36, alignItems: 'center' },
  scanFab: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border },
  itemInner: { alignItems: 'center', justifyContent: 'center' },
  itemHighlight: { position: 'absolute', left: 12, right: 12, top: 6, bottom: 6, borderRadius: 12, overflow: 'hidden' },
  itemHighlightFill: { flex: 1, borderRadius: 12 }
})
