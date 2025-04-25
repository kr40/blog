import { getAllPosts } from './data.js';
import { updateActiveNavLink } from './ui/nav.js';
import {
    renderAboutPage,
    renderContactPage,
    renderDisclaimerPage,
    renderNotFound,
    renderPostList,
    renderSinglePost
} from './ui/pages.js';
import { renderTagsWidget } from './ui/widgets.js';
import { slugify } from './utils.js';

let contentAreaElement = null;

export function setupRouting() {
    contentAreaElement = document.querySelector('.content-area');
    if (!contentAreaElement) {
        console.error('Error: Could not find .content-area element.');
        return false;
    }
    window.addEventListener('hashchange', handleRouteChange);
    return true;
}

export function handleRouteChange() {
    if (!contentAreaElement) {
        console.error('Cannot handle route change, content area not found.');
        return;
    }

    const hash = window.location.hash || '#';
    const allPosts = getAllPosts();

    updateActiveNavLink(hash);
    contentAreaElement.innerHTML = '';

    // Route definitions
    const postMatch = hash.match(/^#\/posts\/(.+)$/);
    const typeMatch = hash.match(/^#\/type\/(.+)$/);
    const categoryMatch = hash.match(/^#\/category\/(.+)$/);
    const tagsMatch = hash.match(/^#\/tags\/(.+)$/);
    const authorMatch = hash.match(/^#\/author\/(.+)$/);
    const pageMatch = hash.match(/^(#(?:\/[^\/]+(?:\/[^\/]+)?)?)\/page\/(\d+)$/);

    // Handle pagination routes first
    if (pageMatch) {
        const [, baseRoute, pageNumberStr] = pageMatch;
        const pageNumber = parseInt(pageNumberStr, 10);

        // Determine which type of listing we're paginating
        if (baseRoute === '#' || baseRoute === '') {
            // Homepage pagination
            renderPostList(allPosts, contentAreaElement, "All Posts", { currentPage: pageNumber, baseUrl: '#' });
        } else if (baseRoute.startsWith('#/type/')) {
            const type = baseRoute.replace('#/type/', '');
            const filterType = type.endsWith('s') ? type.slice(0, -1) : type;
            const filteredPosts = allPosts.filter(p => p.metadata.type && p.metadata.type.toLowerCase() === filterType.toLowerCase());
            const title = type.charAt(0).toUpperCase() + type.slice(1);
            renderPostList(filteredPosts, contentAreaElement, `Showing: ${title}`, { currentPage: pageNumber, baseUrl: baseRoute });
        } else if (baseRoute.startsWith('#/category/')) {
            const categorySlug = baseRoute.replace('#/category/', '');
            let categoryName = '';
            const filteredPosts = allPosts.filter(p => {
                if (p.metadata.category) {
                    const currentCategorySlug = slugify(p.metadata.category);
                    if (currentCategorySlug === categorySlug) {
                        categoryName = p.metadata.category;
                        return true;
                    }
                }
                return false;
            });
            renderPostList(filteredPosts, contentAreaElement, `Category: ${categoryName || categorySlug}`, { currentPage: pageNumber, baseUrl: baseRoute });
        } else if (baseRoute.startsWith('#/tags/')) {
            const tagSlugsString = baseRoute.replace('#/tags/', '');
            const selectedTagSlugs = tagSlugsString.split('+').filter(Boolean);

            const filteredPosts = allPosts.filter(p => {
                const postTags = p.metadata.tags || [];
                const postTagSlugs = new Set(postTags.map(slugify));
                return selectedTagSlugs.every(slug => postTagSlugs.has(slug));
            });
            const title = `Tags: #${selectedTagSlugs.join(' + #')}`;
            renderPostList(filteredPosts, contentAreaElement, title, { currentPage: pageNumber, baseUrl: baseRoute });
        } else if (baseRoute.startsWith('#/author/')) {
            const authorSlug = baseRoute.replace('#/author/', '');
            let authorName = '';

            const filteredPosts = allPosts.filter(p => {
                if (p.metadata.author) {
                    const currentAuthorSlug = slugify(p.metadata.author);
                    if (currentAuthorSlug === authorSlug) {
                        if (!authorName) authorName = p.metadata.author;
                        return true;
                    }
                }
                return false;
            });
            renderPostList(filteredPosts, contentAreaElement, `Author: ${authorName || authorSlug}`, { currentPage: pageNumber, baseUrl: baseRoute });
        }
    } else if (postMatch && postMatch[1]) {
        // Single Post View
        const slug = postMatch[1];
        const post = allPosts.find(p => p.metadata.slug === slug);
        if (post) {
            renderSinglePost(post, contentAreaElement);
        } else {
            renderNotFound(contentAreaElement);
        }
    } else if (typeMatch && typeMatch[1]) {
        // Filter by Type
        const type = typeMatch[1];
        const filterType = type.endsWith('s') ? type.slice(0, -1) : type;
        const filteredPosts = allPosts.filter(p => p.metadata.type && p.metadata.type.toLowerCase() === filterType.toLowerCase());
        const title = type.charAt(0).toUpperCase() + type.slice(1);
        renderPostList(filteredPosts, contentAreaElement, `Showing: ${title}`, { baseUrl: `#/type/${type}` });
    } else if (categoryMatch && categoryMatch[1]) {
        // Filter by Category
        const categorySlug = categoryMatch[1];
        let categoryName = '';
        const filteredPosts = allPosts.filter(p => {
            if (p.metadata.category) {
                const currentCategorySlug = slugify(p.metadata.category);
                if (currentCategorySlug === categorySlug) {
                    categoryName = p.metadata.category;
                    return true;
                }
            }
            return false;
        });
        renderPostList(filteredPosts, contentAreaElement, `Category: ${categoryName || categorySlug}`, { baseUrl: `#/category/${categorySlug}` });
    } else if (tagsMatch && tagsMatch[1]) {
        const tagSlugsString = tagsMatch[1];
        const selectedTagSlugs = tagSlugsString.split('+').filter(Boolean);

        const filteredPosts = allPosts.filter(p => {
            const postTags = p.metadata.tags || [];
            const postTagSlugs = new Set(postTags.map(slugify));
            return selectedTagSlugs.every(slug => postTagSlugs.has(slug));
        });
        const title = `Tags: #${selectedTagSlugs.join(' + #')}`;
        renderPostList(filteredPosts, contentAreaElement, title, { baseUrl: `#/tags/${tagSlugsString}` });
    } else if (authorMatch && authorMatch[1]) {
        // Filter by Author
        const authorSlug = authorMatch[1];
        let authorName = '';

        const filteredPosts = allPosts.filter(p => {
            if (p.metadata.author) {
                const currentAuthorSlug = slugify(p.metadata.author);
                if (currentAuthorSlug === authorSlug) {
                    if (!authorName) authorName = p.metadata.author;
                    return true;
                }
            }
            return false;
        });
        renderPostList(filteredPosts, contentAreaElement, `Author: ${authorName || authorSlug}`, { baseUrl: `#/author/${authorSlug}` });
    } else if (hash === '#/about') {
        // About Page
        renderAboutPage(contentAreaElement);
    } else if (hash === '#/contact') {
        // Contact Page
        renderContactPage(contentAreaElement);
    } else if (hash === '#/disclaimer') {
        // Disclaimer Page
        renderDisclaimerPage(contentAreaElement);
    } else {
        // Default route (homepage / all posts)
        renderPostList(allPosts, contentAreaElement, "All Posts");
    }

    // Re-render tags widget AFTER main content is updated to reflect current selection
    renderTagsWidget(allPosts, slugify);
}
