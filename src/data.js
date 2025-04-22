// Data loading and parsing logic
import yaml from 'js-yaml';
import { marked } from 'marked';

let allPostsData = [];

export function getAllPosts() {
    return [...allPostsData];
}

export async function loadAndParsePosts() {
  allPostsData = [];

  const blogModules = import.meta.glob('/blogs/*.md', { query: '?raw', import: 'default' });
  const posts = [];

  for (const path in blogModules) {
    try {
      const rawContent = await blogModules[path]();
      const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
      const match = rawContent.match(frontMatterRegex);

      if (match && match[1] && match[2]) {
        const frontMatterRaw = match[1];
        const markdownContent = match[2];

        const metadata = yaml.load(frontMatterRaw);
        const htmlContent = await marked.parse(markdownContent.trim());

        if (!metadata.slug) {
          metadata.slug = path.split('/').pop().replace('.md', '');
        }

        posts.push({ metadata, htmlContent, path });
      } else {
        console.warn(`Could not parse front matter for: ${path}`);
      }
    } catch (error) {
      console.error(`Error processing file ${path}:`, error);
    }
  }

  posts.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));

  allPostsData = posts;
  console.log("Posts loaded and parsed:", allPostsData.length);
  return getAllPosts();
}
