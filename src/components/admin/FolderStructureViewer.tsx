import React, { useState, useEffect } from 'react'
import { Folder, File, ChevronDown, ChevronRight, RefreshCw, Trash2, Eye } from 'lucide-react'
import { getFolderStructure, deleteFileFromFolder } from '../../utils/folderManager'

interface FolderStructureViewerProps {
  bucketName?: string
}

const FolderStructureViewer: React.FC<FolderStructureViewerProps> = ({
  bucketName = 'admin-images'
}) => {
  const [structure, setStructure] = useState<any>({})
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load folder structure
  const loadStructure = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await getFolderStructure(bucketName)
      
      if (result.success && result.structure) {
        setStructure(result.structure)
      } else {
        setError(result.error || 'Gagal memuat struktur folder')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat struktur folder')
      console.error('Error loading structure:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load structure on mount
  useEffect(() => {
    loadStructure()
  }, [bucketName])

  // Toggle folder expansion
  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath)
    } else {
      newExpanded.add(folderPath)
    }
    setExpandedFolders(newExpanded)
  }

  // Delete file
  const handleDeleteFile = async (filePath: string) => {
    if (!confirm(`Yakin ingin menghapus file ini?\n${filePath}`)) {
      return
    }

    try {
      const result = await deleteFileFromFolder(filePath, bucketName)
      
      if (result.success) {
        // Reload structure
        await loadStructure()
      } else {
        alert(`Gagal menghapus file: ${result.error}`)
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus file')
      console.error('Error deleting file:', err)
    }
  }

  // Get file size in readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Render folder structure recursively
  const renderFolderStructure = (data: any, level: number = 0, parentPath: string = '') => {
    const items = Object.entries(data)
    
    if (items.length === 0) {
      return (
        <div className="text-gray-500 text-sm italic pl-4">
          Folder kosong
        </div>
      )
    }

    return items.map(([name, value]) => {
      const currentPath = parentPath ? `${parentPath}/${name}` : name
      const isExpanded = expandedFolders.has(currentPath)
      const isFolder = typeof value === 'object' && value !== null
      const isFile = Array.isArray(value)

      if (isFolder) {
        return (
          <div key={currentPath} className="ml-4">
            <div 
              className="flex items-center gap-2 py-1 hover:bg-gray-50 cursor-pointer rounded px-2"
              onClick={() => toggleFolder(currentPath)}
            >
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
              <Folder size={16} className="text-blue-500" />
              <span className="font-medium text-gray-700">{name}</span>
              <span className="text-xs text-gray-500">
                ({Object.keys(value).length} items)
              </span>
            </div>
            
            {isExpanded && (
              <div className="ml-4">
                {renderFolderStructure(value, level + 1, currentPath)}
              </div>
            )}
          </div>
        )
      }

      if (isFile) {
        return (
          <div key={currentPath} className="ml-4">
            <div className="flex items-center gap-2 py-1 hover:bg-gray-50 rounded px-2">
              <File size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">{name}</span>
              <span className="text-xs text-gray-400">
                ({value.length} files)
              </span>
              
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => window.open(value[0], '_blank')}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="View File"
                >
                  <Eye size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteFile(value[0])}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete File"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        )
      }

      return null
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Folder Structure</h3>
          <p className="text-sm text-gray-600">
            Bucket: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{bucketName}</code>
          </p>
        </div>
        
        <button
          onClick={loadStructure}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading folder structure...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">{error}</div>
            <button
              onClick={loadStructure}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : Object.keys(structure).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada folder yang ditemukan
          </div>
        ) : (
          <div className="space-y-1">
            {renderFolderStructure(structure)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <p>• Folder akan dibuat otomatis saat file diupload</p>
          <p>• Klik folder untuk expand/collapse</p>
          <p>• Hapus file dengan tombol trash icon</p>
        </div>
      </div>
    </div>
  )
}

export default FolderStructureViewer
