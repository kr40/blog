import { getAllPosts } from '../data.js';
import { renderPostList } from './pages.js'; // Assuming renderPostList is in pages.js

let searchInputElement = null;
let contentAreaElement = null;
let allPosts = [];

function handleSearchInput() {
    if (!searchInputElement || !contentAreaElement || !allPosts.length) {
        return; // Elements or posts not ready
    }

    const searchTerm = searchInputElement.value.trim().toLowerCase();
    // Re-select content area in case the DOM was modified externally
    const contentArea = document.querySelector('.content-area');

    if (!contentArea) {
      return; // Cannot display results
    }

    if (!searchTerm) {
        // If search is cleared, render all posts
        renderPostList(allPosts, contentArea, "All Posts");
        // Update URL to match the content being shown
        if (window.location.hash.startsWith('#/posts/')) {
            window.history.pushState(null, '', '#/');
        }
        return;
    }

    const filteredPosts = allPosts.filter(post =>
        post.metadata.title.toLowerCase().includes(searchTerm)
    );

    // Render filtered results using the standard post list renderer
    // Pass null for pagination options (search results are not paginated)
    renderPostList(filteredPosts, contentArea, `Search Results for: "${searchTerm}"`, null);
}

function handleSearchKeydown(event) {
    // Check if the pressed key is Enter
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();

        const searchTerm = searchInputElement.value.trim().toLowerCase();
        if (!searchTerm) return;

        const filteredPosts = allPosts.filter(post =>
            post.metadata.title.toLowerCase().includes(searchTerm)
        );

        // If there's at least one result, navigate to the first one
        if (filteredPosts.length > 0) {
            // Get the slug of the first result and navigate to it
            const firstResultSlug = filteredPosts[0].metadata.slug;
            if (firstResultSlug) {
                window.location.hash = `#/posts/${firstResultSlug}`;
            }
        }
    } else if (event.key === 'Escape' || event.keyCode === 27) {
        // Clear search input and reset view to all posts when Escape is pressed
        searchInputElement.value = '';
        // Update the URL to match the content being shown (all posts)
        window.location.hash = '#/';
        // Handle search input will be triggered by the URL change event
    }
}

export function setupSearchWidget() {
    searchInputElement = document.getElementById('search-input');
    contentAreaElement = document.querySelector('.content-area');
    allPosts = getAllPosts();

    if (!searchInputElement || !contentAreaElement) {
        return false; // Essential elements missing
    }
    // It's okay if posts haven't loaded yet; search just won't work initially.

    searchInputElement.addEventListener('input', handleSearchInput);
    searchInputElement.addEventListener('keydown', handleSearchKeydown);

    return true;
}
