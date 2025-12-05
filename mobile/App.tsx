import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'
import './global.css'
import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ActivityIndicator
} from 'react-native'
import {
  Home,
  BarChart3,
  Briefcase,
  User as UserIcon,
  QrCode
} from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { NativeModulesProxy } from 'expo-modules-core'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from './src/lib/supabase'
import { ThemeProvider, useTheme, spacing, borderRadius } from './src/ui/theme'

// Import screens
import OnboardingScreen from './src/screens/OnboardingScreen'
import LoginScreen from './src/screens/LoginScreen'
import WelcomeScreen from './src/screens/WelcomeScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import KPIScreen from './src/screens/KPIScreen'
import TasksScreen from './src/screens/TasksScreen'
import DuesScreen from './src/screens/DuesScreen'
import LeaderboardScreen from './src/screens/LeaderboardScreen'

const ONBOARDING_KEY = '@digcity_onboarding_done'

type AppState = 'loading' | 'onboarding' | 'login' | 'authenticated'
type AuthedScreen = 'welcome' | 'history' | 'sanctions' | 'profile' | 'scan' | 'kpi' | 'tasks' | 'dues' | 'leaderboard'

// Root App with ThemeProvider wrapper
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

// Main App Content
function AppContent() {
  const { colors, mode } = useTheme()
  const [appState, setAppState] = useState<AppState>('loading')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    checkInitialState()
  }, [])

  const checkInitialState = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user?.email) {
        setUserEmail(user.email)
        setAppState('authenticated')
        return
      }

      const onboardingDone = await AsyncStorage.getItem(ONBOARDING_KEY)
      if (onboardingDone === 'true') {
        setAppState('login')
      } else {
        setAppState('onboarding')
      }
    } catch (error) {
      console.log('Init error:', error)
      setAppState('onboarding')
    }
  }

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
    setAppState('login')
  }

  const handleLoggedIn = (email: string) => {
    setUserEmail(email)
    setAppState('authenticated')
  }

  const handleLogout = () => {
    setUserEmail('')
    setAppState('login')
  }

  if (appState === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (appState === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />
  }

  if (appState === 'login') {
    return <LoginScreen onLoggedIn={handleLoggedIn} />
  }

  return <MainApp userEmail={userEmail} onLogout={handleLogout} />
}

