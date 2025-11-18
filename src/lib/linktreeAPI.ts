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

  // Subscribe to realtime changes on all LinkTree tables
  subscribeToChanges(handler: (type: 'linktree' | 'links' | 'social' | 'contact', payload: any) => void) {
    const channel = supabase
      .channel('linktree-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'linktree' }, (payload) => handler('linktree', payload))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'linktree_links' }, (payload) => handler('links', payload))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'linktree_social_links' }, (payload) => handler('social', payload))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'linktree_contact_info' }, (payload) => handler('contact', payload))
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  // Delete all links for a linktree
  async deleteAllLinks(linktreeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('linktree_links')
        .delete()
        .eq('linktree_id', linktreeId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting all links:', error)
      return false
    }
  }

  // Delete all social links for a linktree
  async deleteAllSocialLinks(linktreeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('linktree_social_links')
        .delete()
        .eq('linktree_id', linktreeId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting all social links:', error)
      return false
    }
  }

  // Delete all contact info for a linktree
  async deleteAllContactInfo(linktreeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('linktree_contact_info')
        .delete()
        .eq('linktree_id', linktreeId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting all contact info:', error)
      return false
    }
  }

  // Reset linktree content (links, social links, contact info)
  async resetLinktreeContent(): Promise<boolean> {
    try {
      const linktree = await this.getMainLinktree()
      const linktreeId = linktree?.id || 'main'

      const [linksOk, socialsOk, contactsOk] = await Promise.all([
        this.deleteAllLinks(linktreeId),
        this.deleteAllSocialLinks(linktreeId),
        this.deleteAllContactInfo(linktreeId)
      ])

      return !!(linksOk && socialsOk && contactsOk)
    } catch (error) {
      console.error('Error resetting linktree content:', error)
      return false
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
      // Ensure target exists to avoid false success
      const { data: existing, error: existErr } = await supabase
        .from('linktree')
        .select('id')
        .eq('id', id)
        .maybeSingle()

      if (existErr) throw existErr
      if (!existing) return false

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
      const { data: existing, error: existErr } = await supabase
        .from('linktree_links')
        .select('id')
        .eq('id', id)
        .maybeSingle()

      if (existErr) throw existErr
      if (!existing) return false

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
      const { data: existing, error: existErr } = await supabase
        .from('linktree_social_links')
        .select('id')
        .eq('id', id)
        .maybeSingle()

      if (existErr) throw existErr
      if (!existing) return false

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
      const { data: existing, error: existErr } = await supabase
        .from('linktree_contact_info')
        .select('id')
        .eq('id', id)
        .maybeSingle()

      if (existErr) throw existErr
      if (!existing) return false

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
      const linktree = await this.getMainLinktree()
      const linktreeId = linktree?.id || 'main'

      const [links, socialLinks, contactInfo] = await Promise.all([
        this.getLinks(linktreeId),
        this.getSocialLinks(linktreeId),
        this.getContactInfo(linktreeId)
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
