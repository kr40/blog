import { slugify } from '../utils.js';

// Helper function to create author links
export function createAuthorLink(authorName) {
  const name = authorName || 'Unknown Author';
  const authorSlug = slugify(name);
  return `<a href="#/author/${authorSlug}">${name}</a>`;
}

// Helper function to create tags HTML
export function createTagsHtml(tags) {
  return tags && Array.isArray(tags)
    ? tags.map(tag => {
        const tagSlug = slugify(tag);
        return `<a href="#/tag/${tagSlug}">[#${tag}]</a>`;
      }).join(' ')
    : 'N/A';
}

// Helper function to create pagination controls
export function createPaginationControls(currentPage, totalPages, baseUrl) {
  if (totalPages <= 1) return '';

  let paginationHtml = '<div class="pagination">';

  // Previous page link
  if (currentPage > 1) {
    paginationHtml += `<a href="${baseUrl}/page/${currentPage - 1}">Previous</a>`;
  } else {
    paginationHtml += `<span class="disabled">Previous</span>`;
  }

  // Page indicator
  paginationHtml += `<span class="page-indicator">Page ${currentPage} of ${totalPages}</span>`;

  // Next page link
  if (currentPage < totalPages) {
    paginationHtml += `<a href="${baseUrl}/page/${currentPage + 1}">Next</a>`;
  } else {
    paginationHtml += `<span class="disabled">Next</span>`;
  }

  paginationHtml += '</div>';
  return paginationHtml;
}

// Helper function to add copy buttons to code blocks
export function addCopyButtonsToCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre code');

  codeBlocks.forEach((codeBlock) => {
    // Only add button if parent doesn't already have one
    if (!codeBlock.parentNode.querySelector('.copy-button')) {
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.textContent = 'Copy';

      button.addEventListener('click', () => {
        // Copy text content to clipboard
        const code = codeBlock.textContent;
        navigator.clipboard.writeText(code).then(
          () => {
            // Visual feedback
            button.textContent = 'Copied!';
            button.classList.add('copied');

            // Reset after 2 seconds
            setTimeout(() => {
              button.textContent = 'Copy';
              button.classList.remove('copied');
            }, 2000);
          },
          (err) => {
            console.error('Could not copy code: ', err);
            button.textContent = 'Error!';
            setTimeout(() => {
              button.textContent = 'Copy';
            }, 2000);
          }
        );
      });

      codeBlock.parentNode.appendChild(button);
    }
  });
}