// Bottom Navigation Bar
function BottomBar({ active, onChange }: { active: AuthedScreen; onChange: (s: AuthedScreen) => void }) {
  const { colors, gradients } = useTheme()

  function BarItem({ label, Icon, active, onPress }: { label: string; Icon: any; active: boolean; onPress: () => void }) {
    const sv = React.useRef(new Animated.Value(active ? 1 : 0)).current

    React.useEffect(() => {
      Animated.timing(sv, { toValue: active ? 1 : 0, duration: 250, useNativeDriver: true }).start()
    }, [active])

    const scale = sv.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] })
    const opacity = sv.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] })

    return (
      <TouchableOpacity onPress={onPress} style={styles.bottomItem}>
        <Animated.View style={[styles.itemInner, { transform: [{ scale }], opacity }]}>
          <Icon color={active ? colors.primary : colors.muted} size={22} />
          <Text style={[styles.bottomLabel, { color: active ? colors.primary : colors.muted }]}>{label}</Text>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  const left: { key: AuthedScreen; label: string; Icon: any }[] = [
    { key: 'welcome', label: 'Beranda', Icon: Home },
    { key: 'kpi', label: 'KPI', Icon: BarChart3 }
  ]
  const right: { key: AuthedScreen; label: string; Icon: any }[] = [
    { key: 'tasks', label: 'Tugas', Icon: Briefcase },
    { key: 'profile', label: 'Profil', Icon: UserIcon }
  ]

  return (
    <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {left.map((it) => (
          <BarItem
            key={it.key}
            label={it.label}
            Icon={it.Icon}
            active={it.key === active}
            onPress={() => onChange(it.key)}
          />
        ))}
      </View>
      <View style={{ width: 88 }} />
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
        {right.map((it) => (
          <BarItem
            key={it.key}
            label={it.label}
            Icon={it.Icon}
            active={it.key === active}
            onPress={() => onChange(it.key)}
          />
        ))}
      </View>
      <View pointerEvents="box-none" style={styles.fabOverlay}>
        <TouchableOpacity
          onPress={() => onChange('scan')}
          style={[styles.scanFab, { transform: [{ scale: active === 'scan' ? 1.08 : 1 }] }]}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={gradients.primary}
            style={styles.scanFabGradient}
          >
            <QrCode color={'#ffffff'} size={26} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// Main App (Authenticated)
function MainApp({ userEmail, onLogout }: { userEmail: string; onLogout: () => void }) {
  const { colors, gradients, mode } = useTheme()
  const [screen, setScreen] = useState<AuthedScreen>('welcome')
  const [events, setEvents] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [member, setMember] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [hasCamPermission, setHasCamPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const [scanMessage, setScanMessage] = useState('')
  const [scannerComp, setScannerComp] = useState<any>(null)
  const [nativeMissing, setNativeMissing] = useState(false)

  useEffect(() => {
    loadEvents()
    loadMember()
    loadHistory()
  }, [])

  useEffect(() => {
    if (screen === 'scan') {
      ; (async () => {
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

  const loadMember = async () => {
    const { data } = await supabase
      .from('organization_members')
      .select('id, full_name, npm, division, position, email, created_at')
      .eq('email', userEmail)
      .single()
    setMember(data || null)
  }

  const loadHistory = async () => {
    if (!member?.id) {
      const { data: memberData } = await supabase
        .from('organization_members')
        .select('id')
        .eq('email', userEmail)
        .single()

      if (memberData?.id) {
        const { data } = await supabase
          .from('attendance')
          .select('*')
          .eq('member_id', memberData.id)
          .order('created_at', { ascending: false })
        setHistory(data || [])
      }
    } else {
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('member_id', member.id)
        .order('created_at', { ascending: false })
      setHistory(data || [])
    }
  }

  useEffect(() => {
    if (screen === 'profile') loadMember()
    if (screen === 'welcome') loadHistory()
  }, [screen, userEmail])

  const checkIn = async (eventId: string) => {
    const { data: m } = await supabase.from('organization_members').select('id, full_name, npm').eq('email', userEmail).single()
    await supabase.from('attendance').insert([{ event_id: eventId, member_id: m?.id || null, name: m?.full_name || 'Anggota', npm: m?.npm || '-', status: 'present' }])
    loadHistory()
  }

  function extractEventIdFromPayload(payload: string): string | null {
    try {
      const obj = JSON.parse(payload)
      if (obj && obj.event_id) return String(obj.event_id)
    } catch { }
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
      setScanMessage('Presensi berhasil!')
    } catch (e: any) {
      setScanMessage(e?.message || 'Gagal presensi')
    }
  }

  const getTodayEvents = () => {
    return events.filter((e) => {
      try {
        const d = new Date(e.date)
        const t = new Date()
        return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear()
      } catch {
        return false
      }
    })
  }

  // Render screens
  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onNavigate={setScreen}
            userEmail={userEmail}
            member={member}
            todayEvents={getTodayEvents()}
            history={history}
            onQuickCheckIn={checkIn}
          />
        )
      case 'kpi':
        return <KPIScreen userEmail={userEmail} member={member} />
      case 'tasks':
        return <TasksScreen userEmail={userEmail} member={member} />
      case 'dues':
        return <DuesScreen userEmail={userEmail} member={member} />
      case 'leaderboard':
        return <LeaderboardScreen userEmail={userEmail} member={member} />
      case 'profile':
        return <ProfileScreen userEmail={userEmail} member={member} onLogout={onLogout} />
      case 'scan':
        return (
          <View style={{ flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: spacing.md }}>
              Scan QR Absensi
            </Text>
            {nativeMissing ? (
              <View style={{
                flex: 1,
                backgroundColor: colors.glass,
                borderRadius: borderRadius.xl,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.glassBorder,
              }}>
                <QrCode color={colors.muted} size={48} />
                <Text style={{ color: colors.danger, fontSize: 14, marginTop: spacing.md }}>Fitur scan belum aktif</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: spacing.xs, textAlign: 'center', paddingHorizontal: spacing.lg }}>
                  Rebuild development client diperlukan untuk menggunakan fitur ini
                </Text>
              </View>
            ) : hasCamPermission === false ? (
              <View style={{
                flex: 1,
                backgroundColor: colors.glass,
                borderRadius: borderRadius.xl,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.glassBorder,
              }}>
                <Text style={{ color: colors.danger, fontSize: 14 }}>Izin kamera ditolak</Text>
                <TouchableOpacity
                  onPress={() => {
                    const hasNative = !!(NativeModulesProxy as any)?.ExpoBarCodeScanner
                    if (!hasNative) { setNativeMissing(true); return }
                    import('expo-barcode-scanner')
                      .then((m) => m.BarCodeScanner.requestPermissionsAsync())
                      .then(({ status }) => setHasCamPermission(status === 'granted'))
                      .catch(() => setNativeMissing(true))
                  }}
                  style={{ marginTop: spacing.md }}
                >
                  <LinearGradient
                    colors={gradients.primary}
                    style={{ paddingVertical: 12, paddingHorizontal: spacing.lg, borderRadius: borderRadius.md }}
                  >
                    <Text style={{ color: '#ffffff', fontWeight: '600' }}>Minta Izin</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <View style={{
                  flex: 1,
                  borderRadius: borderRadius.xl,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: colors.glassBorder,
                }}>
                  {scannerComp ? (
                    React.createElement(scannerComp, {
                      onBarCodeScanned: scanned ? undefined : ({ data }: any) => handleScan(String(data)),
                      style: { flex: 1 }
                    })
                  ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.glass }}>
                      <ActivityIndicator color={colors.primary} size="large" />
                      <Text style={{ color: colors.muted, marginTop: spacing.md }}>Menyiapkan kamera...</Text>
                    </View>
                  )}
                </View>
                <View style={{
                  backgroundColor: colors.glass,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                  marginTop: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.glassBorder,
                }}>
                  <Text style={{ color: colors.muted, fontSize: 13 }}>
                    Arahkan kamera ke QR acara untuk mencatat kehadiran
                  </Text>
                  {scanMessage ? (
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      marginTop: spacing.sm,
                      color: scanMessage.includes('berhasil') ? colors.success : colors.danger
                    }}>
                      {scanMessage}
                    </Text>
                  ) : null}
                  {scanned && (
                    <TouchableOpacity
                      onPress={() => { setScanned(false); setScanMessage('') }}
                      style={{ marginTop: spacing.md }}
                    >
                      <LinearGradient
                        colors={gradients.primary}
                        style={{ paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center' }}
                      >
                        <Text style={{ color: '#ffffff', fontWeight: '600' }}>Scan Lagi</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        )
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>
      <BottomBar active={screen} onChange={setScreen} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: (StatusBar.currentHeight || 0) + spacing.sm
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg + 8,
    alignItems: 'center'
  },
  bottomItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4
  },
  fabOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -30,
    alignItems: 'center'
  },
  scanFab: {
    width: 60,
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  scanFabGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInner: {
    alignItems: 'center',
    justifyContent: 'center'
  },
})
