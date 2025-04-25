import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import '../src/styles/base.css';
import '../src/styles/tools.css';

// No DOMContentLoaded wrapper needed with module scripts handled by Vite

// --- Utility Functions ---
// Basic slugify function
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^-a-z0-9]+/g, '') // Remove all non-word chars except dashes
        .replace(/--+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

// --- State and Elements ---
// Move this query inside switchTool to ensure elements exist when queried
// const toolContainers = document.querySelectorAll('.tools-tool-container');
const navLinks = document.querySelectorAll('.tools-nav a');
let isMarkdownEditorInitialized = false;
let isCalculatorInitialized = false;

// --- Tool Initialization Functions ---

function setupMarkdownEditor() {
    if (isMarkdownEditorInitialized) return;
    try {
        const markdownEditorToolContainer = document.getElementById('markdown-editor-tool');
        if (!markdownEditorToolContainer) throw new Error("Markdown editor container not found");

        const easyMDE = new EasyMDE({
            element: document.getElementById('markdown-editor'),
            spellChecker: false,
            minHeight: '300px',
            toolbar: [
                "bold", "italic", "strikethrough", "heading", "|",
                "quote", "unordered-list", "ordered-list", "|",
                "link", "image", "table", "horizontal-rule", "|",
                "preview", "side-by-side", "fullscreen", "|",
                "guide"
            ]
        });

        const postForm = document.getElementById('post-form');
        const dateInput = document.getElementById('fm-date');
        const categoryInput = document.getElementById('fm-category');
        const today = new Date().toISOString().split('T')[0];
        if (dateInput) dateInput.value = today;
        if (!postForm || !dateInput || !categoryInput) throw new Error ("Form elements missing");

        categoryInput.addEventListener('input', () => {
            const value = categoryInput.value;
            if (value.length > 0) {
                categoryInput.value = value.charAt(0).toUpperCase() + value.slice(1);
            }
        });

        postForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(postForm);
            const frontMatter = {};
            for (const [key, value] of formData.entries()) {
                frontMatter[key] = value.trim();
            }
            if (!frontMatter.slug && frontMatter.title) {
                frontMatter.slug = slugify(frontMatter.title);
            }
            if (!frontMatter.slug) {
                alert('Title or Slug is required to generate the filename.');
                return;
            }
            const markdownContent = easyMDE.value();
            let frontMatterString = '';
            frontMatterString += `title: "${frontMatter.title || ''}"\n`;
            frontMatterString += `date: "${frontMatter.date || today}"\n`;
            frontMatterString += `author: "${frontMatter.author || ''}"\n`;
            frontMatterString += `type: "${frontMatter.type || 'article'}"\n`;
            frontMatterString += `category: "${frontMatter.category || 'General'}"\n`;
            const tagsArray = (frontMatter.tags || '')
                .split(',').map(tag => tag.trim()).filter(tag => tag).map(tag => `"${tag}"`);
            frontMatterString += `tags: [${tagsArray.join(', ')}]\n`;
            frontMatterString += `slug: "${frontMatter.slug}"\n`;
            const fileContent = `---\n${frontMatterString}---\n${markdownContent ? `\n${markdownContent}` : ''}`;
            const blob = new Blob([fileContent], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `${frontMatter.slug}.md`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        });

        isMarkdownEditorInitialized = true;
    } catch (error) {
        // Error handling can be added back in development if needed
    }
}

function setupCalculator() {
    if (isCalculatorInitialized) return;
    try {
        const calculatorToolContainer = document.getElementById('calculator-tool');
         if (!calculatorToolContainer) throw new Error("Calculator container not found");

        const calcDisplay = document.getElementById('calc-display');
        const calcButtonsContainer = calculatorToolContainer.querySelector('.calc-buttons');
         if (!calcDisplay || !calcButtonsContainer) throw new Error("Calculator elements missing");

        let currentInput = '0';
        let operator = null;
        let previousInput = null;
        let shouldResetDisplay = false;

        function updateDisplay() {
            calcDisplay.value = currentInput.length > 16 ? currentInput.substring(0, 16) + '...' : currentInput;
        }
        function clearCalculator() {
            currentInput = '0'; operator = null; previousInput = null; shouldResetDisplay = false; updateDisplay();
        }
        function calculate(num1, num2, op) {
            switch (op) {
                case '+': return num1 + num2; case '-': return num1 - num2;
                case '*': return num1 * num2; case '/': return num2 === 0 ? 'Error' : num1 / num2;
                default: return num2;
            }
        }
        function handleNumberInput(value) {
            if (currentInput === '0' || shouldResetDisplay) { currentInput = value; shouldResetDisplay = false; }
            else { if (currentInput.length < 16) { currentInput += value; } }
            updateDisplay();
        }
        function handleDecimalInput() {
            if (shouldResetDisplay) { currentInput = '0.'; shouldResetDisplay = false; }
            else if (!currentInput.includes('.')) { if (currentInput.length < 16) { currentInput += '.'; } }
            updateDisplay();
        }
        function handleOperatorInput(nextOperator) {
            const inputValue = parseFloat(currentInput);
            if (operator && shouldResetDisplay) { operator = nextOperator; return; }
            if (previousInput === null) { previousInput = inputValue; }
            else if (operator) {
                const result = calculate(previousInput, inputValue, operator);
                if (result === 'Error') { clearCalculator(); currentInput = 'Error'; updateDisplay(); return; }
                currentInput = String(result); previousInput = result; updateDisplay();
            }
            operator = nextOperator; shouldResetDisplay = true;
        }
        function handleEquals() {
            if (operator === null || previousInput === null) return;
            const inputValue = parseFloat(currentInput);
            const result = calculate(previousInput, inputValue, operator);
            currentInput = (result === 'Error') ? 'Error' : String(result);
            updateDisplay(); operator = null; previousInput = null; shouldResetDisplay = true;
        }

        calcButtonsContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (!target.matches('button')) return;
            if (currentInput === 'Error') {
                clearCalculator();
                if (target.classList.contains('operator') || target.id === 'calc-equals') return;
            }
            const value = target.dataset.value;
            const isOperator = target.classList.contains('operator');
            if (value !== undefined) {
                if (isOperator) { handleOperatorInput(value); } else if (value === '.') { handleDecimalInput(); } else { handleNumberInput(value); }
            } else if (target.id === 'calc-clear') { clearCalculator(); } else if (target.id === 'calc-equals') { handleEquals(); }
        });

        updateDisplay();
        isCalculatorInitialized = true;
    } catch (error) {
        // Error handling can be added back in development if needed
    }
}

// --- Tool Switching Logic ---
function switchTool(hash) {
    const toolContainers = document.querySelectorAll('.tools-tool-container');
    const defaultHash = '#about';
    const targetHash = (hash && document.querySelector(hash + '-tool')) ? hash : defaultHash;
    const targetId = targetHash.substring(1) + '-tool';

    toolContainers.forEach(container => {
        container.style.display = 'none';
    });

    const targetContainer = document.getElementById(targetId);
    if (targetContainer) {
        targetContainer.style.display = 'block';
        if (targetId === 'markdown-editor-tool') {
            setupMarkdownEditor();
        } else if (targetId === 'calculator-tool') {
            setupCalculator();
        }
    } else {
        const fallbackContainer = document.getElementById('about-tool');
        if (fallbackContainer) fallbackContainer.style.display = 'block';
    }

    navLinks.forEach(link => {
        link.classList.toggle('active', link.hash === targetHash);
    });
}

// Initial setup
window.addEventListener('hashchange', () => switchTool(window.location.hash));
switchTool(window.location.hash);
