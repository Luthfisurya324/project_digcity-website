import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react'

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void
  onCancel?: () => void
  bucketName?: string
  folderPath?: string
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  onCancel,
  bucketName = 'images',
  folderPath = 'admin',
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setError(null)
    
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`File type not supported. Please use: ${acceptedTypes.join(', ')}`)
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size too large. Maximum size: ${maxSize}MB`)
      return
    }

    setSelectedFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadToSupabase = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)
      setUploadProgress(0)
      setError(null)

      // TODO: Implement Supabase upload
      // This will be implemented when we connect to Supabase
      const { supabase } = await import('../../lib/supabase')
      
      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = selectedFile.name.split('.').pop()
      const fileName = `${folderPath}/${timestamp}.${fileExtension}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName)

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      onImageUploaded(publicUrl)
      
      // Reset state
      setSelectedFile(null)
      setPreview(null)
      setUploadProgress(0)
      setUploading(false)

    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  if (uploading) {
    return (
      <div className={`bg-white rounded-xl border border-secondary-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Uploading Image...</h3>
          <div className="w-full bg-secondary-200 rounded-full h-2 mb-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-secondary-600">{uploadProgress}% Complete</p>
        </div>
      </div>
    )
  }

  if (preview && selectedFile) {
    return (
      <div className={`bg-white rounded-xl border border-secondary-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-secondary-200"
            />
            <button
              onClick={removeFile}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-secondary-600 mb-1">Selected file:</p>
            <p className="font-medium text-secondary-900">{selectedFile.name}</p>
            <p className="text-xs text-secondary-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <div className="flex justify-center space-x-3">
            <button
              onClick={removeFile}
              className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={uploadToSupabase}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Upload size={16} />
              <span>Upload Image</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl border border-secondary-200 p-6 ${className}`}>
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon size={24} className="text-primary-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">Upload Image</h3>
        <p className="text-sm text-secondary-600 mb-4">
          Drag and drop your image here, or click to browse
        </p>

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
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <button
            onClick={openFileDialog}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Upload size={16} />
            <span>Choose File</span>
          </button>
          
          <p className="text-xs text-secondary-500 mt-3">
            Supported formats: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
          </p>
          <p className="text-xs text-secondary-500">
            Maximum size: {maxSize}MB
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

export default ImageUpload
