import { marked } from 'marked';
import { slugify } from './utils.js';

// --- Highlight.js Setup ---
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml'; // For HTML/XML syntax
import 'highlight.js/styles/atom-one-dark.css'; // Import the theme CSS

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
// ---------------------------

// --- Get DOM elements ---
const markdownInput = document.getElementById('markdown-input');
const htmlPreview = document.getElementById('html-preview');
const downloadButton = document.getElementById('download-button');

// Frontmatter inputs
const fmTitle = document.getElementById('fm-title');
const fmSlug = document.getElementById('fm-slug');
const fmDate = document.getElementById('fm-date');
const fmAuthor = document.getElementById('fm-author');
const fmType = document.getElementById('fm-type');
const fmCategory = document.getElementById('fm-category');
const fmTags = document.getElementById('fm-tags');

// --- Helper Functions ---

// Function to update preview
async function updatePreview() {
    if (!markdownInput || !htmlPreview) return;

    const markdownText = markdownInput.value;
    try {
        const html = await marked.parse(markdownText);
        htmlPreview.innerHTML = html;

        // Apply highlighting to code blocks within the preview
        htmlPreview.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightElement(block);
        });

    } catch (error) {
        console.error('Error parsing Markdown:', error);
        htmlPreview.innerHTML = '<p style="color: red;">Error parsing Markdown. Check console.</p>';
    }
}

// Function to generate full file content
function generateFileContent() {
    const title = fmTitle.value || 'Untitled Post';
    const slug = fmSlug.value || slugify(title);
    const date = fmDate.value || new Date().toISOString().slice(0, 10);
    const author = fmAuthor.value || '';
    const type = fmType.value || '';
    const category = fmCategory.value || '';
    // Convert comma-separated tags to YAML list format
    const tags = fmTags.value
        ? `[${fmTags.value.split(',').map(tag => `"${tag.trim()}"`).join(', ')}]`
        : '[]';

    const frontmatter = `---
title: "${title}"
date: "${date}"
author: "${author}"
type: "${type}"
category: "${category}"
tags: ${tags}
slug: "${slug}"
---`;

    const markdownContent = markdownInput.value;

    return `${frontmatter}\n\n${markdownContent}`;
}

// Function to handle download
function downloadFile() {
    const content = generateFileContent();
    const slug = fmSlug.value || slugify(fmTitle.value || 'new-post');
    const filename = `${slug}.md`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// --- Event Listeners Setup ---

// Auto-update slug from title (only if slug is empty)
if (fmTitle && fmSlug) {
    fmTitle.addEventListener('input', () => {
        if (!fmSlug.value) { // Don't overwrite if user typed in slug
            fmSlug.placeholder = slugify(fmTitle.value || 'auto-generated-from-title');
        }
    });
     fmTitle.addEventListener('blur', () => {
        if (!fmSlug.value) {
            fmSlug.value = slugify(fmTitle.value || '');
        }
    });
}

// Set default date
if (fmDate && !fmDate.value) {
    fmDate.value = new Date().toISOString().slice(0, 10);
}

// Update preview on markdown input
if (markdownInput) {
    markdownInput.addEventListener('input', updatePreview);
}

// Handle download button click
if (downloadButton) {
    downloadButton.addEventListener('click', downloadFile);
}

// --- Markdown Cheatsheet Modal Logic ---
const helpButton = document.getElementById('help-button');
const modalOverlay = document.getElementById('markdown-modal');
const closeModalButton = document.getElementById('close-modal');

if (helpButton && modalOverlay && closeModalButton) {
    helpButton.addEventListener('click', () => {
        modalOverlay.classList.remove('hidden');
    });

    closeModalButton.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
    });

    // Optional: Close modal if clicking outside the content area
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) { // Check if the click is on the overlay itself
            modalOverlay.classList.add('hidden');
        }
    });
} else {
    console.warn('Modal elements not found. Cheatsheet functionality disabled.');
}

// Initial preview update (Run once on script load)
updatePreview();
