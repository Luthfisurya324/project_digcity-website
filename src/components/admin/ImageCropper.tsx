import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Crop, RotateCcw, Save, X, ZoomIn, ZoomOut, Move } from 'lucide-react'

interface ImageCropperProps {
  imageUrl: string
  onCrop: (croppedImageUrl: string) => void
  onCancel: () => void
  aspectRatio?: number // 16:9, 4:3, 1:1, etc.
  targetWidth?: number
  targetHeight?: number
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface Point {
  x: number
  y: number
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  onCrop,
  onCancel,
  aspectRatio = 16/9,
  targetWidth = 800,
  targetHeight = 450
}) => {
  const [crop, setCrop] = useState<CropArea>({ x: 20, y: 20, width: 60, height: 33.75 })
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string>('')
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 })
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [imageLoaded, setImageLoaded] = useState(false)
  const [error, setError] = useState<string>('')
  
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load image with CORS handling
  const loadImage = useCallback(async (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        setImageLoaded(true)
        resolve(img)
      }
      
      img.onerror = () => {
        setError('Failed to load image. Please try again.')
        reject(new Error('Image load failed'))
      }
      
      // Try to load with CORS
      img.src = url
    })
  }, [])

  // Calculate initial crop to fit aspect ratio
  useEffect(() => {
    if (imageUrl) {
      loadImage(imageUrl)
        .then((img) => {
          const imgAspect = img.naturalWidth / img.naturalHeight
          let newCrop: CropArea

          if (imgAspect > aspectRatio) {
            // Image is wider than target aspect ratio
            const newHeight = img.naturalWidth / aspectRatio
            const y = (img.naturalHeight - newHeight) / 2
            newCrop = {
              x: 10,
              y: y / img.naturalHeight * 100,
              width: 80,
              height: (newHeight / img.naturalHeight) * 100
            }
          } else {
            // Image is taller than target aspect ratio
            const newWidth = img.naturalHeight * aspectRatio
            const x = (img.naturalWidth - newWidth) / 2
            newCrop = {
              x: x / img.naturalWidth * 100,
              y: 10,
              width: (newWidth / img.naturalWidth) * 100,
              height: 80
            }
          }
          
          setCrop(newCrop)
        })
        .catch((err) => {
          console.error('Error loading image:', err)
          setError('Failed to load image. Please check the image URL.')
        })
    }
  }, [imageUrl, aspectRatio, loadImage])

  // Generate real-time preview with precise cropping
  const generatePreview = useCallback(async (cropArea: CropArea, rot: number, scl: number) => {
    if (!imageRef.current || !canvasRef.current || !imageLoaded) return

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = imageRef.current
      
      // Check if image is loaded and has dimensions
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        console.warn('Image not fully loaded yet')
        return
      }

      const imgWidth = img.naturalWidth
      const imgHeight = img.naturalHeight

      // Set canvas size to target dimensions
      canvas.width = targetWidth
      canvas.height = targetHeight

      // Clear canvas with white background (no black edges)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Save context state
      ctx.save()

      // Move to center of canvas
      ctx.translate(canvas.width / 2, canvas.height / 2)

      // Apply rotation
      ctx.rotate((rot * Math.PI) / 180)

      // Apply scale
      ctx.scale(scl, scl)

      // Calculate crop dimensions in pixels with precise positioning
      const cropX = Math.round((cropArea.x / 100) * imgWidth)
      const cropY = Math.round((cropArea.y / 100) * imgHeight)
      const cropWidth = Math.round((cropArea.width / 100) * imgWidth)
      const cropHeight = Math.round((cropArea.height / 100) * imgHeight)

      // Ensure crop area is within image bounds
      const safeCropX = Math.max(0, Math.min(cropX, imgWidth - cropWidth))
      const safeCropY = Math.max(0, Math.min(cropY, imgHeight - cropHeight))
      const safeCropWidth = Math.min(cropWidth, imgWidth - safeCropX)
      const safeCropHeight = Math.min(cropHeight, imgHeight - safeCropY)

      // Draw cropped and transformed image with precise positioning
      ctx.drawImage(
        img,
        safeCropX, safeCropY, safeCropWidth, safeCropHeight,
        -targetWidth / 2, -targetHeight / 2,
        targetWidth, targetHeight
      )

      // Restore context state
      ctx.restore()

      // Try to convert to data URL, handle CORS issues
      try {
        const previewDataUrl = canvas.toDataURL('image/jpeg', 0.9)
        setPreviewUrl(previewDataUrl)
        setError('')
      } catch (canvasError) {
        console.warn('Canvas export failed, using fallback:', canvasError)
        // Fallback: create a simple preview without canvas export
        setPreviewUrl('')
        setError('Preview generation failed due to CORS restrictions. You can still crop the image.')
      }
    } catch (err) {
      console.error('Error generating preview:', err)
      setError('Failed to generate preview. Please try again.')
    }
  }, [targetWidth, targetHeight, imageLoaded])

  // Update preview when crop, rotation, or scale changes
  useEffect(() => {
    if (imageLoaded) {
      generatePreview(crop, rotation, scale)
    }
  }, [crop, rotation, scale, generatePreview, imageLoaded])

  // Handle mouse events for crop area dragging with precise positioning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || !imageLoaded) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    // Check if click is on resize handles with precise detection
    const handleSize = 2.5 // 2.5% of container for more precise detection
    const isOnHandle = checkResizeHandle(x, y, handleSize)
    
    if (isOnHandle) {
      setIsResizing(true)
      setResizeDirection(isOnHandle)
      setDragStart({ x, y })
      return
    }
    
    // Check if click is inside crop area with precise boundaries
    if (x >= crop.x && x <= crop.x + crop.width && 
        y >= crop.y && y <= crop.y + crop.height) {
      setIsDragging(true)
      setDragStart({ x: x - crop.x, y: y - crop.y })
    }
  }

  const checkResizeHandle = (x: number, y: number, handleSize: number): string => {
    // Top-left
    if (x >= crop.x - handleSize && x <= crop.x + handleSize && 
        y >= crop.y - handleSize && y <= crop.y + handleSize) {
      return 'nw'
    }
    // Top-right
    if (x >= crop.x + crop.width - handleSize && x <= crop.x + crop.width + handleSize && 
        y >= crop.y - handleSize && y <= crop.y + handleSize) {
      return 'ne'
    }
    // Bottom-left
    if (x >= crop.x - handleSize && x <= crop.x + handleSize && 
        y >= crop.y + crop.height - handleSize && y <= crop.y + crop.height + handleSize) {
      return 'sw'
    }
    // Bottom-right
    if (x >= crop.x + crop.width - handleSize && x <= crop.x + crop.width + handleSize && 
        y >= crop.y + crop.height - handleSize && y <= crop.y + crop.height + handleSize) {
      return 'se'
    }
    // Left edge
    if (x >= crop.x - handleSize && x <= crop.x + handleSize && 
        y >= crop.y && y <= crop.y + crop.height) {
      return 'w'
    }
    // Right edge
    if (x >= crop.x + crop.width - handleSize && x <= crop.x + crop.width + handleSize && 
        y >= crop.y && y <= crop.y + crop.height) {
      return 'e'
    }
    // Top edge
    if (y >= crop.y - handleSize && y <= crop.y + handleSize && 
        x >= crop.x && x <= crop.x + crop.width) {
      return 'n'
    }
    // Bottom edge
    if (y >= crop.y + crop.height - handleSize && y <= crop.y + crop.height + handleSize && 
        x >= crop.x && x <= crop.x + crop.width) {
      return 's'
    }
    
    return ''
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !imageLoaded) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    if (isDragging) {
      // Precise positioning with boundary limits
      const newX = Math.max(0, Math.min(100 - crop.width, x - dragStart.x))
      const newY = Math.max(0, Math.min(100 - crop.height, y - dragStart.y))
      
      // Round to 2 decimal places for precise positioning
      const newCrop = { 
        ...crop, 
        x: Math.round(newX * 100) / 100, 
        y: Math.round(newY * 100) / 100 
      }
      setCrop(newCrop)
    } else if (isResizing) {
      handleResize(resizeDirection, x - dragStart.x, y - dragStart.y)
      setDragStart({ x, y })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeDirection('')
  }

  // Handle crop area resizing with precise aspect ratio maintenance
  const handleResize = (direction: string, deltaX: number, deltaY: number) => {
    let newCrop = { ...crop }
    const minSize = 15 // Minimum 15% of container for better usability

    // Convert delta to percentage for precise control
    const deltaXPercent = (deltaX / 100) * 100
    const deltaYPercent = (deltaY / 100) * 100

    switch (direction) {
      case 'e': // Right edge
        newCrop.width = Math.max(minSize, Math.min(100 - newCrop.x, newCrop.width + deltaXPercent))
        break
      case 'w': // Left edge
        const newWidth = Math.max(minSize, newCrop.width - deltaXPercent)
        newCrop.x = Math.max(0, newCrop.x + (newCrop.width - newWidth))
        newCrop.width = newWidth
        break
      case 's': // Bottom edge
        newCrop.height = Math.max(minSize, Math.min(100 - newCrop.y, newCrop.height + deltaYPercent))
        break
      case 'n': // Top edge
        const newHeight = Math.max(minSize, newCrop.height - deltaYPercent)
        newCrop.y = Math.max(0, newCrop.y + (newCrop.height - newHeight))
        newCrop.height = newHeight
        break
      case 'se': // Bottom-right corner
        newCrop.width = Math.max(minSize, Math.min(100 - newCrop.x, newCrop.width + deltaXPercent))
        newCrop.height = Math.max(minSize, Math.min(100 - newCrop.y, newCrop.height + deltaYPercent))
        break
      case 'sw': // Bottom-left corner
        const newWidthSW = Math.max(minSize, newCrop.width - deltaXPercent)
        newCrop.x = Math.max(0, newCrop.x + (newCrop.width - newWidthSW))
        newCrop.width = newWidthSW
        newCrop.height = Math.max(minSize, Math.min(100 - newCrop.y, newCrop.height + deltaYPercent))
        break
      case 'ne': // Top-right corner
        newCrop.width = Math.max(minSize, Math.min(100 - newCrop.x, newCrop.width + deltaXPercent))
        const newHeightNE = Math.max(minSize, newCrop.height - deltaYPercent)
        newCrop.y = Math.max(0, newCrop.y + (newCrop.height - newHeightNE))
        newCrop.height = newHeightNE
        break
      case 'nw': // Top-left corner
        const newWidthNW = Math.max(minSize, newCrop.width - deltaXPercent)
        newCrop.x = Math.max(0, newCrop.x + (newCrop.width - newWidthNW))
        newCrop.width = newWidthNW
        const newHeightNW = Math.max(minSize, newCrop.height - deltaYPercent)
        newCrop.y = Math.max(0, newCrop.y + (newCrop.height - newHeightNW))
        newCrop.height = newHeightNW
        break
    }

    // Maintain aspect ratio with precise calculations
    const newAspectRatio = newCrop.width / newCrop.height
    if (Math.abs(newAspectRatio - aspectRatio) > 0.05) { // Tighter tolerance
      if (newAspectRatio > aspectRatio) {
        // Too wide, adjust height
        newCrop.height = newCrop.width / aspectRatio
        if (newCrop.y + newCrop.height > 100) {
          newCrop.y = 100 - newCrop.height
        }
      } else {
        // Too tall, adjust width
        newCrop.width = newCrop.height * aspectRatio
        if (newCrop.x + newCrop.width > 100) {
          newCrop.x = 100 - newCrop.width
        }
      }
    }

    // Round all values to 2 decimal places for precise positioning
    newCrop.x = Math.round(newCrop.x * 100) / 100
    newCrop.y = Math.round(newCrop.y * 100) / 100
    newCrop.width = Math.round(newCrop.width * 100) / 100
    newCrop.height = Math.round(newCrop.height * 100) / 100

    setCrop(newCrop)
  }

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360
    setRotation(newRotation)
  }

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value)
    setScale(newScale)
  }

  const handleSave = async () => {
    if (!imageLoaded) {
      setError('Image not loaded yet. Please wait.')
      return
    }

    try {
      if (previewUrl) {
        onCrop(previewUrl)
      } else {
        // Fallback: try to generate cropped image without canvas export
        setError('Cannot export image due to CORS restrictions. Please try with a different image.')
      }
    } catch (err) {
      console.error('Error saving cropped image:', err)
      setError('Failed to save cropped image. Please try again.')
    }
  }

  const resetCrop = () => {
    const img = imageRef.current
    if (img) {
      const imgAspect = img.naturalWidth / img.naturalHeight
      let newCrop: CropArea

      if (imgAspect > aspectRatio) {
        const newHeight = img.naturalWidth / aspectRatio
        const y = (img.naturalHeight - newHeight) / 2
        newCrop = {
          x: 10,
          y: y / img.naturalHeight * 100,
          width: 80,
          height: (newHeight / img.naturalHeight) * 100
        }
      } else {
        const newWidth = img.naturalHeight * aspectRatio
        const x = (img.naturalWidth - newWidth) / 2
        newCrop = {
          x: x / img.naturalWidth * 100,
          y: 10,
          width: (newWidth / img.naturalWidth) * 100,
          height: 80
        }
      }
      
      setCrop(newCrop)
      setRotation(0)
      setScale(1)
    }
  }

  const getCursorStyle = (x: number, y: number): string => {
    if (!containerRef.current) return 'default'
    
    const rect = containerRef.current.getBoundingClientRect()
    const xPercent = ((x - rect.left) / rect.width) * 100
    const yPercent = ((y - rect.top) / rect.height) * 100
    
    const handleSize = 2.5
    const isOnHandle = checkResizeHandle(xPercent, yPercent, handleSize)
    
    switch (isOnHandle) {
      case 'nw':
      case 'se':
        return 'nw-resize'
      case 'ne':
      case 'sw':
        return 'ne-resize'
      case 'n':
      case 's':
        return 'ns-resize'
      case 'e':
      case 'w':
        return 'ew-resize'
      default:
        if (xPercent >= crop.x && xPercent <= crop.x + crop.width && 
            yPercent >= crop.y && yPercent <= crop.y + crop.height) {
          return 'move'
        }
        return 'default'
    }
  }

  // Show error message if there's an issue
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Error Loading Image</h2>
          <p className="text-secondary-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                setError('')
                loadImage(imageUrl)
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-secondary-900">Edit Image</h2>
          <p className="text-sm text-secondary-600 mt-1">
            Crop, rotate, and adjust your image to fit the event card perfectly
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Image Editor */}
            <div className="xl:col-span-2">
              <div 
                ref={containerRef}
                className="relative bg-gray-100 rounded-lg overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: 'default' }}
              >
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Image to crop"
                  className="w-full h-auto max-h-[500px] object-contain pointer-events-none"
                  style={{
                    transform: `rotate(${rotation}deg) scale(${scale})`,
                    transformOrigin: 'center'
                  }}
                  crossOrigin="anonymous"
                />
                
                {/* Crop Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Crop Area */}
                  <div
                    className="border-2 border-white border-dashed shadow-lg bg-black bg-opacity-20"
                    style={{
                      left: `${crop.x}%`,
                      top: `${crop.y}%`,
                      width: `${crop.width}%`,
                      height: `${crop.height}%`,
                      position: 'absolute'
                    }}
                  />
                  
                  {/* Resize Handles - Top Left */}
                  <div
                    className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-nw-resize pointer-events-auto shadow-lg"
                    style={{
                      left: `${crop.x - 2.5}%`,
                      top: `${crop.y - 2.5}%`
                    }}
                  />
                  
                  {/* Resize Handles - Top Right */}
                  <div
                    className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-ne-resize pointer-events-auto shadow-lg"
                    style={{
                      left: `${crop.x + crop.width - 2.5}%`,
                      top: `${crop.y - 2.5}%`
                    }}
                  />
                  
                  {/* Resize Handles - Bottom Left */}
                  <div
                    className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-sw-resize pointer-events-auto shadow-lg"
                    style={{
                      left: `${crop.x - 2.5}%`,
                      top: `${crop.y + crop.height - 2.5}%`
                    }}
                  />
                  
                  {/* Resize Handles - Bottom Right */}
                  <div
                    className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-se-resize pointer-events-auto shadow-lg"
                    style={{
                      left: `${crop.x + crop.width - 2.5}%`,
                      top: `${crop.y + crop.height - 2.5}%`
                    }}
                  />
                  
                  {/* Edge Handles - Left */}
                  <div
                    className="absolute w-3 h-6 bg-white border border-blue-500 rounded cursor-ew-resize pointer-events-auto shadow-lg"
                    style={{
                      left: `${crop.x - 1.5}%`,
                      top: `${crop.y + crop.height/2 - 3}%`
                    }}
                  />
                  
                  {/* Edge Handles - Right */}
                  <div
                    className="absolute w-3 h-6 bg-white border border-blue-500 rounded cursor-ew-resize pointer-events-auto shadow-lg"
                    style={{
                      left: `${crop.x + crop.width - 1.5}%`,
                      top: `${crop.y + crop.height/2 - 3}%`
                    }}
                  />
                  
                  {/* Edge Handles - Top */}
                  <div
                    className="absolute w-6 h-3 bg-white border border-blue-500 rounded cursor-ns-resize pointer-events-auto shadow-lg"
                    style={{
                      left: `${crop.x + crop.width/2 - 3}%`,
                      top: `${crop.y - 1.5}%`
                    }}
                  />
                  
                  {/* Edge Handles - Bottom */}
                  <div
                    className="absolute w-6 h-3 bg-white border border-blue-500 rounded cursor-ns-resize pointer-events-auto shadow-lg"
                    style={{
                      left: `${crop.x + crop.width/2 - 3}%`,
                      top: `${crop.y + crop.height - 1.5}%`
                    }}
                  />
                </div>

                {/* Instructions Overlay */}
                {!isDragging && !isResizing && (
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded text-sm">
                    <Move size={16} className="inline mr-2" />
                    Drag to move crop area • Drag handles to resize
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Scale: {scale.toFixed(2)}x
                  </label>
                  <div className="flex items-center gap-3">
                    <ZoomOut size={16} className="text-secondary-500" />
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={handleScaleChange}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <ZoomIn size={16} className="text-secondary-500" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRotate}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
                  >
                    <RotateCcw size={16} />
                    Rotate 90°
                  </button>
                  
                  <button
                    onClick={resetCrop}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Preview and Info */}
            <div className="xl:col-span-1">
              <div className="space-y-4">
                {/* Target Dimensions */}
                <div className="bg-secondary-50 rounded-lg p-4">
                  <h3 className="font-medium text-secondary-900 mb-2">Target Dimensions</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Width:</span>
                      <span className="font-medium">{targetWidth}px</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Height:</span>
                      <span className="font-medium">{targetHeight}px</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Aspect Ratio:</span>
                      <span className="font-medium">{aspectRatio.toFixed(2)}:1</span>
                    </div>
                  </div>
                </div>

                {/* Real-time Preview */}
                <div className="bg-secondary-50 rounded-lg p-4">
                  <h3 className="font-medium text-secondary-900 mb-2">Live Preview</h3>
                  <div 
                    className="bg-white rounded border overflow-hidden"
                    style={{
                      width: '100%',
                      height: `${(100 / aspectRatio)}%`,
                      maxHeight: '250px'
                    }}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Crop preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-xs text-secondary-500">
                        {error ? 'Preview unavailable' : 'Preview will appear here'}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-secondary-500 mt-2">
                    {error ? 'CORS restrictions prevent preview generation' : 'Real-time preview of your cropped image'}
                  </p>
                </div>

                {/* Crop Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Crop Area</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Position:</span>
                      <span>X: {crop.x.toFixed(2)}%, Y: {crop.y.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>W: {crop.width.toFixed(2)}%, H: {crop.height.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rotation:</span>
                      <span>{rotation}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scale:</span>
                      <span>{scale.toFixed(2)}x</span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">How to Use</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>Drag</strong> crop area to move it</li>
                    <li>• <strong>Drag corners</strong> to resize crop area</li>
                    <li>• <strong>Drag edges</strong> to resize width/height</li>
                    <li>• <strong>Scale slider</strong> to zoom in/out</li>
                    <li>• <strong>Rotate button</strong> to straighten image</li>
                    <li>• <strong>Reset button</strong> to restore original</li>
                  </ul>
                </div>

                {/* CORS Warning */}
                {error && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-900 mb-2">⚠️ CORS Warning</h3>
                    <p className="text-sm text-yellow-800">
                      This image has CORS restrictions. Preview may not work, but cropping should still function.
                      For best results, use images from your own domain or enable CORS on the image server.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!previewUrl}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

export default ImageCropper
