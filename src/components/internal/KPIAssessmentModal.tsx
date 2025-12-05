import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Save } from 'lucide-react'
import { MemberKPI, kpiAPI, OrganizationMember } from '../../lib/supabase'

interface KPIAssessmentModalProps {
    member: OrganizationMember
    period: string
    existingKPI?: MemberKPI
    onClose: () => void
    onSave: () => void
}

const KPIAssessmentModal: React.FC<KPIAssessmentModalProps> = ({
    member,
    period,
    existingKPI,
    onClose,
    onSave
}) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        project_score: 0,
        attitude_score: 0,
        skill_score: 0,
        notes: ''
    })

    useEffect(() => {
        if (existingKPI) {
            setFormData({
                project_score: existingKPI.project_score || 0,
                attitude_score: existingKPI.attitude_score || 0,
                skill_score: existingKPI.skill_score || 0,
                notes: existingKPI.notes || ''
            })
        }
    }, [existingKPI])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await kpiAPI.upsert({
                id: existingKPI?.id,
                member_id: member.id,
                period,
                attendance_score: existingKPI?.attendance_score || 0, // Preserve existing attendance score
                ...formData
            })
            onSave()
            onClose()
        } catch (error) {
            console.error('Failed to save KPI:', error)
            alert('Gagal menyimpan penilaian KPI')
        } finally {
            setLoading(false)
        }
    }

    return createPortal(
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200 dark:border-[#2A2A2A] flex items-center justify-between sticky top-0 bg-white dark:bg-[#1E1E1E] z-10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Penilaian Anggota</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-[#2A2A2A] rounded-full transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200 font-bold">
                                {member.image_url ? (
                                    <img src={member.image_url} alt={member.full_name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    member.full_name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">{member.full_name}</h3>
                                <p className="text-sm text-slate-500">{member.npm} • {member.division}</p>
                            </div>
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            Periode: {period}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Nilai Proyek / Kepanitiaan (40%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.project_score}
                                onChange={(e) => setFormData({ ...formData, project_score: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">Kontribusi dalam program kerja dan kepanitiaan.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Nilai Sikap / Attitude (30%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.attitude_score}
                                onChange={(e) => setFormData({ ...formData, attitude_score: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">Kedisiplinan, komunikasi, dan kerjasama tim.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Nilai Skill / Kompetensi (15%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.skill_score}
                                onChange={(e) => setFormData({ ...formData, skill_score: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">Kemampuan teknis sesuai divisi dan pengembangan diri.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Catatan (Opsional)
                            </label>
                            <textarea
                                rows={3}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                placeholder="Tambahkan catatan evaluasi..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-[#2A2A2A]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2A2A2A] rounded-xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? 'Menyimpan...' : 'Simpan Penilaian'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}

export default KPIAssessmentModal
