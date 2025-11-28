import React, { useState, useEffect } from 'react'
import { InternalEvent, WorkProgramBudget, budgetAPI } from '../../lib/supabase'
import { ArrowLeft, Calendar, MapPin, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import AttendanceDetail from './AttendanceDetail'

interface WorkProgramDetailProps {
    program: InternalEvent
    onBack: () => void
}

const WorkProgramDetail: React.FC<WorkProgramDetailProps> = ({ program, onBack }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'budget'>('overview')
    const [budgets, setBudgets] = useState<WorkProgramBudget[]>([])
    const [loadingBudget, setLoadingBudget] = useState(false)
    const [editingItem, setEditingItem] = useState<string | null>(null)
    const [newItem, setNewItem] = useState<Partial<WorkProgramBudget> | null>(null)

    useEffect(() => {
        if (activeTab === 'budget') {
            loadBudgets()
        }
    }, [activeTab])

    const loadBudgets = async () => {
        setLoadingBudget(true)
        try {
            const data = await budgetAPI.getBudgets(program.id)
            setBudgets(data)
        } catch (error) {
            console.error('Failed to load budgets:', error)
        } finally {
            setLoadingBudget(false)
        }
    }

    const handleSaveItem = async (item: Partial<WorkProgramBudget>) => {
        try {
            if (item.id) {
                await budgetAPI.update(item.id, item)
            } else {
                await budgetAPI.create({
                    ...item,
                    program_id: program.id,
                    status: 'planned',
                    total_price: (item.unit_price || 0) * (item.quantity || 1)
                } as any)
            }
            setEditingItem(null)
            setNewItem(null)
            loadBudgets()
        } catch (error) {
            console.error('Failed to save budget item:', error)
            alert('Gagal menyimpan item anggaran.')
        }
    }

    const handleDeleteItem = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
            try {
                await budgetAPI.delete(id)
                loadBudgets()
            } catch (error) {
                console.error('Failed to delete budget item:', error)
                alert('Gagal menghapus item anggaran.')
            }
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
    }

    const totalBudget = budgets.reduce((sum, item) => sum + Number(item.total_price), 0)

    return (
        <div className="space-y-6">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Kembali ke Daftar Program</span>
            </button>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700 uppercase">
                                {program.division}
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${program.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                program.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                                    program.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                                        'bg-slate-100 text-slate-700'
                                }`}>
                                {program.status || 'Upcoming'}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{program.title}</h1>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{new Date(program.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>{program.location}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Total Anggaran</p>
                            <p className="text-xl font-bold text-emerald-600">{formatCurrency(totalBudget)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex border-b border-slate-200 dark:border-[#2A2A2A] mb-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'attendance'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        Presensi
                    </button>
                    <button
                        onClick={() => setActiveTab('budget')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'budget'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        Anggaran (RAB)
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Deskripsi Program</h3>
                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{program.description}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <AttendanceDetail event={program} onClose={() => setActiveTab('overview')} />
                )}

                {activeTab === 'budget' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rancangan Anggaran Biaya (RAB)</h3>
                            <button
                                onClick={() => setNewItem({ item_name: '', quantity: 1, unit_price: 0, category: 'Umum' })}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={16} />
                                Tambah Item
                            </button>
                        </div>

                        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto rounded-lg border border-slate-200 dark:border-[#2A2A2A]">
                            <table className="w-full text-sm text-left relative">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-[#2A2A2A] sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Item</th>
                                        <th className="px-4 py-3">Kategori</th>
                                        <th className="px-4 py-3 text-right">Harga Satuan</th>
                                        <th className="px-4 py-3 text-center">Qty</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                        <th className="px-4 py-3 rounded-tr-lg text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-[#2A2A2A] bg-white dark:bg-[#1E1E1E]">
                                    {loadingBudget ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Memuat data anggaran...</td>
                                        </tr>
                                    ) : budgets.length === 0 && !newItem ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Belum ada item anggaran.</td>
                                        </tr>
                                    ) : (
                                        <>
                                            {budgets.map((item) => (
                                                <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-[#232323]">
                                                    {editingItem === item.id ? (
                                                        <EditRow
                                                            item={item}
                                                            onSave={handleSaveItem}
                                                            onCancel={() => setEditingItem(null)}
                                                        />
                                                    ) : (
                                                        <>
                                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{item.item_name}</td>
                                                            <td className="px-4 py-3 text-slate-500">{item.category}</td>
                                                            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{formatCurrency(item.unit_price)}</td>
                                                            <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{item.quantity}</td>
                                                            <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">{formatCurrency(item.total_price)}</td>
                                                            <td className="px-4 py-3 text-right">
                                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button onClick={() => setEditingItem(item.id)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                                                        <Edit2 size={16} />
                                                                    </button>
                                                                    <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                            {newItem && (
                                                <EditRow
                                                    item={newItem}
                                                    onSave={handleSaveItem}
                                                    onCancel={() => setNewItem(null)}
                                                />
                                            )}
                                        </>
                                    )}
                                </tbody>
                                <tfoot className="border-t-2 border-slate-100 dark:border-[#2A2A2A] sticky bottom-0 bg-slate-50 dark:bg-[#2A2A2A] z-10 shadow-[0_-1px_2px_rgba(0,0,0,0.05)]">
                                    <tr>
                                        <td colSpan={4} className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">Total Anggaran</td>
                                        <td className="px-4 py-3 text-right font-bold text-emerald-600">{formatCurrency(totalBudget)}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const EditRow = ({ item, onSave, onCancel }: { item: any, onSave: (i: any) => void, onCancel: () => void }) => {
    const [data, setData] = useState(item)

    const handleChange = (field: string, value: any) => {
        setData({ ...data, [field]: value })
    }

    return (
        <tr className="bg-blue-50 dark:bg-blue-900/10">
            <td className="px-4 py-2">
                <input
                    type="text"
                    value={data.item_name}
                    onChange={(e) => handleChange('item_name', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm dark:bg-[#1A1A1A] dark:border-[#2A2A2A]"
                    placeholder="Nama Item"
                    autoFocus
                />
            </td>
            <td className="px-4 py-2">
                <input
                    type="text"
                    value={data.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm dark:bg-[#1A1A1A] dark:border-[#2A2A2A]"
                    placeholder="Kategori"
                />
            </td>
            <td className="px-4 py-2">
                <input
                    type="number"
                    value={data.unit_price}
                    onChange={(e) => handleChange('unit_price', Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-sm text-right dark:bg-[#1A1A1A] dark:border-[#2A2A2A]"
                    placeholder="0"
                />
            </td>
            <td className="px-4 py-2">
                <input
                    type="number"
                    value={data.quantity}
                    onChange={(e) => handleChange('quantity', Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-sm text-center dark:bg-[#1A1A1A] dark:border-[#2A2A2A]"
                    placeholder="1"
                />
            </td>
            <td className="px-4 py-2 text-right font-medium">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format((data.unit_price || 0) * (data.quantity || 1))}
            </td>
            <td className="px-4 py-2 text-right">
                <div className="flex justify-end gap-2">
                    <button onClick={() => onSave(data)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                        <Save size={16} />
                    </button>
                    <button onClick={onCancel} className="p-1 text-slate-500 hover:bg-slate-50 rounded">
                        <X size={16} />
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default WorkProgramDetail
