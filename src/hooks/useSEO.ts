import { useEffect } from 'react';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

const defaultSEO: SEOData = {
  title: 'DIGCITY - Himpunan Mahasiswa Bisnis Digital UIKA Bogor',
  description: 'Website resmi DIGCITY, Himpunan Mahasiswa Bisnis Digital Universitas Ibn Khaldun Bogor. Organisasi yang berdampak, adaptif, inovatif, dan kompeten untuk pengembangan potensi mahasiswa.',
  keywords: 'DIGCITY, Himpunan Mahasiswa, Bisnis Digital, UIKA Bogor, Universitas Ibn Khaldun, Organisasi Mahasiswa, Digital Business',
  ogImage: '/logo_digcity.png',
  ogUrl: 'https://digcity.my.id/',
  twitterImage: '/logo_digcity.png'
};

export const useSEO = (seoData: SEOData = {}) => {
  useEffect(() => {
    const data = { ...defaultSEO, ...seoData };

    // Update document title
    if (data.title) {
      document.title = data.title;
    }

    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, content: string, attribute: string = 'content') => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (element) {
        element.setAttribute(attribute, content);
      } else {
        element = document.createElement('meta');
        const selectorParts = selector.match(/\[([^=]+)="([^"]+)"\]/);
        if (selectorParts) {
          element.setAttribute(selectorParts[1], selectorParts[2]);
          element.setAttribute(attribute, content);
          document.head.appendChild(element);
        }
      }
    };

    // Update basic meta tags
    if (data.description) {
      updateMetaTag('meta[name="description"]', data.description);
    }
    if (data.keywords) {
      updateMetaTag('meta[name="keywords"]', data.keywords);
    }

    // Update Open Graph tags
    if (data.ogTitle) {
      updateMetaTag('meta[property="og:title"]', data.ogTitle);
    }
    if (data.ogDescription) {
      updateMetaTag('meta[property="og:description"]', data.ogDescription);
    }
    if (data.ogImage) {
      updateMetaTag('meta[property="og:image"]', data.ogImage);
    }
    if (data.ogUrl) {
      updateMetaTag('meta[property="og:url"]', data.ogUrl);
    }

    // Update Twitter tags
    if (data.twitterTitle) {
      updateMetaTag('meta[property="twitter:title"]', data.twitterTitle);
    }
    if (data.twitterDescription) {
      updateMetaTag('meta[property="twitter:description"]', data.twitterDescription);
    }
    if (data.twitterImage) {
      updateMetaTag('meta[property="twitter:image"]', data.twitterImage);
    }

    // Update canonical URL
    if (data.canonicalUrl) {
      let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonicalElement) {
        canonicalElement.href = data.canonicalUrl;
      } else {
        canonicalElement = document.createElement('link');
        canonicalElement.rel = 'canonical';
        canonicalElement.href = data.canonicalUrl;
        document.head.appendChild(canonicalElement);
      }
    }

    // Update structured data
    if (data.structuredData) {
      let structuredDataElement = document.querySelector('script[type="application/ld+json"]#dynamic-structured-data') as HTMLScriptElement;
      if (structuredDataElement) {
        structuredDataElement.textContent = JSON.stringify(data.structuredData);
      } else {
        structuredDataElement = document.createElement('script');
        structuredDataElement.type = 'application/ld+json';
        structuredDataElement.id = 'dynamic-structured-data';
        structuredDataElement.textContent = JSON.stringify(data.structuredData);
        document.head.appendChild(structuredDataElement);
      }
    }
  }, [seoData]);
};

export default useSEO;