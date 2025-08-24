import { supabase } from './supabase'

export interface LinktreeData {
  id: string
  title: string
  subtitle?: string
  avatar?: string
  description?: string
  theme: any
  seo: any
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LinktreeLink {
  id: string
  linktree_id: string
  href: string
  title: string
  description?: string
  icon?: string
  variant: string
  is_external: boolean
  is_active: boolean
  order_index: number
}

export interface SocialLink {
  id: string
  linktree_id: string
  platform: string
  value: string
  href: string
  is_active: boolean
}

export interface ContactInfo {
  id: string
  linktree_id: string
  platform: string
  value: string
  href?: string
  is_active: boolean
}

class LinktreeAPI {
  // Get main linktree data
  async getMainLinktree(): Promise<LinktreeData | null> {
    try {
      const { data, error } = await supabase
        .from('linktree')
        .select('*')
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching main linktree:', error)
      return null
    }
  }

  // Get all links for a linktree
  async getLinks(linktreeId: string): Promise<LinktreeLink[]> {
    try {
      const { data, error } = await supabase
        .from('linktree_links')
        .select('*')
        .eq('linktree_id', linktreeId)
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching links:', error)
      return []
    }
  }

  // Get all social links for a linktree
  async getSocialLinks(linktreeId: string): Promise<SocialLink[]> {
    try {
      const { data, error } = await supabase
        .from('linktree_social_links')
        .select('*')
        .eq('linktree_id', linktreeId)
        .eq('is_active', true)
        .order('platform', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching social links:', error)
      return []
    }
  }

  // Get all contact info for a linktree
  async getContactInfo(linktreeId: string): Promise<ContactInfo[]> {
    try {
      const { data, error } = await supabase
        .from('linktree_contact_info')
        .select('*')
        .eq('linktree_id', linktreeId)
        .eq('is_active', true)
        .order('platform', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching contact info:', error)
      return []
    }
  }

  // Update main linktree data
  async updateLinktree(id: string, updates: Partial<LinktreeData>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('linktree')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating linktree:', error)
      return false
    }
  }

  // Add new link
  async addLink(link: Omit<LinktreeLink, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('linktree_links')
        .insert({
          ...link,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error('Error adding link:', error)
      return null
    }
  }

  // Update link
  async updateLink(id: string, updates: Partial<LinktreeLink>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('linktree_links')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating link:', error)
      return false
    }
  }

  // Delete link
  async deleteLink(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('linktree_links')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting link:', error)
      return false
    }
  }

  // Add new social link
  async addSocialLink(social: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('linktree_social_links')
        .insert({
          ...social,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error('Error adding social link:', error)
      return null
    }
  }

  // Update social link
  async updateSocialLink(id: string, updates: Partial<SocialLink>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('linktree_social_links')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating social link:', error)
      return false
    }
  }

  // Delete social link
  async deleteSocialLink(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('linktree_social_links')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting social link:', error)
      return false
    }
  }

  // Add new contact info
  async addContactInfo(contact: Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('linktree_contact_info')
        .insert({
          ...contact,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error('Error adding contact info:', error)
      return null
    }
  }

  // Update contact info
  async updateContactInfo(id: string, updates: Partial<ContactInfo>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('linktree_contact_info')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating contact info:', error)
      return false
    }
  }

  // Delete contact info
  async deleteContactInfo(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('linktree_contact_info')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting contact info:', error)
      return false
    }
  }

  // Reorder links
  async reorderLinks(linkIds: string[]): Promise<boolean> {
    try {
      const updates = linkIds.map((id, index) => ({
        id,
        order_index: index
      }))

      const { error } = await supabase
        .from('linktree_links')
        .upsert(updates, { onConflict: 'id' })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error reordering links:', error)
      return false
    }
  }

  // Get all linktree data in one call
  async getAllLinktreeData(): Promise<{
    linktree: LinktreeData | null
    links: LinktreeLink[]
    socialLinks: SocialLink[]
    contactInfo: ContactInfo[]
  }> {
    try {
      const [linktree, links, socialLinks, contactInfo] = await Promise.all([
        this.getMainLinktree(),
        this.getLinks('main'), // Assuming main linktree ID
        this.getSocialLinks('main'),
        this.getContactInfo('main')
      ])

      return {
        linktree,
        links,
        socialLinks,
        contactInfo
      }
    } catch (error) {
      console.error('Error fetching all linktree data:', error)
      return {
        linktree: null,
        links: [],
        socialLinks: [],
        contactInfo: []
      }
    }
  }
}

export const linktreeAPI = new LinktreeAPI()
