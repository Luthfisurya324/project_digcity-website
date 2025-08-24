import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-react'

interface ImageCarouselProps {
  images: string[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showControls?: boolean
  showThumbnails?: boolean
  className?: string
  onClose?: () => void
  isModal?: boolean
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoPlay = true,
  autoPlayInterval = 3000,
  showControls = true,
  showThumbnails = true,
  className = '',
  onClose,
  isModal = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !isPlaying || images.length <= 1) return

    const interval = setInterval(() => {
      nextImage()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, isPlaying, autoPlayInterval, images.length])

  // Pause auto-play when user interacts
  const pauseAutoPlay = useCallback(() => {
    if (autoPlay) {
      setIsPlaying(false)
    }
  }, [autoPlay])

  const resumeAutoPlay = useCallback(() => {
    if (autoPlay) {
      setIsPlaying(true)
    }
  }, [autoPlay])

  const nextImage = useCallback(() => {
    if (images.length <= 1) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
      setIsTransitioning(false)
    }, 150)
  }, [images.length])

  const previousImage = useCallback(() => {
    if (images.length <= 1) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
      setIsTransitioning(false)
    }, 150)
  }, [images.length])

  const goToImage = useCallback((index: number) => {
    if (index === currentIndex) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsTransitioning(false)
    }, 150)
  }, [currentIndex])

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  if (!images || images.length === 0) {
    return null
  }

  if (images.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={images[0]}
          alt="Event image"
          className="w-full h-full object-cover rounded-lg"
        />
        {onClose && isModal && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
          >
            <X size={20} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={images[currentIndex]}
          alt={`Event image ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Close button for modal */}
        {onClose && isModal && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all z-10"
          >
            <X size={20} />
          </button>
        )}

        {/* Navigation Controls */}
        {showControls && (
          <>
            {/* Previous Button */}
            <button
              onClick={() => {
                previousImage()
                pauseAutoPlay()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={() => {
                nextImage()
                pauseAutoPlay()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>

            {/* Play/Pause Button */}
            {autoPlay && (
              <button
                onClick={togglePlayPause}
                className="absolute top-2 left-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
            )}
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                goToImage(index)
                pauseAutoPlay()
              }}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-primary-500 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dots Indicator */}
      {!showThumbnails && images.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                goToImage(index)
                pauseAutoPlay()
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary-500 w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageCarousel
