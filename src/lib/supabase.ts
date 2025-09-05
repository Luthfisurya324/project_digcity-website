import { createClient } from '@supabase/supabase-js'
import { supabaseConfig, validateSupabaseConfig } from '../config/supabaseConfig'

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
    return data as Event
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
    return data as Event
  },

  // Delete event
  async delete(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    
    if (error) throw error
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
    return data as News
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
    return data as News
  },

  // Delete news
  async delete(id: string) {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)
    
    if (error) throw error
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