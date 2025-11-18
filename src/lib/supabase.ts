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

export interface User {
  id: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string
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
      return (fallback || []) as Event[];
    }

    return data as Event[];
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