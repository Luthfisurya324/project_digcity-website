import { useEffect } from 'react'
import { attendanceAPI, duesAPI, type InternalEvent, type MemberDue } from '../lib/supabase'
import { useNotifications } from '../components/common/NotificationCenter'

const isWithinHours = (iso: string, hours: number) => {
  const now = new Date().getTime()
  const t = new Date(iso).getTime()
  const diff = t - now
  return diff > 0 && diff <= hours * 60 * 60 * 1000
}

const isWithinDays = (iso: string, days: number) => {
  const now = new Date().getTime()
  const t = new Date(iso).getTime()
  const diff = t - now
  return diff > 0 && diff <= days * 24 * 60 * 60 * 1000
}

export const useReminders = (enabled: boolean) => {
  const { notify } = useNotifications()

  useEffect(() => {
    if (!enabled) return

    const run = async () => {
      try {
        const events = await attendanceAPI.getEvents()
        const upcomingSoon = (events as InternalEvent[]).filter((e) => e.status === 'upcoming' && isWithinHours(e.date, 48))
        if (upcomingSoon.length > 0) {
          const next = upcomingSoon[0]
          const dateStr = new Date(next.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
          notify({ type: 'info', title: 'Reminder Event', message: `${next.title} • ${dateStr}` })
        }
      } catch { }

      try {
        const dues = await duesAPI.getAll()
        const overdue = (dues as MemberDue[]).filter((d) => new Date(d.due_date).getTime() < Date.now() && d.status !== 'paid')
        const upcoming = (dues as MemberDue[]).filter((d) => isWithinDays(d.due_date, 7) && d.status !== 'paid')
        if (overdue.length > 0) {
          notify({ type: 'warning', title: 'Iuran jatuh tempo', message: `${overdue.length} tagihan lewat jatuh tempo` })
        } else if (upcoming.length > 0) {
          notify({ type: 'info', title: 'Reminder iuran', message: `${upcoming.length} tagihan mendekati jatuh tempo` })
        }
      } catch { }
    }
    run()
  }, [notify, enabled])
}

