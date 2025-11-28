import React, { useState, useEffect } from 'react'
import {
    Plus, Search, Filter, Package, Wrench, AlertTriangle,
    MoreVertical, Edit, Trash2, MapPin, Calendar
} from 'lucide-react'
import { inventoryAPI, InventoryItem } from '../../lib/supabase'
import InventoryModal from './InventoryModal'

const InventoryPage: React.FC = () => {
    const [items, setItems] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [conditionFilter, setConditionFilter] = useState('All')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            setLoading(true)
            const data = await inventoryAPI.list()
            setItems(data)
        } catch (error) {
            console.error('Error fetching inventory:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
            try {
                await inventoryAPI.delete(id)
                fetchItems()
            } catch (error) {
                console.error('Error deleting item:', error)
                alert('Gagal menghapus barang.')
            }
        }
    }

    const handleEdit = (item: InventoryItem) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    const handleAdd = () => {
        setSelectedItem(null)
        setIsModalOpen(true)
    }

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
        const matchesCondition = conditionFilter === 'All' || item.condition === conditionFilter
        return matchesSearch && matchesCategory && matchesCondition
    })

    const stats = {
        totalItems: items.reduce((acc, curr) => acc + curr.quantity, 0),
        totalValue: items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0),
        needsRepair: items.filter(i => i.condition === 'repair_needed').length,
        broken: items.filter(i => i.condition === 'broken').length
    }

    const getConditionBadge = (condition: string) => {
        switch (condition) {
            case 'good':
                return <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Layak Pakai</span>
            case 'repair_needed':
                return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Perlu Perbaikan</span>
            case 'broken':
                return <span className="px-2 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">Rusak</span>
            default:
                return null
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventaris Sekretariat</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manajemen aset dan perlengkapan organisasi</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none"
                >
                    <Plus size={18} />
                    Tambah Barang
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-slate-100 dark:border-[#2A2A2A] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Aset</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalItems} <span className="text-sm font-normal text-slate-400">Unit</span></h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-slate-100 dark:border-[#2A2A2A] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <span className="text-xl font-bold">Rp</span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Estimasi Nilai</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {(stats.totalValue / 1000000).toFixed(1)} <span className="text-sm font-normal text-slate-400">Juta</span>
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-slate-100 dark:border-[#2A2A2A] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
                            <Wrench size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Perlu Perbaikan</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.needsRepair} <span className="text-sm font-normal text-slate-400">Item</span></h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-slate-100 dark:border-[#2A2A2A] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-rose-600 dark:text-rose-400">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Rusak / Hilang</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.broken} <span className="text-sm font-normal text-slate-400">Item</span></h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-slate-100 dark:border-[#2A2A2A] shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama barang atau lokasi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#2A2A2A] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="All">Semua Kategori</option>
                        <option value="Perlengkapan">Perlengkapan</option>
                        <option value="Elektronik">Elektronik</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Dokumen">Dokumen</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                    <select
                        value={conditionFilter}
                        onChange={(e) => setConditionFilter(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="All">Semua Kondisi</option>
                        <option value="good">Layak Pakai</option>
                        <option value="repair_needed">Perlu Perbaikan</option>
                        <option value="broken">Rusak</option>
                    </select>
                </div>
            </div>

            {/* Inventory Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-100 dark:border-[#2A2A2A]">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Tidak ada barang ditemukan</h3>
                    <p className="text-slate-500 dark:text-slate-400">Coba ubah filter atau tambahkan barang baru.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-100 dark:border-[#2A2A2A] overflow-hidden shadow-sm hover:shadow-md transition-all group">
                            <div className="aspect-video bg-slate-100 dark:bg-[#2A2A2A] relative overflow-hidden">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <Package size={48} />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    {getConditionBadge(item.condition)}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-2 bg-white/90 hover:bg-white text-slate-900 rounded-lg transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 bg-rose-500/90 hover:bg-rose-600 text-white rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1 block">{item.category}</span>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{item.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Jumlah</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <MapPin size={16} className="text-slate-400" />
                                        {item.location || 'Tidak ada lokasi'}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Calendar size={16} className="text-slate-400" />
                                        {item.acquisition_date ? new Date(item.acquisition_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                    </div>
                                </div>

                                {item.notes && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#2A2A2A]">
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                                            "{item.notes}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <InventoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchItems}
                item={selectedItem}
            />
        </div>
    )
}

export default InventoryPage
