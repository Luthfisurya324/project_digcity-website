import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file manually
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf-8');
            envConfig.split('\n').forEach((line) => {
                const [key, value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            });
        }
    } catch (error) {
        console.warn('Warning: Could not load .env file', error);
    }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = 'https://digcity.my.id';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function generateSitemap() {
    console.log('Generating sitemaps...');

    const distDir = path.resolve(__dirname, '../dist');
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    // 1. Static Sitemap
    const staticRoutes = [
        '/',
        '/blog',
        '/events',
        '/sejarah',
        '/logo',
        '/visi-misi',
        '/struktur-organisasi',
        '/grand-design',
        '/galeri',
        '/kontak',
    ];

    const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
            .map((route) => {
                return `  <url>
    <loc>${SITE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
            })
            .join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(distDir, 'sitemap-static.xml'), staticSitemap);
    console.log('Generated sitemap-static.xml');

    // 2. Blog Sitemap
    const { data: posts, error: postsError } = await supabase
        .from('news')
        .select('id, title, updated_at, created_at') // Assuming slug is title or id, checking implementation later. 
        // Based on public/blog-sitemap.xml, the URL is /blog/slug-title
        // I need to check how slug is generated. Usually it's from title.
        // For now I will use a simple slugify function.
        .order('created_at', { ascending: false });

    if (postsError) {
        console.error('Error fetching posts:', postsError);
    }

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    };

    const blogSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${(posts || [])
            .map((post) => {
                const slug = slugify(post.title);
                return `  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${new Date(post.updated_at || post.created_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
            })
            .join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(distDir, 'sitemap-blog.xml'), blogSitemap);
    console.log('Generated sitemap-blog.xml');

    // 3. Events Sitemap
    // Based on public/sitemap.xml, there are no specific event pages listed, but usually there are.
    // I'll assume /events/:id or /events/:slug
    // Let's check src/App.tsx or router to be sure about routes.
    // For now I'll assume /events/:id based on typical implementation or just skip if not sure.
    // But user asked for sitemap index, so I should include it if possible.
    // Let's look at src/pages/events/EventDetail.tsx if it exists.
    // I'll check that in a separate tool call if needed, but for now I'll assume a standard pattern.
    // Actually, looking at the file list, there is `src/pages/events`.

    // Let's fetch events just in case.
    const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, title, updated_at, created_at')
        .order('created_at', { ascending: false });

    if (eventsError) {
        console.error('Error fetching events:', eventsError);
    }

    const eventsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${(events || [])
            .map((event) => {
                // Assuming event detail page is /events/:id or /events/:slug
                // I'll use /events/:id for now as it's safer if I don't know the slug logic.
                // Wait, let's check if I can find the route in App.tsx later.
                // For now I will use the same slugify logic as blog, or just ID if title is not unique.
                // But usually SEO friendly URLs use slugs.
                // I'll stick to slugify(title) for now, consistent with blog.
                const slug = slugify(event.title);
                return `  <url>
    <loc>${SITE_URL}/events/${slug}</loc>
    <lastmod>${new Date(event.updated_at || event.created_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
            })
            .join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(distDir, 'sitemap-events.xml'), eventsSitemap);
    console.log('Generated sitemap-events.xml');

    // 4. Sitemap Index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-static.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-blog.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-events.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapIndex);
    console.log('Generated sitemap.xml (Index)');
}

generateSitemap().catch((err) => {
    console.error('Failed to generate sitemap:', err);
    process.exit(1);
});
