// UI functions for rendering main content pages
import hljs from 'highlight.js'; // Import highlight.js
import { slugify } from '../utils.js'; // Import slugify

// Helper functions
function createAuthorLink(authorName) {
  const name = authorName || 'Unknown Author';
  const authorSlug = slugify(name);
  return `<a href="#/author/${authorSlug}">${name}</a>`;
}

function createTagsHtml(tags) {
  return tags && Array.isArray(tags)
    ? tags.map(tag => {
        const tagSlug = slugify(tag);
        return `<a href="#/tag/${tagSlug}">[#${tag}]</a>`;
      }).join(' ')
    : 'N/A';
}

// Function to add copy buttons to code blocks
function addCopyButtonsToCodeBlocks() {
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

// Renders the list of posts (homepage, filtered views)
export function renderPostList(posts, targetElement, listTitle = "Blog Posts") {
    targetElement.innerHTML = ''; // Clear previous content

    // Add a title for the list view
    const titleElement = document.createElement('h2');
    titleElement.textContent = listTitle;
    titleElement.style.fontFamily = 'var(--font-mono)';
    titleElement.style.marginBottom = '20px';
    titleElement.style.borderBottom = '1px solid var(--border-color)';
    titleElement.style.paddingBottom = '10px';
    targetElement.appendChild(titleElement);

    if (!posts || posts.length === 0) {
        targetElement.innerHTML += '<p>No posts found matching the criteria.</p>';
        return;
    }

    const moreTag = '<!-- more -->';

    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.classList.add('post');

        const authorLink = createAuthorLink(post.metadata.author);
        const tagsHtml = createTagsHtml(post.metadata.tags);

        let postContentHtml = post.htmlContent;
        let readMoreLink = '';
        const moreTagIndex = postContentHtml.indexOf(moreTag);

        if (moreTagIndex !== -1) {
            postContentHtml = postContentHtml.substring(0, moreTagIndex);
            readMoreLink = `<a href="#/posts/${post.metadata.slug}" class="read-more">[ Continue Reading &rarr; ]</a>`;
        }

        postElement.innerHTML = `
          <header class="post-header">
            <h2><a href="#/posts/${post.metadata.slug}">${post.metadata.title || 'Untitled Post'}</a></h2>
            <div class="post-meta">
              <span><span class="meta-prompt">&gt;</span> Posted: ${post.metadata.date || 'Unknown Date'}</span> |
              <span><span class="meta-prompt">&gt;</span> Author: ${authorLink}</span> |
              <span><span class="meta-prompt">&gt;</span> Tags: ${tagsHtml}</span>
            </div>
          </header>
          <div class="post-content">
            ${postContentHtml}
            ${readMoreLink}
          </div>
        `;
        targetElement.appendChild(postElement);
    });

    hljs.highlightAll(); // Apply highlighting after adding all posts
    addCopyButtonsToCodeBlocks();

    // Optional: Add pagination if needed
}

// Renders a single full post
export function renderSinglePost(post, targetElement) {
    targetElement.innerHTML = ''; // Clear previous content

    const postElement = document.createElement('article');
    postElement.classList.add('post');

    const authorLink = createAuthorLink(post.metadata.author);
    const tagsHtml = createTagsHtml(post.metadata.tags);

    postElement.innerHTML = `
      <header class="post-header">
        <h2>${post.metadata.title || 'Untitled Post'}</h2>
        <div class="post-meta">
          <span><span class="meta-prompt">&gt;</span> Posted: ${post.metadata.date || 'Unknown Date'}</span> |
          <span><span class="meta-prompt">&gt;</span> Author: ${authorLink}</span> |
          <span><span class="meta-prompt">&gt;</span> Tags: ${tagsHtml}</span>
        </div>
      </header>
      <div class="post-content">
        ${post.htmlContent} <!-- Full content -->
        <p><a href="#">&larr; Back to posts</a></p>
      </div>
    `;
    targetElement.appendChild(postElement);
    hljs.highlightAll(); // Apply highlighting after adding the single post
    addCopyButtonsToCodeBlocks();
}

// Renders the About page content
export function renderAboutPage(targetElement) {
    targetElement.innerHTML = `
        <article class="post">
            <header class="post-header">
                <h2>About ./The_Exploit_Log</h2>
            </header>
            <div class="post-content">
                <p>Welcome to The Exploit Log, your terminal-themed portal for cybersecurity insights, tutorials, and tool analysis.</p>
                <p>This project is dedicated to exploring the world of ethical hacking, defensive security, and the code that powers it all.</p>
                <p>Created by [Your Name/Handle] as a demonstration project.</p>
            </div>
        </article>
    `;
    hljs.highlightAll();
    addCopyButtonsToCodeBlocks();
}

// Renders the Contact page content
export function renderContactPage(targetElement) {
    targetElement.innerHTML = `
        <article class="post">
            <header class="post-header">
                <h2>Contact Us</h2>
            </header>
            <div class="post-content">
                <p>Have questions, suggestions, or want to report a vulnerability (in the site demo, not a real one!)?</p>
                <p>Reach out via the following (placeholder):</p>
                <ul>
                    <li>Email: contact@theexploitlog.example.com</li>
                    <li>GitHub: [Link to Repo]</li>
                    <li>Twitter: @TheExploitLog (maybe)</li>
                </ul>
                 <p>Alternatively, fill out this definitely non-functional form:</p>
                <form action="#">
                    <div><label>Name: <input type="text" disabled></label></div>
                    <div><label>Email: <input type="email" disabled></label></div>
                    <div><label>Message: <textarea disabled></textarea></label></div>
                    <div><button type="submit" disabled>[ Send Message ]</button></div>
                </form>
            </div>
        </article>
    `;
    hljs.highlightAll();
    addCopyButtonsToCodeBlocks();
}

// Renders the Disclaimer page content
export function renderDisclaimerPage(targetElement) {
    targetElement.innerHTML = `
        <article class="post">
            <header class="post-header">
                <h2>Disclaimer</h2>
            </header>
            <div class="post-content">
                <p>The information provided on The Exploit Log is for educational purposes only. Any actions and/or activities related to the material contained within this website are solely your responsibility.</p>
                <p>The misuse of the information on this website can result in criminal charges brought against the persons in question. The authors and administrators will not be held responsible in the event any criminal charges be brought against any individuals misusing the information in this website to break the law.</p>
                <p>This website contains materials that can be potentially damaging or dangerous. If you do not fully understand something on this website, then GOOGLE IT! Refer to the laws in your province/country before accessing, using, or in any other way utilizing these materials.</p>
            </div>
        </article>
    `;
    hljs.highlightAll();
    addCopyButtonsToCodeBlocks();
}

// Renders a 'Not Found' message
export function renderNotFound(targetElement) {
    targetElement.innerHTML = `
      <article class="post">
        <h2>Post Not Found</h2>
        <p>Sorry, the post you were looking for does not exist.</p>
        <p><a href="#">&larr; Back to posts</a></p>
      </article>
    `;
    hljs.highlightAll();
    addCopyButtonsToCodeBlocks();
}
