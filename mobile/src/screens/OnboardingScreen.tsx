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
    ChevronRight
} from 'lucide-react-native'
import { useTheme, spacing, borderRadius } from '../ui/theme'

const { width, height } = Dimensions.get('window')

interface OnboardingSlide {
    id: string
    title: string
    subtitle: string
    description: string
    iconType: 'logo' | 'qr' | 'chart' | 'bell'
    gradientColors: readonly [string, string, ...string[]]
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        title: 'Selamat Datang',
        subtitle: 'di DigCity',
        description: 'Aplikasi resmi untuk anggota organisasi. Kelola kehadiran, pantau performa, dan tetap terhubung.',
        iconType: 'logo',
        gradientColors: ['#1e3a8a', '#312e81', '#4c1d95'],
    },
    {
        id: '2',
        title: 'Absensi Digital',
        subtitle: 'Mudah & Cepat',
        description: 'Scan QR code untuk mencatat kehadiran Anda di setiap kegiatan organisasi secara real-time.',
        iconType: 'qr',
        gradientColors: ['#2563eb', '#7c3aed'],
    },
    {
        id: '3',
        title: 'Pantau KPI',
        subtitle: 'Performa Anda',
        description: 'Lihat nilai KPI, grade, dan progres Anda. Tingkatkan kontribusi untuk organisasi.',
        iconType: 'chart',
        gradientColors: ['#059669', '#0d9488'],
    },
    {
        id: '4',
        title: 'Tetap Update',
        subtitle: 'Setiap Saat',
        description: 'Terima notifikasi tugas, pengingat iuran, dan info kegiatan langsung di genggaman Anda.',
        iconType: 'bell',
        gradientColors: ['#f97316', '#ec4899'],
    },
]

interface OnboardingScreenProps {
    onComplete: () => void
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
    const { colors, gradients, mode } = useTheme()
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

    const renderIcon = (iconType: string) => {
        switch (iconType) {
            case 'logo':
                return <Image source={{ uri: 'https://digcity.my.id/logo_digcity.png' }} style={{ width: 80, height: 80, borderRadius: 20 }} />
            case 'qr':
                return <QrCode color="#ffffff" size={64} strokeWidth={1.5} />
            case 'chart':
                return <BarChart3 color="#ffffff" size={64} strokeWidth={1.5} />
            case 'bell':
                return <Bell color="#ffffff" size={64} strokeWidth={1.5} />
            default:
                return null
        }
    }

    const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width]
        const scale = scrollX.interpolate({ inputRange, outputRange: [0.8, 1, 0.8], extrapolate: 'clamp' })
        const opacity = scrollX.interpolate({ inputRange, outputRange: [0.5, 1, 0.5], extrapolate: 'clamp' })

        return (
            <View style={{ width, paddingHorizontal: spacing.lg }}>
                <Animated.View style={{ flex: 1, transform: [{ scale }], opacity }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: height * 0.1 }}>
                        <LinearGradient
                            colors={item.gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                width: 160,
                                height: 160,
                                borderRadius: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: spacing.xl,
                            }}
                        >
                            <View style={{
                                width: 140,
                                height: 140,
                                borderRadius: 35,
                                backgroundColor: colors.glass,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: colors.glassBorder,
                            }}>
                                {renderIcon(item.iconType)}
                            </View>
                        </LinearGradient>

                        <View style={{ alignItems: 'center', paddingHorizontal: spacing.md }}>
                            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, textAlign: 'center' }}>
                                {item.title}
                            </Text>
                            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.primary, textAlign: 'center', marginBottom: spacing.md }}>
                                {item.subtitle}
                            </Text>
                            <Text style={{ fontSize: 15, color: colors.muted, textAlign: 'center', lineHeight: 24, paddingHorizontal: spacing.lg }}>
                                {item.description}
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </View>
        )
    }

    const renderDots = () => (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.xl }}>
            {slides.map((_, index) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width]
                const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' })
                const dotOpacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' })

                return (
                    <Animated.View
                        key={index}
                        style={{
                            width: dotWidth,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: colors.primary,
                            marginHorizontal: 4,
                            opacity: dotOpacity,
                        }}
                    />
                )
            })}
        </View>
    )

    const isLastSlide = currentIndex === slides.length - 1
    const isDark = mode === 'dark'

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

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

            <Animated.FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                style={{ flex: 1 }}
            />

            <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}>
                {renderDots()}

                <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
                    <LinearGradient
                        colors={gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 16,
                            borderRadius: borderRadius.lg,
                        }}
                    >
                        <Text style={{ color: '#ffffff', fontSize: 17, fontWeight: '600', marginRight: spacing.sm }}>
                            {isLastSlide ? 'Mulai Sekarang' : 'Lanjutkan'}
                        </Text>
                        {isLastSlide ? <ArrowRight color="#ffffff" size={20} /> : <ChevronRight color="#ffffff" size={20} />}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    )
}
