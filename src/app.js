// Main application setup and initialization logic
import { loadAndParsePosts } from './data.js';
import { handleRouteChange, setupRouting } from './router.js';
import { setupSearchWidget } from './ui/search.js';
import { renderAuthorsWidget, renderCategoriesWidget, renderRecentPostsWidget, renderTagsWidget } from './ui/widgets.js';
import { slugify } from './utils.js';

// Function to reset any limit-related tooltips
function resetLimitTooltips() {
    document.querySelectorAll('.tag-cloud-container a[data-limit-reached]').forEach(el => {
        el.removeAttribute('data-limit-reached');
        el.removeAttribute('title'); // Remove title attribute entirely
    });
}

// Function to handle tag clicks
function handleTagClick(event) {
    if (event.target.tagName === 'A' && event.target.dataset.tagSlug) {
        event.preventDefault();
        const clickedTagElement = event.target;
        const clickedSlug = clickedTagElement.dataset.tagSlug;
        let currentSelectedSlugs = [];

        // Get current selection from hash
        const currentHash = window.location.hash;
        if (currentHash.startsWith('#/tags/')) {
            currentSelectedSlugs = currentHash.substring(7).split('+').filter(Boolean);
        }

        const isSelected = currentSelectedSlugs.includes(clickedSlug);
        let newSelectedSlugs = [];
        let limitReached = false;

        if (isSelected) {
            // Deselect
            newSelectedSlugs = currentSelectedSlugs.filter(slug => slug !== clickedSlug);
            resetLimitTooltips(); // Reset tooltips as limit is no longer reached
        } else {
            // Select
            if (currentSelectedSlugs.length < 3) {
                newSelectedSlugs = [...currentSelectedSlugs, clickedSlug];
                resetLimitTooltips(); // Reset tooltips as limit wasn't hit
            } else {
                // Limit reached
                limitReached = true;
                resetLimitTooltips(); // Clear any old unrelated tooltips first
                document.querySelectorAll('.tag-cloud-container a:not(.selected-tag)').forEach(tagLink => {
                    tagLink.title = 'Maximum 3 tags allowed.';
                    tagLink.setAttribute('data-limit-reached', 'true'); // Mark for reset
                });
                // Ensure the clicked tag also gets the feedback
                clickedTagElement.title = 'Maximum 3 tags allowed.';
                clickedTagElement.setAttribute('data-limit-reached', 'true');

                return; // Do nothing else
            }
        }

        // Update the hash only if the selection changed (and limit wasn't hit)
        if (!limitReached) {
             if (newSelectedSlugs.length > 0) {
                 window.location.hash = `#/tags/${newSelectedSlugs.join('+')}`;
             } else {
                 window.location.hash = '#/'; // No tags selected, go to homepage
             }
        }
    }
}

export async function initializeApp() {
    // 1. Load Data
    const posts = await loadAndParsePosts();
    if (!posts) {
        console.error("Failed to load posts. Aborting initialization.");
        const contentArea = document.querySelector('.content-area');
        if (contentArea) contentArea.innerHTML = '<p>Error loading site content. Please try again later.</p>';
        return;
    }

    // 2. Render Static Widgets
    renderRecentPostsWidget(posts, 5);
    renderCategoriesWidget(posts, slugify);
    renderAuthorsWidget(posts, slugify);
    renderTagsWidget(posts, slugify); // Initial render

    // 2.1 Setup Search Widget (after posts are loaded)
    setupSearchWidget();

    // 2.2 Setup Tag Click Listener (only once)
    const tagsContainerElement = document.querySelector('.tag-cloud-container');
    if (tagsContainerElement) {
        tagsContainerElement.addEventListener('click', handleTagClick);
    } else {
        console.warn('Tag cloud container not found for attaching click listener.');
    }

    // 3. Setup Routing
    const routerReady = setupRouting();

    // 4. Initial Route Handling
    if (routerReady) {
        handleRouteChange(); // This will call renderTagsWidget again via router
    } else {
      console.error("Router setup failed. Cannot handle initial route.");
      const contentArea = document.querySelector('.content-area');
      if (contentArea) contentArea.innerHTML = '<p>Error initializing site navigation. Please try again later.</p>';
    }
}
