import React, { useState, useEffect } from 'react'
import { X, Upload, Save, Trash2 } from 'lucide-react'
import { supabase, inventoryAPI, InventoryItem } from '../../lib/supabase'

interface InventoryModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    item?: InventoryItem | null
}

const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, onSuccess, item }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<InventoryItem>>({
        name: '',
        category: 'Perlengkapan',
        quantity: 1,
        condition: 'good',
        price: 0,
        location: 'Sekretariat',
        notes: '',
        image_url: ''
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>('')

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name,
                category: item.category,
                quantity: item.quantity,
                condition: item.condition,
                price: item.price,
                location: item.location,
                notes: item.notes,
                image_url: item.image_url
            })
            setPreviewUrl(item.image_url || '')
        } else {
            setFormData({
                name: '',
                category: 'Perlengkapan',
                quantity: 1,
                condition: 'good',
                price: 0,
                location: 'Sekretariat',
                notes: '',
                image_url: ''
            })
            setPreviewUrl('')
        }
        setImageFile(null)
    }, [item, isOpen])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let imageUrl = formData.image_url

            if (imageFile) {
                imageUrl = await inventoryAPI.uploadImage(imageFile)
            }

            const payload = {
                name: formData.name!,
                category: formData.category!,
                quantity: Number(formData.quantity),
                condition: formData.condition as 'good' | 'repair_needed' | 'broken',
                price: Number(formData.price),
                location: formData.location,
                notes: formData.notes,
                image_url: imageUrl,
                acquisition_date: item?.acquisition_date || new Date().toISOString() // Default to now if new
            }

            if (item) {
                await inventoryAPI.update(item.id, payload)
            } else {
                await inventoryAPI.create(payload)
            }

            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error saving inventory item:', error)
            alert('Gagal menyimpan data inventaris.')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white dark:bg-[#1E1E1E] border-b border-slate-100 dark:border-[#2A2A2A]">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {item ? 'Edit Barang' : 'Tambah Barang Baru'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#2A2A2A] transition-colors">
                        <X size={20} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Image Upload */}
                    <div className="flex justify-center">
                        <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#2A2A2A] border-2 border-dashed border-slate-300 dark:border-[#333] flex items-center justify-center">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload size={32} className="text-slate-400" />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl pointer-events-none">
                                <span className="text-white text-xs font-medium">Ubah Foto</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Barang</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Contoh: Proyektor Epson"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kategori</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="Perlengkapan">Perlengkapan</option>
                                <option value="Elektronik">Elektronik</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Dokumen">Dokumen</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Jumlah</label>
                            <input
                                type="number"
                                min="1"
                                required
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kondisi</label>
                            <select
                                value={formData.condition}
                                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="good">Layak Pakai</option>
                                <option value="repair_needed">Perlu Perbaikan</option>
                                <option value="broken">Rusak</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Estimasi Harga (Rp)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Lokasi Penyimpanan</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Contoh: Lemari A, Rak 2"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Catatan Tambahan</label>
                        <textarea
                            rows={3}
                            value={formData.notes || ''}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            placeholder="Keterangan kondisi detail atau riwayat perbaikan..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2A2A2A] font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>Menyimpan...</>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Simpan Data
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default InventoryModal
