import React from 'react'
import { Bell, Users, MapPin, CheckCircle2 } from 'lucide-react-native'
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../ui/theme'

export default function WelcomeScreen({ onNavigate, userEmail, member, todayEvents = [], history = [], onQuickCheckIn }) {
  const name = member?.full_name || 'Anggota Digcity'
  const npm = member?.npm || '-'
  const division = member?.division || '-'
  const position = member?.position || 'Anggota'
  const presence = member?.presence_percent ? `${member.presence_percent}%` : '92%'

  

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <StatusBar barStyle="light-content" />
      <View className="px-4 pt-4 pb-24">
        <View className="rounded-2xl mb-4 border border-[#233b6e] overflow-hidden">
          <LinearGradient colors={["#0b1a3a", "#0e1f4a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 16 }}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-primary/20 border border-primary items-center justify-center mr-3">
                  <Text className="text-primary font-bold">{name.slice(0,1)}</Text>
                </View>
                <View>
                  <Text className="text-muted text-xs">Selamat Datang</Text>
                  <Text className="text-text text-lg font-semibold">{name}</Text>
                </View>
              </View>
              <View className="w-9 h-9 rounded-full bg-card border border-border items-center justify-center">
                <Bell color={colors.text} size={18} />
              </View>
            </View>
            <View className="bg-card rounded-xl border border-border p-3 mt-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-muted">• Status Anggota</Text>
                <Text className="text-success">Aktif</Text>
              </View>
              <View className="flex-row">
                <View style={{ flex: 1 }}>
                  <Text className="text-muted text-xs">NPM</Text>
                  <Text className="text-text font-semibold">{npm}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text className="text-muted text-xs">Divisi</Text>
                  <Text className="text-text font-semibold">{division}</Text>
                </View>
              </View>
              <View className="flex-row mt-3">
                <View style={{ flex: 1 }}>
                  <Text className="text-muted text-xs">Jabatan</Text>
                  <Text className="text-text font-semibold">{position}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text className="text-muted text-xs">Kehadiran</Text>
                  <Text className="text-success font-semibold">{presence}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="bg-card rounded-2xl border border-border p-4 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text text-base font-semibold">Agenda Hari Ini</Text>
            <TouchableOpacity onPress={() => onNavigate('attendance')}>
              <Text className="text-primary text-xs">Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          {todayEvents.length === 0 ? (
            <View className="py-2">
              <Text className="text-muted text-xs">Tidak ada agenda</Text>
            </View>
          ) : (
            todayEvents.map((item) => (
              <View key={String(item.id)} className="bg-surface rounded-xl border border-border p-4 mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="px-2 py-1 rounded-lg bg-primary/15 mr-2">
                      <Text className="text-primary text-xs">{item.division || 'Umum'}</Text>
                    </View>
                    <Text className="text-muted text-xs">{item.time_range || item.date ? new Date(item.date).toLocaleTimeString().slice(0,5) : ''}</Text>
                  </View>
                  <View className="w-9 h-9 rounded-xl bg-card border border-border items-center justify-center">
                    <Users color={colors.text} size={18} />
                  </View>
                </View>
                <Text className="text-text font-semibold mb-1">{item.title}</Text>
                <View className="flex-row items-center mb-3">
                  <MapPin color={colors.muted} size={16} />
                  <Text className="text-muted text-xs ml-1">{item.location || '-'}</Text>
                </View>
                <TouchableOpacity onPress={() => onNavigate('attendance')} className="bg-card border border-border rounded-lg py-2 items-center justify-center">
                  <Text className="text-text font-semibold">Lihat Detail</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        

        <View className="bg-card rounded-2xl border border-border p-4 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text text-base font-semibold">Notifikasi Terbaru</Text>
            <TouchableOpacity>
              <Text className="text-primary text-xs">Tandai Semua Dibaca</Text>
            </TouchableOpacity>
          </View>
          {history.length === 0 ? (
            <View className="py-2">
              <Text className="text-muted text-xs">Tidak ada notifikasi</Text>
            </View>
          ) : (
            history.slice(0,3).map((h) => (
              <View key={String(h.id)} className="bg-surface rounded-xl border border-border p-4 mb-3">
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-full bg-success/15 border border-success items-center justify-center mr-3">
                    <CheckCircle2 color={colors.success} size={18} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text className="text-text font-semibold">Presensi Berhasil</Text>
                    <Text className="text-muted text-xs">Anda telah hadir</Text>
                    <Text className="text-muted text-xs mt-1">{new Date(h.created_at).toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        
      </View>
    </SafeAreaView>
  )
}
