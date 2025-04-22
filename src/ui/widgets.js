// UI functions for rendering sidebar widgets

// Renders the recent posts widget
export function renderRecentPostsWidget(posts, count) {
    const recentPostsListElement = document.querySelector('.recent-posts-list');
    if (!recentPostsListElement) {
        console.warn('Recent posts list element not found.');
        return;
    }

    recentPostsListElement.innerHTML = '';

    if (!posts || posts.length === 0) {
        recentPostsListElement.innerHTML = '<li>No posts found.</li>';
        return;
    }

    const recentPosts = posts.slice(0, count);

    recentPosts.forEach(post => {
        const li = document.createElement('li');
        const postSlug = post.metadata.slug || '#';
        li.innerHTML = `<a href="#/posts/${postSlug}">${post.metadata.title || 'Untitled Post'}</a>`;
        recentPostsListElement.appendChild(li);
    });
}

// Renders the categories widget
export function renderCategoriesWidget(posts, slugify) {
    const categoriesListElement = document.querySelector('.categories-list');
    if (!categoriesListElement) {
        console.warn('Categories widget list element not found.');
        return;
    }

    const categories = new Set();
    posts.forEach(post => {
        if (post.metadata.category) {
            categories.add(post.metadata.category);
        }
    });

    categoriesListElement.innerHTML = '';

    if (categories.size === 0) {
        categoriesListElement.innerHTML = '<li>No categories found.</li>';
        return;
    }

    const sortedCategories = Array.from(categories).sort();

    sortedCategories.forEach(category => {
        const li = document.createElement('li');
        const categorySlug = slugify(category);
        li.innerHTML = `<a href="#/category/${categorySlug}">[ ${category} ]</a>`;
        categoriesListElement.appendChild(li);
    });
}

// Renders the authors widget
export function renderAuthorsWidget(posts, slugify) {
    const authorsListElement = document.querySelector('.authors-list');
    if (!authorsListElement) {
        console.warn('Authors widget list element not found.');
        return;
    }

    const authors = new Set();
    posts.forEach(post => {
        if (post.metadata.author) {
            authors.add(post.metadata.author.trim());
        }
    });

    authorsListElement.innerHTML = '';

    if (authors.size === 0) {
        authorsListElement.innerHTML = '<li>No authors found.</li>';
        return;
    }

    const sortedAuthors = Array.from(authors).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    sortedAuthors.forEach(author => {
        const li = document.createElement('li');
        const authorSlug = slugify(author);
        li.innerHTML = `<a href="#/author/${authorSlug}">[ ${author} ]</a>`;
        authorsListElement.appendChild(li);
    });
}

// Renders the tags widget (tag cloud)
export function renderTagsWidget(posts, slugify) {
    const tagsContainerElement = document.querySelector('.tag-cloud-container');
    if (!tagsContainerElement) {
        console.warn('Tag cloud container element not found.');
        return;
    }

    const allTags = posts.flatMap(post => post.metadata.tags || []);
    const uniqueTags = [...new Set(allTags)];

    tagsContainerElement.innerHTML = '';

    if (uniqueTags.length === 0) {
        tagsContainerElement.innerHTML = '<span>No tags found.</span>';
        return;
    }

    const sortedTags = uniqueTags.sort();

    sortedTags.forEach(tag => {
        const a = document.createElement('a');
        const tagSlug = slugify(tag);
        a.href = `#/tag/${tagSlug}`;
        a.textContent = `#${tag}`;
        tagsContainerElement.appendChild(a);
        tagsContainerElement.appendChild(document.createTextNode(' '));
    });
}
