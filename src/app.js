// Main application setup and initialization logic
import { loadAndParsePosts } from './data.js';
import { handleRouteChange, setupRouting } from './router.js';
import { renderAuthorsWidget, renderCategoriesWidget, renderRecentPostsWidget, renderTagsWidget } from './ui/widgets.js';
import { slugify } from './utils.js';

export async function initializeApp() {
    console.log("Initializing application...");

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
    renderTagsWidget(posts, slugify);

    // 3. Setup Routing
    const routerReady = setupRouting();

    // 4. Initial Route Handling
    if (routerReady) {
        handleRouteChange();
    } else {
      console.error("Router setup failed. Cannot handle initial route.");
      const contentArea = document.querySelector('.content-area');
      if (contentArea) contentArea.innerHTML = '<p>Error initializing site navigation. Please try again later.</p>';
    }

    console.log("Application initialization complete.");
}
