import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { galleryAPI, type Gallery } from '../lib/supabase'
import { Calendar, Heart, ArrowRight, Star, Music, Coffee, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Recap2025Page: React.FC = () => {
    const [memories, setMemories] = useState<Gallery[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const data = await galleryAPI.getAll()
                // Shuffle and pick top 12 for the wall
                const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 12)
                setMemories(shuffled)
            } catch (e) {
                console.error('Failed to load memories', e)
            } finally {
                setLoading(false)
            }
        }
        fetchMemories()
    }, [])

    const containerVars = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVars = {
        hidden: { y: 20, opacity: 0, scale: 0.9 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', bounce: 0.4 }
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
            {/* 1. Hero / Intro: Nostalgic VHS/Retro vibe mixed with clean modern DigCity */}
            <section className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 text-white p-6 text-center">

                {/* Background Particles/Stars */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-white rounded-full opacity-20"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: Math.random() * window.innerHeight,
                                scale: Math.random() * 0.5 + 0.5
                            }}
                            animate={{
                                y: [null, Math.random() * window.innerHeight],
                                opacity: [0.2, 0.5, 0.2]
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{ width: Math.random() * 4 + 2, height: Math.random() * 4 + 2 }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="z-10 relative"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm">
                        ✨ Edisi Spesial Akhir Tahun
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-blue-200 drop-shadow-2xl">
                        REWIND
                        <br />
                        <span className="text-yellow-400 font-serif italic text-6xl md:text-9xl">2025</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        Setiap tawa, keringat, dan ide yang kita bagikan adalah jejak yang tak akan terhapus.
                        Terima kasih telah menjadi bagian dari perjalanan luar biasa ini.
                    </p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <ArrowRight className="rotate-90 w-6 h-6" />
                </motion.div>
            </section>

            {/* 2. Photo Wall / Polaroid Scatter */}
            <section className="py-20 px-4 md:px-8 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Galeri Kenangan</h2>
                        <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center h-64 items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVars}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                        >
                            {memories.map((mem, idx) => (
                                <motion.div
                                    key={mem.id}
                                    variants={itemVars}
                                    className="break-inside-avoid"
                                >
                                    <div
                                        className={`bg-white p-3 pb-8 shadow-lg transform transition-transform hover:z-10 hover:scale-105 duration-300 ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'
                                            }`}
                                        style={{ borderRadius: '4px' }}
                                    >
                                        <div className="bg-slate-200 w-full aspect-[4/3] mb-4 overflow-hidden rounded-sm relative group">
                                            <img
                                                src={mem.image_url}
                                                alt={mem.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="font-handwriting text-slate-600 text-center font-medium relative">
                                            {mem.title}
                                            <div className="absolute -right-2 -bottom-6 text-xs text-slate-300 font-sans transform -rotate-12">
                                                {new Date(mem.event_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* 3. The Numbers / Stats (Animated Counter style) */}
            <section className="py-24 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {[
                            { label: "Acara Sukses", val: "25+", icon: Calendar, color: "text-blue-400" },
                            { label: "Anggota Aktif", val: "140", icon: MapPin, color: "text-emerald-400" },
                            { label: "Kopi Dihabiskan", val: "∞", icon: Coffee, color: "text-amber-400" },
                            { label: "Kenangan Terukir", val: "Tak Terbatas", icon: Heart, color: "text-rose-400" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                                viewport={{ once: true }}
                                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-md hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center text-center"
                            >
                                <div className={`mb-4 p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors ${stat.color}`}>
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <div className="text-4xl md:text-5xl font-black mb-2 tracking-tight">{stat.val}</div>
                                <div className="text-slate-400 font-medium text-sm uppercase tracking-wider">{stat.label}</div>

                                {/* Glow Effect */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 blur transition duration-500`}></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Timeline / Journey Strip */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Highlight Momen</h2>
                    <div className="relative border-l-2 border-blue-200 ml-6 md:ml-0 space-y-12">
                        {[
                            { month: 'Januari', title: 'Awal Perjalanan', desc: 'Rapat kerja pertama dan pembentukan visi misi.' },
                            { month: 'April', title: 'Level Up Day', desc: 'Antusiasme peserta pecah di workshop AI & Business.' },
                            { month: 'Agustus', title: 'DIGIMON 2025', desc: 'Kompetisi terseru tahun ini dengan 50+ tim pendaftar.' },
                            { month: 'Desember', title: 'Refleksi Akhir Tahun', desc: 'Menutup tahun dengan rasa bangga dan persahabatan.' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: -50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="relative pl-12 md:pl-0 md:flex md:items-center md:justify-between group"
                            >
                                {/* Dot */}
                                <div className="absolute left-[-9px] top-0 w-6 h-6 rounded-full bg-white border-4 border-blue-600 z-10 group-hover:scale-125 transition-transform" />

                                <div className="md:w-5/12 md:text-right md:pr-12">
                                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">{item.month}</span>
                                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                                </div>
                                <div className="md:w-5/12 md:pl-12 mt-2 md:mt-0">
                                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Closing / CTA */}
            <section className="py-32 bg-slate-900 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-2xl mx-auto px-6"
                >
                    <Star className="w-12 h-12 text-yellow-400 mx-auto mb-6 animate-pulse" />
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Siap untuk 2026?</h2>
                    <p className="text-xl text-blue-200 mb-10">
                        Satu bab berakhir, bab baru menanti. Ayo lanjutkan semangat ini!
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-xl hover:shadow-blue-500/50"
                    >
                        Kembali ke Beranda <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </section>
        </div>
    )
}

export default Recap2025Page
