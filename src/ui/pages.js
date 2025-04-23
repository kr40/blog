// UI functions for rendering main content pages
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml'; // For HTML
import {
    addCopyButtonsToCodeBlocks,
    createAuthorLink,
    createPaginationControls,
    createTagsHtml
} from './uiUtils.js'; // Import UI helpers

// Register only the languages we need
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);

// Constants
const POSTS_PER_PAGE = 3; // Number of posts to display per page

// Renders the list of posts (homepage, filtered views)
export function renderPostList(posts, targetElement, listTitle = "Blog Posts", options = {}) {
    // Use || {} to provide a fallback empty object if options is null/undefined
    const { currentPage = 1, baseUrl = '#' } = options || {};
    targetElement.innerHTML = '';

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

    // Calculate pagination
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    // Ensure current page is valid
    const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

    // Get posts for current page
    const startIndex = (validCurrentPage - 1) * POSTS_PER_PAGE;
    const endIndex = Math.min(startIndex + POSTS_PER_PAGE, totalPosts);
    const postsForCurrentPage = posts.slice(startIndex, endIndex);

    const moreTag = '<!-- more -->';

    postsForCurrentPage.forEach(post => {
        const postElement = document.createElement('article');
        postElement.classList.add('post');

        const authorLink = createAuthorLink(post.metadata.author);
        const tagsHtml = createTagsHtml(post.metadata.tags);

        let postContentHtml = post.htmlContent;
        let readMoreLink = '';
        const moreTagIndex = postContentHtml.indexOf(moreTag);

        if (moreTagIndex !== -1) {
            postContentHtml = postContentHtml.substring(0, moreTagIndex);
            readMoreLink = `<a href="#/posts/${post.metadata.slug}" class="read-more">[ Continue Reading ]</a>`;
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

    // Add pagination controls
    if (totalPages > 1) {
        const paginationContainer = document.createElement('div');
        paginationContainer.innerHTML = createPaginationControls(validCurrentPage, totalPages, baseUrl);
        targetElement.appendChild(paginationContainer);
    }

    hljs.highlightAll();
    addCopyButtonsToCodeBlocks();
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
                <p>Welcome to The Exploit Log, a blog by Kartik Rao (also known as K4Rt1k or kr40).</p>
                <p>Based in India, I focus on Red Teaming and Cybersecurity Research. Here, I share my findings, research, CTF writeups, and tutorials related to the world of ethical hacking and security.</p>
                <p>Connect with me:</p>
                <ul>
                    <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/kr40/" target="_blank">linkedin.com/in/kr40</a></li>
                    <li><strong>GitHub:</strong> <a href="https://github.com/kr40/" target="_blank">github.com/kr40</a></li>
                </ul>
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
                <h2>Contact</h2>
            </header>
            <div class="post-content">
                <p>Have questions, suggestions, or want to discuss a project? Reach out:</p>
                <ul>
                    <li><strong>Email:</strong> <a href="mailto:kr40.git@gmail.com">kr40.git@gmail.com</a></li>
                    <li><strong>Twitter:</strong> <a href="https://twitter.com/kr40_in" target="_blank">@kr40_in</a></li>
                    <li><strong>GitHub:</strong> <a href="https://github.com/kr40/" target="_blank">github.com/kr40</a></li>
                </ul>
                <hr style="border-color: var(--border-color); margin: 20px 0;">
                <p>I also provide professional <strong>Software Development</strong> and <strong>Cybersecurity Solutions</strong> through my startup, <strong>PageSync</strong>.</p>
                <p>Feel free to connect for inquiries.</p>

                 <p style="margin-top: 30px; color: #888; font-style: italic;">// The form below is currently non-functional. Please use the contact methods above.</p>
                <form action="#" style="opacity: 0.5; pointer-events: none;">
                    <div><label style="display: block; margin-bottom: 5px;">Name:</label> <input type="text" disabled style="width: 100%; background: #333; border: 1px solid var(--border-color); color: #888; padding: 5px;"></div>
                    <div style="margin-top: 10px;"><label style="display: block; margin-bottom: 5px;">Email:</label> <input type="email" disabled style="width: 100%; background: #333; border: 1px solid var(--border-color); color: #888; padding: 5px;"></div>
                    <div style="margin-top: 10px;"><label style="display: block; margin-bottom: 5px;">Message:</label> <textarea disabled style="width: 100%; height: 80px; background: #333; border: 1px solid var(--border-color); color: #888; padding: 5px;"></textarea></div>
                    <div style="margin-top: 15px;"><button type="submit" disabled style="padding: 8px 15px; background: #444; border: 1px solid var(--border-color); color: #888; cursor: not-allowed;">[ Send Message ]</button></div>
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
