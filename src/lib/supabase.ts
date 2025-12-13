import { createClient } from '@supabase/supabase-js'
import { supabaseConfig, validateSupabaseConfig } from '../config/supabaseConfig'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

// Validasi konfigurasi Supabase
if (!validateSupabaseConfig()) {
  console.error('❌ Konfigurasi Supabase tidak valid. Silakan cek environment variables.')
}

// Create Supabase client
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey)

// Database types for DIGCITY website
export interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  image_url?: string
  additional_images?: string[]
  category: string
  created_at: string
  updated_at: string
}

export interface News {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  published_date: string
  image_url?: string
  category: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Gallery {
  id: string
  title: string
  description: string
  image_url: string
  category: string
  event_date: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface Newsletter {
  id: string
  email: string
  subscribed_at: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Complaint {
  id: string
  created_at: string
  updated_at: string
  ticket_number: string
  category: string
  description: string
  anonymous: boolean
  name?: string | null
  npm?: string | null
  contact_email?: string | null
  attachments: string[]
  status: 'baru' | 'diproses' | 'selesai' | 'ditolak'
  response?: string | null
  response_at?: string | null
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FinanceTransaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  proof_url?: string
  created_by: string
  created_at: string
  updated_at: string
  status?: 'pending' | 'approved' | 'rejected'
  sub_account?: string | null
  budget_id?: string | null
}

export interface MemberDue {
  id: string
  member_id?: string | null
  member_name: string
  division: string
  amount: number
  due_date: string
  status: 'unpaid' | 'partial' | 'paid' | 'pending_verification'
  invoice_number: string
  notes?: string
  transaction_id?: string | null
  created_at: string
  proof_url?: string
  payment_method?: 'transfer' | 'cash'
  submitted_at?: string
}

export interface Document {
  id: string
  ticket_number: string
  title: string
  type: 'incoming' | 'outgoing' | 'report' | 'other'
  category: string
  date: string
  description?: string
  file_url?: string
  drive_link?: string
  version: number
  status: 'draft' | 'pending_review' | 'approved' | 'archived'
  created_by: string
  created_at: string
  updated_at: string
  sender?: string
  recipient?: string
  date_received?: string
}

export interface OrganizationMember {
  id: string
  full_name: string
  npm: string
  email: string | null
  phone?: string
  division: string
  position: string
  join_year: number
  status: 'active' | 'leave' | 'alumni' | 'resigned'
  image_url?: string
  linkedin_url?: string
  instagram_handle?: string
  gender?: 'male' | 'female' | 'other'
  class_category?: string
  class_name?: string
  city?: string
  province?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface OrganizationProfile {
  id: string
  name: string
  logo_url?: string
  period_start?: string
  period_end?: string
  owner_user_id?: string
  external_drive_url?: string
  payment_provider?: string
  backup_last_at?: string
  is_campaign_active?: boolean
  deleted_at?: string
  created_at: string
  updated_at: string
}

export interface OrganizationDivision {
  id: string
  name: string
  parent_id?: string | null
  order_index: number
  description?: string
  created_at: string
}

export const orgAPI = {
  async getProfile() {
    const { data, error } = await supabase.from('organization_profile').select('*').limit(1).single()
    if (error) throw error
    return data as OrganizationProfile
  },
  async updateProfile(updates: Partial<OrganizationProfile>) {
    const profile = await orgAPI.getProfile()
    const { data, error } = await supabase
      .from('organization_profile')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
      .select()
      .single()
    if (error) throw error
    return data as OrganizationProfile
  },
  async uploadLogo(file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `org-logo-${Date.now()}.${fileExt}`
    const filePath = `org/${fileName}`
    const { error: uploadError } = await supabase.storage.from('organization-documents').upload(filePath, file)
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from('organization-documents').getPublicUrl(filePath)
    await orgAPI.updateProfile({ logo_url: data.publicUrl })
    return data.publicUrl
  },
  async getStructure(parent_id: string | null = null) {
    let query = supabase
      .from('organization_structure')
      .select('*')
      .order('order_index', { ascending: true })
    query = parent_id === null ? query.is('parent_id', null) : query.eq('parent_id', parent_id)
    const { data, error } = await query
    if (error) throw error
    return data as OrganizationDivision[]
  },
  async createDivision(payload: Omit<OrganizationDivision, 'id' | 'created_at' | 'order_index'> & { order_index?: number }) {
    const { data, error } = await supabase
      .from('organization_structure')
      .insert([{ name: payload.name, parent_id: payload.parent_id ?? null, description: payload.description ?? null, order_index: payload.order_index ?? 0 }])
      .select()
      .single()
    if (error) throw error
    return data as OrganizationDivision
  },
  async updateDivision(id: string, updates: Partial<OrganizationDivision>) {
    const { data, error } = await supabase
      .from('organization_structure')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as OrganizationDivision
  },
  async deleteDivision(id: string) {
    const { error } = await supabase.from('organization_structure').delete().eq('id', id)
    if (error) throw error
  },
  async reorder(_parent_id: string | null, orderedIds: string[]) {
    let index = 0
    for (const id of orderedIds) {
      await supabase.from('organization_structure').update({ order_index: index }).eq('id', id)
      index++
    }
  },
  async softDeleteOrganization() {
    await orgAPI.updateProfile({ deleted_at: new Date().toISOString() })
  },
  async estafetKepengurusan(demisionerYear: number, newPeriodStart: string, newPeriodEnd: string) {
    // 1. Update old batch (demisionerYear) to position 'Demisioner'
    // We only update those who are currently 'active' to avoid messing up already resigned/alumni
    const { error: demisionerError } = await supabase
      .from('organization_members')
      .update({ position: 'Demisioner' })
      .eq('join_year', demisionerYear)
      .eq('status', 'active')

    if (demisionerError) throw demisionerError

    // 2. Update Organization Period
    await orgAPI.updateProfile({
      period_start: newPeriodStart,
      period_end: newPeriodEnd
    })

    return true
  }
}

export interface OrganizationPosition {
  id: string
  name: string
  order_index: number
  created_at: string
}

export const positionsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('organization_positions')
      .select('*')
      .order('order_index', { ascending: true })
    if (error) throw error
    return data as OrganizationPosition[]
  },
  async create(payload: Omit<OrganizationPosition, 'id' | 'created_at' | 'order_index'> & { order_index?: number }) {
    const { data, error } = await supabase
      .from('organization_positions')
      .insert([{ name: payload.name, order_index: payload.order_index ?? 0 }])
      .select()
      .single()
    if (error) throw error
    return data as OrganizationPosition
  },
  async update(id: string, updates: Partial<OrganizationPosition>) {
    const { data, error } = await supabase
      .from('organization_positions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as OrganizationPosition
  },
  async delete(id: string) {
    const { error } = await supabase.from('organization_positions').delete().eq('id', id)
    if (error) throw error
  },
  async reorder(orderedIds: string[]) {
    let index = 0
    for (const id of orderedIds) {
      await supabase.from('organization_positions').update({ order_index: index }).eq('id', id)
      index++
    }
  }
}

export interface InternalEvent {
  id: string
  title: string
  description: string
  date: string
  end_date?: string
  location: string
  division: string
  division_id?: string
  type: 'meeting' | 'work_program' | 'gathering' | 'other'
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  qr_code?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  event_id: string
  member_id?: string
  name: string
  npm: string
  status: 'present' | 'late' | 'excused' | 'absent'
  check_in_time: string
  notes?: string
  created_at: string
}

// API functions for Events
export const eventAPI = {
  // Get all events
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    return data as Event[]
  },

  // Get optimized upcoming events with minimal columns and limit
  async getUpcoming(limit: number = 6, columns: string = 'id,title,description,date,location,image_url,additional_images,category,created_at,updated_at') {
    // Gunakan presisi hari (YYYY-MM-DD) agar kompatibel dengan kolom DATE maupun TIMESTAMP
    const todayStr = new Date().toISOString().slice(0, 10); // e.g., 2025-09-07

    // Coba ambil upcoming (tanggal >= hari ini) urut naik
    const upcomingQuery = supabase
      .from('events')
      .select(columns)
      .gte('date', todayStr)
      .order('date', { ascending: true })
      .limit(limit);

    const { data, error } = await upcomingQuery;
    if (error) throw error;

    // Jika tidak ada upcoming, fallback ke event terbaru agar homepage tidak kosong
    if (!data || data.length === 0) {
      const { data: fallback, error: fbError } = await supabase
        .from('events')
        .select(columns)
        .order('date', { ascending: false })
        .limit(limit);

      if (fbError) throw fbError;
      return (fallback || []) as unknown as Event[];
    }

    return data as unknown as Event[];
  },

  // Get event by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Event
  },

  // Create new event
  async create(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single()

    if (error) throw error
    const createdEvent = data as Event
    await syncGalleryFromEvent(createdEvent).catch((err) => {
      console.warn('Failed to sync gallery from event create:', err)
    })
    return createdEvent
  },

  // Update event
  async update(id: string, updates: Partial<Event>) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    const updatedEvent = data as Event
    await syncGalleryFromEvent(updatedEvent).catch((err) => {
      console.warn('Failed to sync gallery from event update:', err)
    })
    return updatedEvent
  },

