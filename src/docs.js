// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');

if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });
}

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

highlightActiveLink();
console.log('Docs engine initialized 🚀');

