// Utility functions

// Slugify text for URLs/IDs
export function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/[^-a-z0-9]+/g, '') // Remove all non-word chars except hyphens
        .replace(/--+/g, '-')     // Replace multiple - with single -
        .replace(/^-+/, '')      // Trim - from start of text
        .replace(/-+$/, '');     // Trim - from end of text
}

// Add other general utility functions here if needed
