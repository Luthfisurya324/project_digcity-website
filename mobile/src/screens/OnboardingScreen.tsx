import React, { useRef, useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Dimensions,
    StatusBar,
    Animated,
    Image,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
    QrCode,
    BarChart3,
    Bell,
    ArrowRight,
    Sparkles,
} from 'lucide-react-native'
import { useTheme, spacing, borderRadius } from '../ui/theme'

const { width, height } = Dimensions.get('window')

interface OnboardingSlide {
    id: string
    title: string
    highlight: string
    description: string
    iconType: 'logo' | 'qr' | 'chart' | 'bell'
    gradient: readonly [string, string, ...string[]]
    emoji: string
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        title: 'Selamat Datang di',
        highlight: 'DigCity',
        description: 'Platform resmi anggota organisasi untuk kelola kehadiran, pantau performa, dan tetap terhubung dengan komunitas.',
        iconType: 'logo',
        gradient: ['#1e3a8a', '#4c1d95'],
        emoji: '👋',
    },
    {
        id: '2',
        title: 'Absensi Cepat',
        highlight: 'Scan QR',
        description: 'Cukup scan QR code untuk mencatat kehadiran. Tidak perlu tanda tangan manual lagi!',
        iconType: 'qr',
        gradient: ['#2563eb', '#7c3aed'],
        emoji: '📱',
    },
    {
        id: '3',
        title: 'Pantau',
        highlight: 'Kinerja KPI',
        description: 'Lihat skor KPI, grade, dan track record kehadiranmu secara real-time. Tingkatkan kontribusimu!',
        iconType: 'chart',
        gradient: ['#059669', '#10b981'],
        emoji: '📊',
    },
    {
        id: '4',
        title: 'Tetap',
        highlight: 'Terhubung',
        description: 'Dapatkan notifikasi tugas, info kegiatan, dan pengingat iuran langsung di HP-mu.',
        iconType: 'bell',
        gradient: ['#f97316', '#ec4899'],
        emoji: '🔔',
    },
]

interface OnboardingScreenProps {
    onComplete: () => void
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
    const { colors, mode } = useTheme()
    const [currentIndex, setCurrentIndex] = useState(0)
    const flatListRef = useRef<FlatList>(null)
    const scrollX = useRef(new Animated.Value(0)).current

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
            setCurrentIndex(currentIndex + 1)
        } else {
            onComplete()
        }
    }

    const handleSkip = () => {
        onComplete()
    }

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0)
        }
    }).current

    const renderIcon = (iconType: string, gradient: readonly string[]) => {
        const iconProps = { color: '#ffffff', size: 48 }
        switch (iconType) {
            case 'logo':
                return <Sparkles {...iconProps} />
            case 'qr':
                return <QrCode {...iconProps} />
            case 'chart':
                return <BarChart3 {...iconProps} />
            case 'bell':
                return <Bell {...iconProps} />
            default:
                return null
        }
    }

    const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
        return (
            <View style={{ width, paddingHorizontal: spacing.xl }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {/* Icon Container */}
                    <LinearGradient
                        colors={item.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            width: 140,
                            height: 140,
                            borderRadius: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: spacing.xl,
                            shadowColor: item.gradient[0],
                            shadowOffset: { width: 0, height: 12 },
                            shadowOpacity: 0.4,
                            shadowRadius: 20,
                            elevation: 15,
                        }}
                    >
                        {renderIcon(item.iconType, item.gradient)}
                    </LinearGradient>

                    {/* Text Content */}
                    <View style={{ alignItems: 'center', paddingHorizontal: spacing.md }}>
                        <Text style={{ fontSize: 48, marginBottom: spacing.sm }}>{item.emoji}</Text>
                        <Text style={{ fontSize: 24, color: colors.muted, fontWeight: '400', textAlign: 'center' }}>
                            {item.title}
                        </Text>
                        <Text style={{ fontSize: 32, color: colors.text, fontWeight: '800', textAlign: 'center', marginBottom: spacing.md }}>
                            {item.highlight}
                        </Text>
                        <Text style={{ fontSize: 16, color: colors.muted, textAlign: 'center', lineHeight: 26, paddingHorizontal: spacing.sm }}>
                            {item.description}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    const renderDots = () => (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.xl }}>
            {slides.map((_, index) => {
                const isActive = index === currentIndex
                return (
                    <View
                        key={index}
                        style={{
                            width: isActive ? 32 : 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: isActive ? colors.primary : colors.border,
                            marginHorizontal: 4,
                        }}
                    />
                )
            })}
        </View>
    )

    const isLastSlide = currentIndex === slides.length - 1
    const isDark = mode === 'dark'
    const currentSlide = slides[currentIndex]

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Skip Button */}
            {!isLastSlide && (
                <TouchableOpacity
                    onPress={handleSkip}
                    style={{
                        position: 'absolute',
                        top: 60,
                        right: spacing.lg,
                        zIndex: 10,
                        paddingVertical: spacing.sm,
                        paddingHorizontal: spacing.md,
                    }}
                >
                    <Text style={{ color: colors.muted, fontSize: 15, fontWeight: '600' }}>Lewati</Text>
                </TouchableOpacity>
            )}

            {/* Slides */}
            <Animated.FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                style={{ flex: 1 }}
            />

            {/* Bottom Section */}
            <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl + 20 }}>
                {renderDots()}

                <TouchableOpacity onPress={handleNext} activeOpacity={0.9}>
                    <LinearGradient
                        colors={currentSlide.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 18,
                            borderRadius: 16,
                            shadowColor: currentSlide.gradient[0],
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.35,
                            shadowRadius: 12,
                            elevation: 8,
                        }}
                    >
                        <Text style={{ color: '#ffffff', fontSize: 17, fontWeight: '700', marginRight: spacing.sm }}>
                            {isLastSlide ? 'Mulai Sekarang' : 'Lanjutkan'}
                        </Text>
                        <ArrowRight color="#ffffff" size={20} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    )
}
