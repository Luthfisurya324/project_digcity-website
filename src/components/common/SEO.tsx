import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
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

const SEO: React.FC<SEOProps> = ({
    title = 'DIGCITY - Himpunan Mahasiswa Bisnis Digital UIKA Bogor',
    description = 'Website resmi DIGCITY, Himpunan Mahasiswa Bisnis Digital Universitas Ibn Khaldun Bogor. Organisasi yang berdampak, adaptif, inovatif, dan kompeten untuk pengembangan potensi mahasiswa.',
    keywords = 'DIGCITY, Himpunan Mahasiswa, Bisnis Digital, UIKA Bogor, Universitas Ibn Khaldun, Organisasi Mahasiswa, Digital Business',
    ogTitle,
    ogDescription,
    ogImage = '/logo_digcity.png',
    ogUrl = 'https://digcity.my.id/',
    twitterTitle,
    twitterDescription,
    twitterImage = '/logo_digcity.png',
    canonicalUrl,
    structuredData
}) => {
    const siteTitle = title;
    const siteDescription = description;
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://digcity.my.id';
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
    const fullCanonicalUrl = canonicalUrl ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${siteUrl}${canonicalUrl}`) : undefined;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={siteDescription} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={ogTitle || siteTitle} />
            <meta property="og:description" content={ogDescription || siteDescription} />
            <meta property="og:image" content={fullOgImage} />
            <meta property="og:url" content={ogUrl} />
            <meta property="og:site_name" content="DIGCITY" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={twitterTitle || ogTitle || siteTitle} />
            <meta name="twitter:description" content={twitterDescription || ogDescription || siteDescription} />
            <meta name="twitter:image" content={twitterImage || fullOgImage} />

            {/* Canonical URL */}
            {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}

            {/* Structured Data (JSON-LD) */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
