/**
 * Utility functions untuk mengelola folder structure di Supabase Storage
 * Membuat folder otomatis berdasarkan konten yang diupload
 */

import { supabase } from '../lib/supabase'

export interface FolderStructure {
  bucketName: string
  mainFolder: string
  subFolder: string
  fullPath: string
}

/**
 * Generate folder path berdasarkan konten
 */
export const generateFolderPath = (
  contentType: 'events' | 'blog' | 'gallery' | 'news' | 'other',
  contentTitle: string,
  bucketName: string = 'admin-images'
): FolderStructure => {
  // Clean content title untuk folder name yang valid
  const cleanTitle = contentTitle
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .toLowerCase()

  const mainFolder = contentType
  const subFolder = cleanTitle
  const fullPath = `${mainFolder}/${subFolder}`

  return {
    bucketName,
    mainFolder,
    subFolder,
    fullPath
  }
}

/**
 * Create folder structure di Supabase Storage
 * Note: Supabase Storage tidak memerlukan explicit folder creation
 * Folder akan dibuat otomatis saat file diupload
 */
export const ensureFolderExists = async (
  bucketName: string = 'admin-images'
): Promise<boolean> => {
  try {
    // Supabase Storage tidak memerlukan explicit folder creation
    // Folder akan dibuat otomatis saat file diupload
    // Kita hanya perlu memastikan bucket ada dan accessible
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.error('Error checking buckets:', error)
      return false
    }

    const bucketExists = buckets.some(bucket => bucket.name === bucketName)
    if (!bucketExists) {
      console.error(`Bucket '${bucketName}' tidak ditemukan`)
      return false
    }

    return true
  } catch (error) {
    console.error('Error ensuring folder exists:', error)
    return false
  }
}

/**
 * Upload file ke folder yang sesuai
 */
export const uploadToFolder = async (
  file: File,
  contentType: 'events' | 'blog' | 'gallery' | 'news' | 'other',
  contentTitle: string,
  bucketName: string = 'admin-images'
): Promise<{ success: boolean; path?: string; error?: string }> => {
  try {
    // Generate folder path
    const folderStructure = generateFolderPath(contentType, contentTitle, bucketName)
    
    // Skip bucket validation for now - try direct upload
    console.log('Attempting upload to bucket:', bucketName)
    console.log('Folder structure:', folderStructure)
    
    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`
    
    // Full path untuk upload
    const fullPath = `${folderStructure.fullPath}/${uniqueFileName}`
    console.log('Full upload path:', fullPath)

    // Try direct upload without bucket validation
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading file:', error)
      return {
        success: false,
        error: error.message
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fullPath)

    console.log('Upload successful:', urlData.publicUrl)
    return {
      success: true,
      path: urlData.publicUrl
    }
  } catch (error) {
    console.error('Error in uploadToFolder:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat upload file'
    }
  }
}

/**
 * List files dalam folder tertentu
 */
export const listFilesInFolder = async (
  contentType: 'events' | 'blog' | 'gallery' | 'news' | 'other',
  contentTitle: string,
  bucketName: string = 'admin-images'
): Promise<{ success: boolean; files?: string[]; error?: string }> => {
  try {
    const folderStructure = generateFolderPath(contentType, contentTitle, bucketName)
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderStructure.fullPath)

    if (error) {
      console.error('Error listing files:', error)
      return {
        success: false,
        error: error.message
      }
    }

    const files = data.map(file => file.name)
    return {
      success: true,
      files
    }
  } catch (error) {
    console.error('Error listing files:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat list files'
    }
  }
}

/**
 * Delete file dari folder
 */
export const deleteFileFromFolder = async (
  filePath: string,
  bucketName: string = 'admin-images'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (error) {
      console.error('Error deleting file:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat delete file'
    }
  }
}

/**
 * Get folder structure untuk display
 */
export const getFolderStructure = async (
  bucketName: string = 'admin-images'
): Promise<{ success: boolean; structure?: any; error?: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', {
        limit: 100,
        offset: 0
      })

    if (error) {
      console.error('Error getting folder structure:', error)
      return {
        success: false,
        error: error.message
      }
    }

    // Group files by folder structure
    const structure: any = {}
    
    for (const item of data) {
      if (item.name.includes('/')) {
        const [mainFolder, subFolder] = item.name.split('/')
        
        if (!structure[mainFolder]) {
          structure[mainFolder] = {}
        }
        
        if (subFolder && !item.name.includes('/', subFolder.length + 1)) {
          if (!structure[mainFolder][subFolder]) {
            structure[mainFolder][subFolder] = []
          }
          structure[mainFolder][subFolder].push(item.name)
        }
      }
    }

    return {
      success: true,
      structure
    }
  } catch (error) {
    console.error('Error getting folder structure:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat get folder structure'
    }
  }
}

/**
 * Clean up empty folders (optional)
 */
export const cleanupEmptyFolders = async (
  bucketName: string = 'admin-images'
): Promise<{ success: boolean; cleaned?: number; error?: string }> => {
  try {
    // Note: Supabase Storage tidak memerlukan explicit folder cleanup
    // Folder akan otomatis "hilang" saat tidak ada file di dalamnya
    return {
      success: true,
      cleaned: 0
    }
  } catch (error) {
    console.error('Error cleaning up folders:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat cleanup folders'
    }
  }
}
