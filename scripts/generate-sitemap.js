import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const blogsDir = path.join(projectRoot, 'blogs');
const distDir = path.join(projectRoot, 'dist');

const BASE_URL = 'https://exploitlog.vercel.app';

async function loadPostsForSitemap() {
    const posts = [];
    const files = fs.readdirSync(blogsDir).filter(file => file.endsWith('.md'));

    for (const file of files) {
        try {
            const filePath = path.join(blogsDir, file);
            const rawContent = fs.readFileSync(filePath, 'utf-8');
            const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
            const match = rawContent.match(frontMatterRegex);

            if (match && match[1]) {
                const frontMatterRaw = match[1];
                const metadata = yaml.load(frontMatterRaw);

                if (!metadata.slug) {
                    metadata.slug = file.replace('.md', '');
                }
                posts.push({ metadata });
            } else {
                console.warn(`[Sitemap] Could not parse front matter for: ${file}`);
            }
        } catch (error) {
            console.error(`[Sitemap] Error processing file ${file}:`, error);
        }
    }

    posts.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));
    return posts;
}

async function generateSitemap() {
    console.log('[Sitemap] Generating sitemap...');

    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    const posts = await loadPostsForSitemap();
    const sitemapStream = new SitemapStream({ hostname: BASE_URL });

    const staticLinks = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/#/about', changefreq: 'monthly', priority: 0.7 },
        { url: '/#/contact', changefreq: 'monthly', priority: 0.5 },
        { url: '/#/disclaimer', changefreq: 'yearly', priority: 0.3 },
    ];

    staticLinks.forEach(link => sitemapStream.write(link));

    posts.forEach(post => {
        if (post.metadata.slug) {
            sitemapStream.write({
                url: `/#/posts/${post.metadata.slug}`,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: post.metadata.date
            });
        }
    });

    sitemapStream.end();

    try {
        const xml = await streamToPromise(sitemapStream).then(data => data.toString());
        const sitemapPath = path.join(distDir, 'sitemap.xml');
        fs.writeFileSync(sitemapPath, xml);
        console.log(`[Sitemap] Sitemap successfully generated at ${sitemapPath}`);
    } catch (error) {
        console.error('[Sitemap] Error generating sitemap XML:', error);
    }
}

generateSitemap();
