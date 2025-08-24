import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react'

interface MultipleImageUploadProps {
  onImagesUploaded: (imageUrls: string[]) => void
  onCancel?: () => void
  bucketName?: string
  folderPath?: string
  maxSize?: number // in MB
  maxFiles?: number
  acceptedTypes?: string[]
  className?: string
  initialImages?: string[]
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  onImagesUploaded,
  onCancel,
  bucketName = 'events-images',
  folderPath = 'events',
  maxSize = 5, // 5MB default
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  className = '',
  initialImages = []
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages)
  const [previews, setPreviews] = useState<{ [key: string]: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files)
      handleFiles(files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    setError(null)
    
    // Check max files limit
    if (selectedFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed. You can add ${maxFiles - selectedFiles.length} more files.`)
      return
    }

    const validFiles: File[] = []
    
    files.forEach(file => {
      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        setError(`File type not supported: ${file.name}. Please use: ${acceptedTypes.join(', ')}`)
        return
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File too large: ${file.name}. Maximum size: ${maxSize}MB`)
        return
      }

      validFiles.push(file)
    })

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles]
      setSelectedFiles(newFiles)
      
      // Create previews for new files
      validFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviews(prev => ({
            ...prev,
            [file.name]: e.target?.result as string
          }))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeFile = (fileName: string) => {
    setSelectedFiles(prev => prev.filter(f => f.name !== fileName))
    setPreviews(prev => {
      const newPreviews = { ...prev }
      delete newPreviews[fileName]
      return newPreviews
    })
    setError(null)
  }

  const removeUploadedImage = (imageUrl: string) => {
    setUploadedImages(prev => prev.filter(url => url !== imageUrl))
  }

  const uploadToSupabase = async () => {
    if (selectedFiles.length === 0) return

    try {
      setUploading(true)
      setError(null)
      const { supabase } = await import('../../lib/supabase')
      
      const newImageUrls: string[] = []
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        
        // Generate unique filename
        const timestamp = Date.now() + i
        const fileExtension = file.name.split('.').pop()
        const fileName = `${folderPath}/${timestamp}.${fileExtension}`

        // Update progress
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`)
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName)

        newImageUrls.push(publicUrl)
        
        // Update progress
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
      }

      // Combine with existing images
      const allImages = [...uploadedImages, ...newImageUrls]
      setUploadedImages(allImages)
      
      // Reset state
      setSelectedFiles([])
      setPreviews({})
      setUploadProgress({})
      setUploading(false)

      // Notify parent component
      onImagesUploaded(allImages)

    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
      setUploading(false)
      setUploadProgress({})
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const canUpload = selectedFiles.length > 0 && !uploading
  const totalImages = uploadedImages.length + selectedFiles.length

  return (
    <div className={`bg-white rounded-xl border border-secondary-200 p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon size={24} className="text-primary-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">Upload Multiple Images</h3>
        <p className="text-sm text-secondary-600">
          Drag and drop images here, or click to browse. Max {maxFiles} files.
        </p>
      </div>

      {/* Uploaded Images Display */}
      {uploadedImages.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-secondary-700 mb-3">Current Images ({uploadedImages.length})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Event image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-secondary-200"
                />
                <button
                  onClick={() => removeUploadedImage(imageUrl)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Files Display */}
      {selectedFiles.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-secondary-700 mb-3">Selected Files ({selectedFiles.length})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {selectedFiles.map((file) => (
              <div key={file.name} className="relative group">
                <img
                  src={previews[file.name]}
                  alt={file.name}
                  className="w-full h-24 object-cover rounded-lg border border-secondary-200"
                />
                <button
                  onClick={() => removeFile(file.name)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                  {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-secondary-700 mb-3">Upload Progress</h4>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="mb-2">
              <div className="flex justify-between text-xs text-secondary-600 mb-1">
                <span>{fileName}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {!uploading && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
            dragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-secondary-300 hover:border-secondary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <button
            onClick={openFileDialog}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 mx-auto mb-4"
          >
            <Plus size={16} />
            <span>Choose Files</span>
          </button>
          
          <p className="text-xs text-secondary-500">
            Supported formats: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
          </p>
          <p className="text-xs text-secondary-500">
            Maximum size: {maxSize}MB per file | Max files: {maxFiles}
          </p>
          <p className="text-xs text-secondary-500 mt-1">
            Total images: {totalImages}/{maxFiles}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle size={16} className="text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-3 mt-6">
        {canUpload && (
          <button
            onClick={uploadToSupabase}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Upload size={16} />
            <span>Upload {selectedFiles.length} Images</span>
          </button>
        )}
        
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

export default MultipleImageUpload
