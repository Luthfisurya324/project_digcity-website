import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { uploadToFolder } from '../../utils/folderManager'

interface MultipleImageUploadProps {
  onImagesUploaded: (imageUrls: string[]) => void
  contentType: 'events' | 'blog' | 'gallery' | 'news' | 'other'
  contentTitle: string
  bucketName?: string
  maxSize?: number // in MB
  maxFiles?: number
  acceptedTypes?: string[]
  initialImages?: string[]
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  onImagesUploaded,
  contentType,
  contentTitle,
  bucketName = 'admin-images',
  maxSize = 5,
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  initialImages = []
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [errors, setErrors] = useState<string[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} tidak didukung. Gunakan: ${acceptedTypes.join(', ')}`
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File terlalu besar. Maksimal ${maxSize}MB`
    }

    return null
  }

  // Handle file upload dengan folder structure
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const result = await uploadToFolder(file, contentType, contentTitle, bucketName)
      
      if (result.success && result.path) {
        return result.path
      } else {
        throw new Error(result.error || 'Upload gagal')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  // Handle multiple files
  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files)
    
    // Validate file count
    if (uploadedImages.length + fileArray.length > maxFiles) {
      setErrors([`Maksimal ${maxFiles} file. Anda sudah memiliki ${uploadedImages.length} file.`])
      return
    }

    // Clear previous errors
    setErrors([])
    
    setIsUploading(true)
    const newImages: string[] = []
    const newErrors: string[] = []

    // Process each file
    for (const file of fileArray) {
      try {
        // Validate file
        const validationError = validateFile(file)
        if (validationError) {
          newErrors.push(`${file.name}: ${validationError}`)
          continue
        }

        // Update progress
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))

        // Upload file
        const imageUrl = await uploadFile(file)
        if (imageUrl) {
          newImages.push(imageUrl)
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
        }
      } catch (error) {
        newErrors.push(`${file.name}: Upload gagal - ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Update state
    if (newImages.length > 0) {
      const allImages = [...uploadedImages, ...newImages]
      setUploadedImages(allImages)
      onImagesUploaded(allImages)
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
    }

    setIsUploading(false)
    
    // Clear progress after a delay
    setTimeout(() => {
      setUploadProgress({})
    }, 2000)
  }, [uploadedImages, maxFiles, contentType, contentTitle, bucketName, onImagesUploaded])

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  // Handle drag and drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  // Remove image
  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(newImages)
    onImagesUploaded(newImages)
  }

  // Clear all images
  const clearAllImages = () => {
    setUploadedImages([])
    onImagesUploaded([])
  }

  // Get folder info untuk display
  const getFolderInfo = () => {
    const cleanTitle = contentTitle
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .toLowerCase()
    
    return `${contentType}/${cleanTitle}`
  }

  return (
    <div className="space-y-4">
      {/* Folder Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <ImageIcon size={16} />
          <span className="font-medium">Upload Location:</span>
          <code className="bg-blue-100 px-2 py-1 rounded text-xs">
            {bucketName}/{getFolderInfo()}
          </code>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          Gambar akan otomatis diorganisir dalam folder yang sesuai dengan konten
        </p>
      </div>

      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          Drag & drop gambar ke sini, atau{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            pilih file
          </button>
        </p>
        <p className="text-xs text-gray-500">
          Maksimal {maxFiles} file, {maxSize}MB per file
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Format: {acceptedTypes.join(', ').replace('image/', '')}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Upload Progress:</h4>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="bg-gray-100 rounded-lg p-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span className="truncate">{fileName}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-800 mb-2">
            <AlertCircle size={16} />
            <span className="font-medium">Upload Errors:</span>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Uploaded Images ({uploadedImages.length})
            </h4>
            <button
              type="button"
              onClick={clearAllImages}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={12} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {imageUrl.split('/').pop()?.substring(0, 20)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Uploading images...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MultipleImageUpload
