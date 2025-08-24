import { useEffect } from 'react';
import { isLinktreeSubdomain } from '../utils/domainDetection';
import { defaultLinktreeConfig } from '../config/linktreeConfig';

export const useDomainSEO = () => {
  useEffect(() => {
    const isLinktree = isLinktreeSubdomain();
    
    if (isLinktree) {
      // Update document title
      document.title = defaultLinktreeConfig.seo.title;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', defaultLinktreeConfig.seo.description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = defaultLinktreeConfig.seo.description;
        document.head.appendChild(meta);
      }
      
      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', defaultLinktreeConfig.seo.keywords.join(', '));
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = defaultLinktreeConfig.seo.keywords.join(', ');
        document.head.appendChild(meta);
      }
      
      // Update Open Graph tags
      updateOrCreateMeta('property', 'og:title', defaultLinktreeConfig.seo.title);
      updateOrCreateMeta('property', 'og:description', defaultLinktreeConfig.seo.description);
      updateOrCreateMeta('property', 'og:image', defaultLinktreeConfig.seo.ogImage);
      updateOrCreateMeta('property', 'og:url', 'https://linktree.digcity.my.id');
      updateOrCreateMeta('property', 'og:type', 'website');
      
      // Update Twitter Card tags
      updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
      updateOrCreateMeta('name', 'twitter:title', defaultLinktreeConfig.seo.title);
      updateOrCreateMeta('name', 'twitter:description', defaultLinktreeConfig.seo.description);
      updateOrCreateMeta('name', 'twitter:image', defaultLinktreeConfig.seo.ogImage);
      
      // Update canonical URL
      updateOrCreateLink('canonical', 'https://linktree.digcity.my.id');
    }
  }, []);
};

const updateOrCreateMeta = (attribute: string, value: string, content: string) => {
  const selector = `meta[${attribute}="${value}"]`;
  let meta = document.querySelector(selector);
  
  if (meta) {
    meta.setAttribute('content', content);
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
};

const updateOrCreateLink = (rel: string, href: string) => {
  const selector = `link[rel="${rel}"]`;
  let link = document.querySelector(selector) as HTMLLinkElement;
  
  if (link) {
    link.href = href;
  } else {
    link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
  }
};
