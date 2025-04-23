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
        return;
    }

    const filteredPosts = allPosts.filter(post =>
        post.metadata.title.toLowerCase().includes(searchTerm)
    );

    // Render filtered results using the standard post list renderer
    // Pass null for pagination options (search results are not paginated)
    renderPostList(filteredPosts, contentArea, `Search Results for: "${searchTerm}"`, null);
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

    return true;
}
