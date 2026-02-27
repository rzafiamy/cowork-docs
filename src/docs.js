// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');

if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });
}

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

console.log('Docs engine initialized 🚀');
