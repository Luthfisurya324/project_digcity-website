import React, { useState } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, Linkedin, MessageCircle, Send } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  hashtags?: string[];
}

const SocialShare: React.FC<SocialShareProps> = ({ 
  url, 
  title, 
  description, 
  hashtags = ['DIGCITY', 'BisnisDigital', 'UIKA'] 
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const shareData = {
    title,
    text: description,
    url
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        setShowShareOptions(true);
      }
    } else {
      setShowShareOptions(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);
    const encodedHashtags = encodeURIComponent(hashtags.join(' '));

    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  const socialPlatforms = [
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700', platform: 'facebook' },
    { name: 'Twitter', icon: Twitter, color: 'bg-sky-500 hover:bg-sky-600', platform: 'twitter' },
    { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700 hover:bg-blue-800', platform: 'linkedin' },
    { name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500 hover:bg-green-600', platform: 'whatsapp' },
    { name: 'Telegram', icon: Send, color: 'bg-blue-500 hover:bg-blue-600', platform: 'telegram' }
  ];

  return (
    <div className="relative">
      {/* Main Share Button */}
      <button
        onClick={handleNativeShare}
        className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
      >
        <Share2 className="w-4 h-4" />
        Bagikan
      </button>

      {/* Share Options Dropdown */}
      {showShareOptions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowShareOptions(false)}
            data-testid="backdrop"
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-secondary-200 z-50">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-secondary-900 mb-3">
                Bagikan Artikel
              </h3>
              
              {/* Social Media Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {socialPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.platform}
                      onClick={() => handleSocialShare(platform.platform)}
                      className={`${platform.color} text-white p-3 rounded-lg flex flex-col items-center gap-1 transition-colors duration-200`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{platform.name}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 bg-secondary-100 text-secondary-700 px-4 py-2 rounded-lg hover:bg-secondary-200 transition-colors duration-200"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Link Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Salin Link
                  </>
                )}
              </button>
              
              {/* Close Button */}
              <button
                onClick={() => setShowShareOptions(false)}
                className="absolute top-2 right-2 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialShare;