  // Delete event
  async delete(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) throw error
    await removeGallerySource('event', id).catch((err) => {
      console.warn('Failed to remove gallery entries for event delete:', err)
    })
  },

  // Subscribe to realtime changes on events table
  subscribeToChanges(handler: (payload: RealtimePostgresChangesPayload<Record<string, any>>) => void) {
    const channel = supabase
      .channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, handler)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }
}

// API functions for News
export const newsAPI = {
  // Get all news
  async getAll() {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_date', { ascending: false })

    if (error) throw error
    return data as News[]
  },

  // Get news by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as News
  },

  // Create new news
  async create(news: Omit<News, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('news')
      .insert([news])
      .select()
      .single()

    if (error) throw error
    const createdNews = data as News
    await syncGalleryFromNews(createdNews).catch((err) => {
      console.warn('Failed to sync gallery from news create:', err)
    })
    return createdNews
  },

  // Update news
  async update(id: string, updates: Partial<News>) {
    const { data, error } = await supabase
      .from('news')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    const updatedNews = data as News
    await syncGalleryFromNews(updatedNews).catch((err) => {
      console.warn('Failed to sync gallery from news update:', err)
    })
    return updatedNews
  },

  // Delete news
  async delete(id: string) {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)

    if (error) throw error
    await removeGallerySource('news', id).catch((err) => {
      console.warn('Failed to remove gallery entries for news delete:', err)
    })
  }
}

// API functions for Gallery
export const galleryAPI = {
  // Get all gallery items
  async getAll() {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('event_date', { ascending: false })

    if (error) throw error
    return data as Gallery[]
  },

  // Get gallery by category
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('category', category)
      .order('event_date', { ascending: false })

    if (error) throw error
    return data as Gallery[]
  },

  // Create new gallery item
  async create(gallery: Omit<Gallery, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('gallery')
      .insert([gallery])
      .select()
      .single()

    if (error) throw error
    return data as Gallery
  },

  // Update gallery item
  async update(id: string, updates: Partial<Gallery>) {
    const { data, error } = await supabase
      .from('gallery')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Gallery
  },

  // Delete gallery item
  async delete(id: string) {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// API functions for Finance
export const financeAPI = {
  // Get all transactions
  async getAll() {
    let allData: FinanceTransaction[] = []
    let page = 0
    const pageSize = 1000
    while (true) {
      const { data, error } = await supabase
        .from('finance_transactions')
        .select('*')
        .order('date', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1)

      if (error) throw error
      if (!data || data.length === 0) break

      allData = [...allData, ...data] as FinanceTransaction[]
      if (data.length < pageSize) break
      page++
    }
    return allData
  },

  // Get balance summary
  async getSummary() {
    const { data, error } = await supabase
      .from('finance_transactions')
      .select('type, amount, status')

    if (error) throw error

    // Only count approved transactions for balance
    const approvedTransactions = data.filter(t => t.status === 'approved' || !t.status)

    const income = approvedTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
    const expense = approvedTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    }
  },

  // Create transaction
  async create(transaction: Omit<FinanceTransaction, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('finance_transactions')
      .insert([transaction])
      .select()
      .single()

    if (error) throw error
    return data as FinanceTransaction
  },

  // Update transaction
  async update(id: string, updates: Partial<FinanceTransaction>) {
    const { data, error } = await supabase
      .from('finance_transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as FinanceTransaction
  },

  // Delete transaction
  async delete(id: string) {
    const { error } = await supabase
      .from('finance_transactions')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Upload proof file
  async uploadProof(file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `proofs/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('finance-proofs')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('finance-proofs')
      .getPublicUrl(filePath)

    return data.publicUrl
  },

  // Bulk create transactions
  async bulkCreate(transactions: Omit<FinanceTransaction, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data, error } = await supabase
      .from('finance_transactions')
      .insert(transactions)
      .select()

    if (error) throw error
    return data as FinanceTransaction[]
  }
}

export const duesAPI = {
  async getAll() {
    let allData: MemberDue[] = []
    let page = 0
    const pageSize = 1000
    while (true) {
      const { data, error } = await supabase
        .from('member_dues')
        .select('*')
        .order('due_date', { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1)

      if (error) throw error
      if (!data || data.length === 0) break

      allData = [...allData, ...data] as MemberDue[]
      if (data.length < pageSize) break
      page++
    }
    return allData
  },

  async create(due: Omit<MemberDue, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('member_dues')
      .insert([due])
      .select()
      .single()

    if (error) throw error
    return data as MemberDue
  },

  async update(id: string, updates: Partial<MemberDue>) {
    const { data, error } = await supabase
      .from('member_dues')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as MemberDue
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('member_dues')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getByMemberId(memberId: string) {
    const { data, error } = await supabase
      .from('member_dues')
      .select('*')
      .eq('member_id', memberId)
      .order('due_date', { ascending: true })

    if (error) throw error
    return data as MemberDue[]
  }
}

// API functions for Documents
const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

const buildTicketNumber = () => {
  const today = new Date()
  const year = today.getFullYear()
  const monthRoman = romanMonths[today.getMonth()]
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${rand}/SEK/DIGCITY-FEB/${monthRoman}/${year}`
}

export const documentsAPI = {
  generateTicketNumber() {
    return buildTicketNumber()
  },

  // Get next sequential ticket number
  async getNextTicketNumber() {
    const { data, error } = await supabase
      .from('organization_documents')
      .select('ticket_number')
      .ilike('ticket_number', '%/SEK/DIGCITY-FEB/%')
      // We fetch more than 1 to be safe, but sorting by created_at desc should give us recent ones.
      // However, to be strictly sequential based on the number, we should parse them.
      // But for now, let's assume the latest created is likely the highest number or close to it.
      // Better to fetch all from current year if possible, but let's limit to 100 recent.
      .order('ticket_number', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching ticket numbers:', error)
      return buildTicketNumber() // Fallback
    }

    let maxNum = 0
    const currentYear = new Date().getFullYear()

    data.forEach((doc) => {
      // Format: XXX/SEK/DIGCITY-FEB/ROMAN/YEAR
      const parts = doc.ticket_number.split('/')
      if (parts.length >= 5) {
        const num = parseInt(parts[0], 10)
        // Check if it matches the current year to reset sequence if needed? 
        // User didn't specify reset, but usually it resets yearly. 
        // Let's assume we want to continue sequence for the year.
        // The format has year at index 4.
        const yearStr = parts[4] // 2025
        const year = parseInt(yearStr, 10)

        if (!isNaN(num) && year === currentYear) {
          if (num > maxNum) maxNum = num
        }
      }
    })

    const nextNum = (maxNum + 1).toString().padStart(3, '0')
    const today = new Date()
    const monthRoman = romanMonths[today.getMonth()]
    return `${nextNum}/SEK/DIGCITY-FEB/${monthRoman}/${currentYear}`
  },

  // Get all documents
  async getAll() {
    const { data, error } = await supabase
      .from('organization_documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Document[]
  },

  // Create document
  async create(doc: Omit<Document, 'id' | 'created_at' | 'updated_at'> & { ticket_number?: string }) {
    const ticketNumber = doc.ticket_number ?? buildTicketNumber()
    const version = doc.version ?? 1

    const { data, error } = await supabase
      .from('organization_documents')
      .insert([{ ...doc, ticket_number: ticketNumber, version }])
      .select()
      .single()

    if (error) throw error
    return data as Document
  },

  async getHistory(ticketNumber: string) {
    const { data, error } = await supabase
      .from('organization_documents')
      .select('*')
      .eq('ticket_number', ticketNumber)
      .order('version', { ascending: false })

    if (error) throw error
    return data as Document[]
  },

  // Update document
  async update(id: string, updates: Partial<Document>) {
    const { data, error } = await supabase
      .from('organization_documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Document
  },

  // Delete document
  async delete(id: string) {
    const { error } = await supabase
      .from('organization_documents')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Upload document file
  async uploadFile(file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `docs/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('organization-documents')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('organization-documents')
      .getPublicUrl(filePath)

    return data.publicUrl
  }
}

// API functions for Organization Members
export const membersAPI = {
  // Get all members
  async getAll() {
    const { data, error } = await supabase
      .from('organization_members')
      .select('*')
      .order('full_name', { ascending: true })
      .limit(5000)

    if (error) throw error
    return data as OrganizationMember[]
  },

  // Get email by NPM (secure)
  async getEmailByNpm(npm: string) {
    const { data, error } = await supabase.rpc('get_member_email_by_npm', { npm_input: npm })
    if (error) throw error
    return data as string | null
  },

  // Get member by email (secure)
  async getMemberByEmail(email: string) {
    const { data, error } = await supabase.rpc('get_member_by_email', { email_input: email })
    if (error) throw error
    return data as OrganizationMember | null
  },

  // Get member by NPM (secure)
  async getMemberByNpm(npm: string) {
    const { data, error } = await supabase.rpc('get_member_by_npm', { npm_input: npm })
    if (error) throw error
    return data as OrganizationMember | null
  },

  // Update email if empty (secure)
  async updateEmailIfEmpty(memberId: string, newEmail: string) {
    const { data, error } = await supabase.rpc('update_member_email_if_empty', { member_id: memberId, new_email: newEmail })
    if (error) throw error
    return data as boolean
  },
  // Create member
  async create(member: Omit<OrganizationMember, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('organization_members')
      .insert([member])
      .select()
      .single()

    if (error) throw error
    return data as OrganizationMember
  },

  // Update member
  async update(id: string, updates: Partial<OrganizationMember>) {
    const { data, error } = await supabase
      .from('organization_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as OrganizationMember
  },

  // Delete member
  async delete(id: string) {
    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Upload member photo
  async uploadPhoto(file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `profiles/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('member-photos')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('member-photos')
      .getPublicUrl(filePath)

    return data.publicUrl
  }
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  condition: 'good' | 'repair_needed' | 'broken'
  acquisition_date?: string
  price: number
  location?: string
  image_url?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export const inventoryAPI = {
  list: async () => {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as InventoryItem[]
  },

  create: async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert([item])
      .select()
      .single()
    if (error) throw error
    return data as InventoryItem
  },

  update: async (id: string, updates: Partial<InventoryItem>) => {
    const { data, error } = await supabase
      .from('inventory_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as InventoryItem
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },

  uploadImage: async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `inventory/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('documents') // Reusing documents bucket for now, or create 'inventory' bucket if preferred
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('documents').getPublicUrl(filePath)
    return data.publicUrl
  }
}


export interface MemberSanction {
  id: string
  member_id: string
  sanction_status: 'none' | 'baik' | 'warning' | 'probation' | 'suspended' | 'terminated'
  sanction_date?: string
  reason?: string
  fix_date?: string
  fix_action?: string
  followup_status?: string
  created_at: string
}

export const memberSanctionsAPI = {
  async create(s: Omit<MemberSanction, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('member_sanctions')
      .insert([s])
      .select()
      .single()
    if (error) throw error
    return data as MemberSanction
  },
  async listByMember(member_id: string) {
    const { data, error } = await supabase
      .from('member_sanctions')
      .select('*')
      .eq('member_id', member_id)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as MemberSanction[]
  }
}

// API functions for Attendance & Events
const createQrPayload = () => `DIGCITY-${Math.random().toString(36).substring(2, 12).toUpperCase()}`

export const attendanceAPI = {
  // Get all internal events
  async getEvents() {
    const { data, error } = await supabase
      .from('internal_events')
      .select('*')
      .order('date', { ascending: false })
      .limit(10000)

    if (error) throw error
    return data as InternalEvent[]
  },

  // Create internal event
  async createEvent(event: Omit<InternalEvent, 'id' | 'created_at' | 'updated_at' | 'qr_code'>) {
    // Generate QR code string
    const qrCode = createQrPayload()

    const { data, error } = await supabase
      .from('internal_events')
      .insert([{ ...event, qr_code: qrCode }])
      .select()
      .single()

    if (error) throw error
    return data as InternalEvent
  },

  // Refresh QR code for dynamic QR session
  async refreshQrCode(eventId: string) {
    const refreshedCode = createQrPayload()
    const { data, error } = await supabase
      .from('internal_events')
      .update({ qr_code: refreshedCode, updated_at: new Date().toISOString() })
      .eq('id', eventId)
      .select('qr_code')
      .single()

    if (error) throw error
    return data.qr_code as string
  },

  // Delete internal event
  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('internal_events')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Update internal event
  async updateEvent(id: string, updates: Partial<InternalEvent>) {
    const { data, error } = await supabase
      .from('internal_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as InternalEvent
  },

  // Record attendance
  async recordAttendance(attendance: Omit<Attendance, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('attendance')
      .insert([attendance])
      .select()
      .single()

    if (error) throw error
    return data as Attendance
  },

  // Get event attendance
  async getEventAttendance(eventId: string) {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('event_id', eventId)
      .order('check_in_time', { ascending: true })
      .limit(50000)

    if (error) throw error
    return data as Attendance[]
  },

  // Recent attendance entries for analytics
  async getRecentAttendance(rangeDays: number = 90) {
    const since = new Date()
    since.setDate(since.getDate() - rangeDays)

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .gte('check_in_time', since.toISOString())
      .limit(50000)

    if (error) throw error
    return data as Attendance[]
  }
}

// Authentication functions
export const authAPI = {
  // Sign in
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Check if user is admin - dengan fallback untuk tabel users yang tidak ada
  async isAdmin() {
    try {
      const user = await this.getCurrentUser()
      if (!user) return false

      // Primary: cek dari user metadata (lebih reliable)
      const isAdminFromMetadata = this.checkAdminFromMetadata(user)
      if (isAdminFromMetadata) {
        return true
      }

      // Fallback: coba cek dari tabel users jika ada
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.warn('Users table not accessible, using metadata only:', error)
          return false
        }

        return data.role === 'admin'
      } catch (tableError) {
        console.warn('Users table not accessible, using metadata only:', tableError)
        return false
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  },

  // Fallback method untuk cek admin dari user metadata
  checkAdminFromMetadata(user: any): boolean {
    try {
      // Cek dari user metadata atau app_metadata
      const userRole = user.user_metadata?.role || user.app_metadata?.role
      return userRole === 'admin'
    } catch (error) {
      console.warn('Error checking metadata:', error)
      return false
    }
  }
}

// UPM Types
export interface UPMAllocation {
  id: string
  period: string
  total_amount: number
  start_date: string
  end_date: string
  created_at: string
}

export interface UPMRequest {
  id: string
  allocation_id: string
  program_id?: string
  description: string
  amount_proposed: number
  amount_approved?: number
  status: 'pending' | 'approved' | 'rejected' | 'disbursed'
  submission_date: string
  disbursement_date?: string
  created_at: string
  // Joins
  internal_events?: {
    title: string
  }
}

// UPM API
export const upmAPI = {
  // Allocations
  async getAllocations() {
    const { data, error } = await supabase
      .from('upm_allocations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as UPMAllocation[]
  },

  async createAllocation(allocation: Omit<UPMAllocation, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('upm_allocations')
      .insert(allocation)
      .select()
      .single()

    if (error) throw error
    return data as UPMAllocation
  },

  async updateAllocation(id: string, updates: Partial<UPMAllocation>) {
    const { data, error } = await supabase
      .from('upm_allocations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as UPMAllocation
  },

  // Requests
  async getRequests(allocationId: string) {
    const { data, error } = await supabase
      .from('upm_requests')
      .select('*, internal_events(title)')
      .eq('allocation_id', allocationId)
      .order('submission_date', { ascending: false })

    if (error) throw error
    return data as UPMRequest[]
  },

  async createRequest(request: Omit<UPMRequest, 'id' | 'created_at' | 'status'>) {
    const { data, error } = await supabase
      .from('upm_requests')
      .insert({ ...request, status: 'pending' })
      .select()
      .single()

    if (error) throw error
    return data as UPMRequest
  },

  async updateRequestStatus(id: string, status: UPMRequest['status'], amount_approved?: number, disbursement_date?: string) {
    const updates: any = { status }
    if (amount_approved !== undefined) updates.amount_approved = amount_approved
    if (disbursement_date !== undefined) updates.disbursement_date = disbursement_date

    const { data, error } = await supabase
      .from('upm_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as UPMRequest
  },

  async deleteRequest(id: string) {
    const { error } = await supabase
      .from('upm_requests')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Newsletter API
export const newsletterAPI = {
  // Subscribe to newsletter
  async subscribe(email: string) {
    const { data, error } = await supabase
      .from('newsletter')
      .insert([{ email }])
      .select()
      .single()

    if (error) {
      // Check if email already exists
      if (error.code === '23505') {
        throw new Error('Email sudah terdaftar dalam newsletter')
      }
      throw error
    }
    return data
  },

  // Unsubscribe from newsletter
  async unsubscribe(email: string) {
    const { data, error } = await supabase
      .from('newsletter')
      .update({ is_active: false })
      .eq('email', email)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get all active subscribers (admin only)
  async getAllSubscribers() {
    const { data, error } = await supabase
      .from('newsletter')
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get subscriber count
  async getSubscriberCount() {
    const { count, error } = await supabase
      .from('newsletter')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    if (error) throw error
    return count || 0
  },

  // Check if email is subscribed
  async isSubscribed(email: string) {
    const { data, error } = await supabase
      .from('newsletter')
      .select('is_active')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return false // No rows found
      throw error
    }
    return data.is_active
  }
}

export const complaintsAPI = {
  async submit(payload: {
    category: string
    description: string
    anonymous?: boolean
    name?: string
    npm?: string
    contact_email?: string
    attachments?: string[]
  }): Promise<{ ticket_number: string }> {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const rand = Math.random().toString(36).slice(2, 8)
    const ticketNumber = `KEL-${yyyy}${mm}${dd}-${rand}`

    const record = {
      ticket_number: ticketNumber,
      category: payload.category,
      description: payload.description,
      anonymous: !!payload.anonymous,
      name: payload.anonymous ? null : payload.name || null,
      npm: payload.anonymous ? null : payload.npm || null,
      contact_email: payload.anonymous ? null : payload.contact_email || null,
      attachments: Array.isArray(payload.attachments) ? payload.attachments : []
    }
    const { error } = await supabase
      .from('complaints')
      .insert([record])
    if (error) throw error
    return { ticket_number: ticketNumber }
  },
  async list(filters?: {
    category?: string
    status?: 'baru' | 'diproses' | 'selesai' | 'ditolak'
    from?: string
    to?: string
  }) {
    let query = supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false })
    if (filters?.category) query = query.eq('category', filters.category)
    if (filters?.status) query = query.eq('status', filters.status)
    if (filters?.from) query = query.gte('created_at', filters.from)
    if (filters?.to) query = query.lte('created_at', filters.to)
    const { data, error } = await query
    if (error) throw error
    return data as Complaint[]
  },
  async updateStatus(id: string, status: 'baru' | 'diproses' | 'selesai' | 'ditolak') {
    const { data, error } = await supabase
      .from('complaints')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Complaint
  },
  async getByTicket(ticket: string) {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('ticket_number', ticket)
      .single()
    if (error) throw error
    return data as Complaint
  },
  async checkStatus(ticket: string) {
    const { data, error } = await supabase.rpc('get_complaint_status', { ticket })
    if (error) throw error
    return Array.isArray(data) && data.length > 0 ? data[0] as { ticket_number: string; status: string; category: string; created_at: string; anonymous: boolean; response?: string; response_at?: string } : null
  },
  async respond(id: string, response: string) {
    const { data, error } = await supabase
      .from('complaints')
      .update({
        response,
        response_at: new Date().toISOString(),
        status: 'selesai' // Auto set to selesai if responded? Or keep as is? Let's assume responding usually means addressing it. But maybe 'diproses'. Let's just update response and let admin toggle status manually if needed, OR auto-update. 
        // User said "setelah mereka mengadu kita memberikan silaturahmi transparansi Wah jawabannya itu seperti apa Dan apakah sudah diselesaikan Apakah ditolak atau diterima".
        // Often response implies completion or at least processing. Let's just update the response fields for now to be safe, admin can change status separately or we can bundle it.
        // Let's just update response fields.
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Complaint
  }
}

// Audit Logging & Notifications
export interface AuditLog {
  id: string
  user_id: string
  module: 'members' | 'finance' | 'attendance' | 'documents' | 'linktree' | 'system'
  action: string
  entity_type?: string
  entity_id?: string
  details?: Record<string, unknown>
  created_at: string
}

export interface NotificationItemDB {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message?: string
  module?: string
  user_id?: string
  created_at: string
  read_at?: string | null
}

export const auditAPI = {
  async log(entry: Omit<AuditLog, 'id' | 'created_at' | 'user_id'> & { entity_id?: string }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id || 'anonymous'
      const payload = {
        user_id: userId,
        module: entry.module,
        action: entry.action,
        entity_type: entry.entity_type || null,
        entity_id: entry.entity_id || null,
        details: entry.details || {},
        created_at: new Date().toISOString()
      }
      const { error } = await supabase.from('audit_logs').insert([payload])
      if (error) {
        console.warn('Audit log insert failed:', error.message)
      }
    } catch (err) {
      console.warn('Audit log error:', err)
    }
  },
  async list(filters?: { module?: AuditLog['module']; action?: string; from?: string; to?: string; limit?: number }) {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
      if (filters?.module) query = query.eq('module', filters.module)
      if (filters?.action) query = query.eq('action', filters.action)
      if (filters?.from) query = query.gte('created_at', filters.from)
      if (filters?.to) query = query.lte('created_at', filters.to)
      if (filters?.limit) query = query.limit(filters.limit)
      const { data, error } = await query
      if (error) throw error
      return data as AuditLog[]
    } catch (err) {
      console.warn('Audit list error:', err)
      return []
    }
  }
}

export const notificationsAPI = {
  async create(item: Omit<NotificationItemDB, 'id' | 'created_at'>) {
    try {
      const payload = {
        ...item,
        created_at: new Date().toISOString()
      }
      const { data, error } = await supabase
        .from('notifications')
        .insert([payload])
        .select()
        .single()
      if (error) throw error
      return data as NotificationItemDB
    } catch (err) {
      console.warn('Notifications insert error:', err)
      return null
    }
  },
  async list(filters?: { module?: string; user_id?: string; unreadOnly?: boolean; limit?: number }) {
    try {
      let query = supabase.from('notifications').select('*').order('created_at', { ascending: false })
      if (filters?.module) query = query.eq('module', filters.module)
      if (filters?.user_id) query = query.eq('user_id', filters.user_id)
      if (filters?.unreadOnly) query = query.is('read_at', null)
      if (filters?.limit) query = query.limit(filters.limit)
      const { data, error } = await query
      if (error) throw error
      return data as NotificationItemDB[]
    } catch (err) {
      console.warn('Notifications list error:', err)
      return []
    }
  },
  async markRead(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    } catch (err) {
      console.warn('Notifications markRead error:', err)
    }
  }
}

type GallerySourceType = 'event' | 'news'

const buildSourceTag = (sourceType: GallerySourceType, sourceId: string) => `source:${sourceType}:${sourceId}`

const normalizeDateOnly = (value?: string | null) => {
  if (!value) return new Date().toISOString().slice(0, 10)
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10)
  }
  return date.toISOString().slice(0, 10)
}

const syncGalleryEntries = async (options: {
  sourceType: GallerySourceType
  sourceId: string
  images: string[]
  title: string
  description?: string
  category?: string
  date?: string
}) => {
  const { sourceType, sourceId, images, title, description, category, date } = options
  if (!images || images.length === 0) return

  const sourceTag = buildSourceTag(sourceType, sourceId)
  await supabase
    .from('gallery')
    .delete()
    .contains('tags', [sourceTag])

  const today = new Date().toISOString()
  const rows = images.map((imageUrl) => ({
    title: title || 'Dokumentasi DIGCITY',
    description: description || title || 'Dokumentasi kegiatan DIGCITY',
    image_url: imageUrl,
    category: category || (sourceType === 'news' ? 'Berita' : 'Event'),
    event_date: normalizeDateOnly(date),
    tags: [sourceTag],
    created_at: today,
    updated_at: today
  }))

  const { error } = await supabase.from('gallery').insert(rows)
  if (error) throw error
}

const removeGallerySource = async (sourceType: GallerySourceType, sourceId: string) => {
  const sourceTag = buildSourceTag(sourceType, sourceId)
  const { error } = await supabase
    .from('gallery')
    .delete()
    .contains('tags', [sourceTag])
  if (error) throw error
}

const syncGalleryFromEvent = async (event: Event) => {
  if (!event?.id) return
  const imagesSet = new Set<string>()
  if (event.image_url) imagesSet.add(event.image_url)
  if (Array.isArray(event.additional_images)) {
    event.additional_images.filter(Boolean).forEach((img) => imagesSet.add(img))
  }
  const images = Array.from(imagesSet)
  if (images.length === 0) return

  await syncGalleryEntries({
    sourceType: 'event',
    sourceId: event.id,
    images,
    title: event.title,
    description: event.description,
    category: event.category,
    date: event.date
  })
}

const syncGalleryFromNews = async (news: News) => {
  if (!news?.id || !news.image_url) return
  await syncGalleryEntries({
    sourceType: 'news',
    sourceId: news.id,
    images: [news.image_url],
    title: news.title,
    description: news.excerpt || news.content,
    category: news.category,
    date: news.published_date
  })
}
export interface WorkProgramBudget {
  id: string
  program_id: string
  item_name: string
  unit_price: number
  quantity: number
  total_price: number
  status: 'planned' | 'approved' | 'rejected'
  category: string
  created_at: string
  updated_at: string
}

// API functions for Budgets
export const budgetAPI = {
  // Get budgets by program ID
  async getBudgets(programId: string) {
    const { data, error } = await supabase
      .from('work_program_budgets')
      .select('*')
      .eq('program_id', programId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as WorkProgramBudget[]
  },

  // Create budget item
  async create(budget: Omit<WorkProgramBudget, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('work_program_budgets')
      .insert([budget])
      .select()
      .single()

    if (error) throw error
    return data as WorkProgramBudget
  },

  // Update budget item
  async update(id: string, updates: Partial<WorkProgramBudget>) {
    const { data, error } = await supabase
      .from('work_program_budgets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as WorkProgramBudget
  },

  // Delete budget item
  async delete(id: string) {
    const { error } = await supabase
      .from('work_program_budgets')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Bulk create budget items
  async bulkCreate(items: Omit<WorkProgramBudget, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data, error } = await supabase
      .from('work_program_budgets')
      .insert(items)
      .select()

    if (error) throw error
    return data as WorkProgramBudget[]
  }
}

export interface MemberKPI {
  id: string
  member_id: string
  period: string
  attendance_score: number
  project_score: number
  attitude_score: number
  skill_score: number
  final_score: number
  grade: string
  notes: string
  created_at: string
  updated_at: string
  member?: OrganizationMember
}

export const kpiAPI = {
  async getByPeriod(period: string) {
    const { data, error } = await supabase
      .from('member_kpi')
      .select('*, member:organization_members(*)')
      .eq('period', period)

    if (error) throw error
    return data as MemberKPI[]
  },

  async upsert(kpi: Partial<MemberKPI>) {
    // Calculate final score and grade before saving
    const attendance = kpi.attendance_score || 0
    const project = kpi.project_score || 0
    const attitude = kpi.attitude_score || 0
    const skill = kpi.skill_score || 0

    // Weighting: Attendance 15%, Project 40%, Attitude 30%, Skill 15%
    const final_score = (attendance * 0.15) + (project * 0.40) + (attitude * 0.30) + (skill * 0.15)

    let grade = 'E'
    if (final_score >= 95) grade = 'A+'
    else if (final_score >= 85) grade = 'A'
    else if (final_score >= 80) grade = 'B+'
    else if (final_score >= 75) grade = 'B'
    else if (final_score >= 70) grade = 'C+'
    else if (final_score >= 60) grade = 'C'
    else if (final_score >= 55) grade = 'D+'
    else if (final_score >= 50) grade = 'D'

    const dataToSave = {
      ...kpi,
      final_score,
      grade,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('member_kpi')
      .upsert(dataToSave)
      .select()
      .single()

    if (error) throw error
    return data as MemberKPI
  }
}
