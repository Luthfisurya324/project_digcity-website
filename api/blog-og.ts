import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://digcity.my.id'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const buildHtmlResponse = (options: {
  title: string
  description: string
  imageUrl: string
  articleUrl: string
  publishedAt?: string
  updatedAt?: string
  author?: string
  category?: string
  tags?: string[]
}) => {
  const {
    title,
    description,
    imageUrl,
    articleUrl,
    publishedAt,
    updatedAt,
    author,
    category,
    tags = []
  } = options

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image: [imageUrl],
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: author ? { '@type': 'Person', name: author } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'DIGCITY',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo_digcity.png`
      }
    },
    articleSection: category,
    keywords: tags.join(', ')
  }

  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${articleUrl}" />
    <meta property="og:site_name" content="DIGCITY" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${escapeHtml(title)}" />
    <meta property="twitter:description" content="${escapeHtml(description)}" />
    <meta property="twitter:image" content="${imageUrl}" />
    <meta http-equiv="refresh" content="0; url=${articleUrl}" />
    <link rel="canonical" href="${articleUrl}" />
    <script type="application/ld+json">
      ${JSON.stringify(articleJsonLd)}
    </script>
  </head>
  <body>
    <p>Mengarahkan ke <a href="${articleUrl}">${articleUrl}</a>...</p>
  </body>
</html>`
}

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const slugParam = req.query.slug
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam

  if (!slug) {
    res.status(400).send('Missing slug parameter')
    return
  }

  if (!supabase) {
    res.status(500).send('Supabase configuration is missing')
    return
  }

  try {
    const { data, error } = await supabase
      .from('news')
      .select('title, excerpt, image_url, author, category, tags, published_date, updated_at')

    if (error) {
      console.error('[blog-og] Supabase error:', error)
      res.status(500).send('Failed to load article')
      return
    }

    const article = (data || []).find((item) => slugify(item.title) === slug)

    if (!article) {
      const fallbackHtml = buildHtmlResponse({
        title: 'DIGCITY Blog',
        description: 'Temukan berita dan artikel terbaru dari DIGCITY.',
        imageUrl: `${SITE_URL}/logo_digcity.png`,
        articleUrl: `${SITE_URL}/blog`
      })

      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'public, max-age=60')
      res.status(404).send(fallbackHtml)
      return
    }

    const imageUrl =
      article.image_url && article.image_url.startsWith('http')
        ? article.image_url
        : `${SITE_URL}${article.image_url || '/logo_digcity.png'}`
    const description = article.excerpt || 'Baca artikel terbaru dari DIGCITY.'
    const articleUrl = `${SITE_URL}/blog/${slug}`

    const html = buildHtmlResponse({
      title: article.title,
      description,
      imageUrl,
      articleUrl,
      publishedAt: article.published_date,
      updatedAt: article.updated_at,
      author: article.author,
      category: article.category,
      tags: article.tags || []
    })

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=120')
    res.status(200).send(html)
  } catch (err) {
    console.error('[blog-og] Unexpected error:', err)
    res.status(500).send('Internal server error')
  }
}

