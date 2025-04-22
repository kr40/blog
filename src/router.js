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
    const tagMatch = hash.match(/^#\/tag\/(.+)$/);
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
        } else if (baseRoute.startsWith('#/tag/')) {
            const tagSlug = baseRoute.replace('#/tag/', '');
            let tagName = '';
            const filteredPosts = allPosts.filter(p => {
                if (p.metadata.tags && Array.isArray(p.metadata.tags)) {
                    return p.metadata.tags.some(tag => {
                        const currentTagSlug = slugify(tag);
                        if (currentTagSlug === tagSlug) {
                            tagName = tag;
                            return true;
                        }
                        return false;
                    });
                }
                return false;
            });
            renderPostList(filteredPosts, contentAreaElement, `Tag: #${tagName || tagSlug}`, { currentPage: pageNumber, baseUrl: baseRoute });
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
    } else if (tagMatch && tagMatch[1]) {
        // Filter by Tag
        const tagSlug = tagMatch[1];
        let tagName = '';
        const filteredPosts = allPosts.filter(p => {
            if (p.metadata.tags && Array.isArray(p.metadata.tags)) {
                return p.metadata.tags.some(tag => {
                    const currentTagSlug = slugify(tag);
                    if (currentTagSlug === tagSlug) {
                        tagName = tag;
                        return true;
                    }
                    return false;
                });
            }
            return false;
        });
        renderPostList(filteredPosts, contentAreaElement, `Tag: #${tagName || tagSlug}`, { baseUrl: `#/tag/${tagSlug}` });
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
}
