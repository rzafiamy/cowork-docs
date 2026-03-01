// Sidebar Persistence & Toggle Logic
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const desktopToggleBtn = document.getElementById('sidebar-toggle-desktop');
const mainContent = document.querySelector('main');
const header = document.getElementById('doc-header');

const SIDEBAR_STATE_KEY = 'cowork-sidebar-state';

const sidebarBranding = document.getElementById('sidebar-branding');

const setSidebarState = (isOpen) => {
    if (isOpen) {
        sidebar.classList.remove('-translate-x-full');
        if (sidebarBranding) {
            sidebarBranding.classList.remove('w-0', 'px-0', 'border-r-0', 'opacity-0');
            sidebarBranding.classList.add('w-64', 'px-6', 'opacity-100');
        }
    } else {
        sidebar.classList.add('-translate-x-full');
        if (sidebarBranding) {
            sidebarBranding.classList.add('w-0', 'px-0', 'border-r-0', 'opacity-0');
            sidebarBranding.classList.remove('w-64', 'px-6', 'opacity-100');
        }
    }
    localStorage.setItem(SIDEBAR_STATE_KEY, isOpen ? 'open' : 'closed');
};

// Initialize state
const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
// Default to open on desktop, closed on mobile
let isSidebarOpen = window.innerWidth >= 1024 ? (savedState !== 'closed') : (savedState === 'open');

// Apply initial state without transition to prevent flicking
sidebar.classList.add('transition-none');
setSidebarState(isSidebarOpen);
// Re-enable transitions after a tiny delay
setTimeout(() => {
    sidebar.classList.remove('transition-none');
}, 10);

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        isSidebarOpen = !sidebar.classList.contains('-translate-x-full');
        setSidebarState(!isSidebarOpen);
    });
}

if (desktopToggleBtn) {
    desktopToggleBtn.addEventListener('click', () => {
        isSidebarOpen = !sidebar.classList.contains('-translate-x-full');
        setSidebarState(!isSidebarOpen);
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        // On desktop, follow the saved state or default to open
        const state = localStorage.getItem(SIDEBAR_STATE_KEY);
        setSidebarState(state !== 'closed');
    } else {
        // On mobile, default to closed
        setSidebarState(false);
    }
});


// Sidebar Active Link Highlighting
const highlightActiveLink = () => {
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('#sidebar nav a');

    sidebarLinks.forEach(link => {
        const linkPath = link.getAttribute('href');

        // Handle cases like /docs/ and /docs/index.html being the same
        const isIndex = (currentPath === '/docs/' || currentPath.endsWith('/docs/index.html')) && linkPath.endsWith('/docs/index.html');
        const isMatch = currentPath.endsWith(linkPath) || isIndex;

        if (isMatch) {
            link.classList.remove('text-zinc-400', 'hover:text-white');
            link.classList.add('bg-white/5', 'text-yellow-400', 'font-medium');
        } else {
            // Ensure classes are correct if they were partially added
            link.classList.add('text-zinc-400', 'hover:text-white');
            link.classList.remove('bg-white/5', 'text-yellow-400', 'font-medium');
        }
    });
};

// Simple Table of Contents generator
const content = document.getElementById('content');
const toc = document.getElementById('toc');

if (content && toc) {
    const headers = content.querySelectorAll('h2');
    if (headers.length > 0) {
        toc.innerHTML = '';
        headers.forEach((header, index) => {
            const id = `section-${index}`;
            header.id = id;

            const link = document.createElement('a');
            link.href = `#${id}`;
            link.className = 'block text-zinc-500 hover:text-zinc-300 transition-colors';
            link.textContent = header.textContent;

            // Handle smooth scroll
            link.addEventListener('click', (e) => {
                e.preventDefault();
                header.scrollIntoView({ behavior: 'smooth' });
            });

            toc.appendChild(link);
        });
    }
}

// Update breadcrumb
const currentPageCrumb = document.getElementById('current-page-crumb');
if (currentPageCrumb) {
    const h1 = document.querySelector('h1');
    if (h1) {
        currentPageCrumb.textContent = h1.textContent;
    } else {
        currentPageCrumb.textContent = document.title.split('•')[0].trim();
    }
}

highlightActiveLink();
console.log('Docs engine initialized 🚀');

