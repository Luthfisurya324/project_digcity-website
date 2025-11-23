import React, { useMemo } from 'react'
import { InternalEvent } from '../../lib/supabase'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'

interface EventCalendarProps {
  events: InternalEvent[]
  mode: 'month' | 'week'
  activeDate: Date
  onActiveDateChange: (date: Date) => void
  onSelectDay: (date: Date) => void
  onSelectEvent: (event: InternalEvent) => void
}

const daysShort = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  mode,
  activeDate,
  onActiveDateChange,
  onSelectDay,
  onSelectEvent
}) => {
  const startOfWeek = (date: Date) => {
    const result = new Date(date)
    const day = result.getDay()
    const diff = (day === 0 ? -6 : 1) - day
    result.setDate(result.getDate() + diff)
    result.setHours(0, 0, 0, 0)
    return result
  }

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const addDays = (date: Date, days: number) => {
    const clone = new Date(date)
    clone.setDate(clone.getDate() + days)
    return clone
  }

  const calendarDays = useMemo(() => {
    if (mode === 'week') {
      const start = startOfWeek(activeDate)
      return Array.from({ length: 7 }, (_, idx) => addDays(start, idx))
    }
    const firstDayOfMonth = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1)
    const gridStart = startOfWeek(firstDayOfMonth)
    return Array.from({ length: 42 }, (_, idx) => addDays(gridStart, idx))
  }, [activeDate, mode])

  const eventsByDate = useMemo(() => {
    return calendarDays.map((day) => {
      const dayEvents = events.filter((event) =>
        isSameDay(new Date(event.date), day)
      )
      return { day, events: dayEvents }
    })
  }, [calendarDays, events])

  const goPrev = () => {
    const newDate = new Date(activeDate)
    if (mode === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    onActiveDateChange(newDate)
  }

  const goNext = () => {
    const newDate = new Date(activeDate)
    if (mode === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    onActiveDateChange(newDate)
  }

  const monthLabel = activeDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-100 dark:border-[#2A2A2A] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#2A2A2A]">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Kalender {mode === 'week' ? 'Mingguan' : 'Bulanan'}</p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{monthLabel}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={goPrev} className="p-2 rounded-full bg-slate-100 dark:bg-[#2A2A2A] text-slate-600 hover:bg-slate-200">
            <ChevronLeft size={16} />
          </button>
          <button onClick={goNext} className="p-2 rounded-full bg-slate-100 dark:bg-[#2A2A2A] text-slate-600 hover:bg-slate-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className={`grid ${mode === 'week' ? 'grid-cols-7' : 'grid-cols-7'} gap-1 text-center text-xs font-semibold text-slate-400 pb-2`}>
          {daysShort.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className={`grid ${mode === 'week' ? 'grid-cols-7' : 'grid-cols-7'} gap-1`}>
          {eventsByDate.map(({ day, events: dayEvents }) => {
            const isCurrentMonth = day.getMonth() === activeDate.getMonth()
            const isToday = isSameDay(day, new Date())
            const isActive = isSameDay(day, activeDate)
            return (
              <button
                key={day.toISOString()}
                onClick={() => {
                  onActiveDateChange(day)
                  onSelectDay(day)
                }}
                className={`relative h-28 rounded-xl border transition-all text-left p-2 ${
                  isActive ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-900/10' : 'border-slate-100 dark:border-[#2A2A2A]'
                } ${!isCurrentMonth ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${isActive ? 'text-blue-600' : 'text-slate-700 dark:text-white'}`}>
                    {day.getDate()}
                  </span>
                  {isToday && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600">Hari ini</span>
                  )}
                </div>
                <div className="mt-2 space-y-1 overflow-y-auto max-h-20 pr-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectEvent(event)
                      }}
                      className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#2A2A2A] text-slate-600 dark:text-slate-200 truncate cursor-pointer hover:bg-blue-100 hover:text-blue-700"
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-slate-400">+{dayEvents.length - 3} agenda</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-[#2A2A2A] text-sm text-slate-500 flex items-center gap-2">
        <MapPin size={14} />
        Klik tanggal untuk melihat agenda detail, klik kartu agenda untuk membuka presensi.
      </div>
    </div>
  )
}

export default EventCalendar

