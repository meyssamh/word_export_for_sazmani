// Main JavaScript for Word Export Module Documentation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize code highlighting
    initializeCodeHighlighting();
    
    // Initialize responsive navigation
    initializeResponsiveNav();
    
    // Initialize search functionality
    initializeSearch();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Handle sidebar navigation
    const sidebarLinks = document.querySelectorAll('.doc-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, '#' + targetId);
            }
        });
    });
}

// Code highlighting and copy functionality
function initializeCodeHighlighting() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        // Add copy button to code blocks
        const pre = block.parentElement;
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋 Copy';
        copyButton.title = 'Copy code to clipboard';
        
        // Position the copy button
        pre.style.position = 'relative';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '0.5rem';
        copyButton.style.right = '0.5rem';
        copyButton.style.background = 'rgba(255,255,255,0.1)';
        copyButton.style.color = 'white';
        copyButton.style.border = '1px solid rgba(255,255,255,0.2)';
        copyButton.style.borderRadius = '0.25rem';
        copyButton.style.padding = '0.25rem 0.5rem';
        copyButton.style.fontSize = '0.75rem';
        copyButton.style.cursor = 'pointer';
        copyButton.style.transition = 'all 0.2s ease';
        
        copyButton.addEventListener('click', function() {
            navigator.clipboard.writeText(block.textContent).then(() => {
                copyButton.innerHTML = '✅ Copied!';
                copyButton.style.background = 'rgba(34, 197, 94, 0.8)';
                
                setTimeout(() => {
                    copyButton.innerHTML = '📋 Copy';
                    copyButton.style.background = 'rgba(255,255,255,0.1)';
                }, 2000);
            }).catch(() => {
                // Fallback for browsers that don't support clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = block.textContent;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                copyButton.innerHTML = '✅ Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = '📋 Copy';
                }, 2000);
            });
        });
        
        pre.appendChild(copyButton);
    });
}

// Responsive navigation
function initializeResponsiveNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Search functionality (if search input exists)
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const searchResults = document.getElementById('search-results');
    const searchableContent = document.querySelectorAll('h1, h2, h3, h4, p, li');
    
    let searchIndex = [];
    
    // Build search index
    searchableContent.forEach((element, index) => {
        const text = element.textContent.trim();
        if (text.length > 0) {
            searchIndex.push({
                id: index,
                element: element,
                text: text.toLowerCase(),
                heading: getClosestHeading(element)
            });
        }
    });
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            return;
        }
        
        const results = searchIndex.filter(item => 
            item.text.includes(query)
        ).slice(0, 10);
        
        displaySearchResults(results, query);
    });
    
    function getClosestHeading(element) {
        let current = element;
        while (current && current.tagName && !current.tagName.match(/^H[1-6]$/)) {
            current = current.previousElementSibling || current.parentElement;
        }
        return current ? current.textContent : '';
    }
    
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        } else {
            searchResults.innerHTML = results.map(result => {
                const highlightedText = highlightSearchTerm(result.text, query);
                return `
                    <div class="search-result" data-element-id="${result.id}">
                        <div class="search-result-heading">${result.heading}</div>
                        <div class="search-result-text">${highlightedText}</div>
                    </div>
                `;
            }).join('');
            
            // Add click handlers to search results
            const searchResultElements = searchResults.querySelectorAll('.search-result');
            searchResultElements.forEach(resultElement => {
                resultElement.addEventListener('click', function() {
                    const elementId = this.getAttribute('data-element-id');
                    const targetElement = searchIndex[elementId].element;
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    searchResults.style.display = 'none';
                    searchInput.value = '';
                });
            });
        }
        
        searchResults.style.display = 'block';
    }
    
    function highlightSearchTerm(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.substring(0, 150).replace(regex, '<mark>$1</mark>') + 
               (text.length > 150 ? '...' : '');
    }
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Table of contents generator (for long pages)
function generateTableOfContents() {
    const headings = document.querySelectorAll('h2, h3, h4');
    const toc = document.getElementById('table-of-contents');
    
    if (!toc || headings.length === 0) return;
    
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach(heading => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        // Create ID if it doesn't exist
        if (!heading.id) {
            heading.id = heading.textContent
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
        }
        
        a.href = '#' + heading.id;
        a.textContent = heading.textContent;
        a.className = `toc-${heading.tagName.toLowerCase()}`;
        
        li.appendChild(a);
        tocList.appendChild(li);
    });
    
    toc.appendChild(tocList);
}

// Initialize table of contents if element exists
document.addEventListener('DOMContentLoaded', function() {
    generateTableOfContents();
});

// Dark mode toggle (if implemented)
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (!darkModeToggle) return;
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    darkModeToggle.addEventListener('click', function() {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle button text
        this.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

// Print functionality
function initializePrintStyles() {
    const printButton = document.getElementById('print-page');
    if (!printButton) return;
    
    printButton.addEventListener('click', function() {
        window.print();
    });
}

// Analytics (if needed)
function trackPageView() {
    // Add analytics tracking code here if needed
    // Example: gtag('config', 'GA_MEASUREMENT_ID', { page_path: window.location.pathname });
}

// Export functions for potential external use
window.WordExportDocs = {
    initializeNavigation,
    initializeSmoothScrolling,
    initializeCodeHighlighting,
    generateTableOfContents,
    debounce
};
