// src/search.js
document.addEventListener('DOMContentLoaded', () => {
    const searchTrigger = document.getElementById('search-trigger');
    const searchModal = document.getElementById('search-modal');
    const searchModalContent = document.getElementById('search-modal-content');
    const searchModalBackdrop = document.getElementById('search-modal-backdrop');
    const modalSearchInput = document.getElementById('modal-search-input');
    const modalSearchResults = document.getElementById('modal-search-results');

    let searchData = [];
    let selectedIndex = -1;
    let filteredResults = [];

    if (!searchModal || !modalSearchInput) return;

    async function loadSearchData() {
        try {
            const response = await fetch('/search-data.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            searchData = await response.json();
        } catch (error) {
            console.error("Could not load search data:", error);
        }
    }

    function toggleModal(show) {
        if (show) {
            searchModal.classList.remove('hidden');
            // Force reflow for transitions
            searchModal.offsetHeight;
            searchModal.classList.remove('opacity-0');
            searchModalContent.classList.remove('scale-95');
            modalSearchInput.value = '';
            modalSearchInput.focus();
            displayResults([]);
        } else {
            searchModal.classList.add('opacity-0');
            searchModalContent.classList.add('scale-95');
            setTimeout(() => {
                searchModal.classList.add('hidden');
            }, 200);
        }
    }

    function displayResults(results) {
        filteredResults = results;
        selectedIndex = results.length > 0 ? 0 : -1;

        if (results.length === 0) {
            if (modalSearchInput.value) {
                modalSearchResults.innerHTML = `
                    <div class="px-8 py-12 text-center text-zinc-500">
                        <i class="fas fa-search-minus text-2xl mb-4 opacity-20"></i>
                        <p>No results found for "${modalSearchInput.value}"</p>
                    </div>`;
            } else {
                modalSearchResults.innerHTML = `
                    <div class="px-8 py-12 text-center text-zinc-500">
                        <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-keyboard text-xl opacity-20"></i>
                        </div>
                        <p class="text-sm">Start typing to search documentation...</p>
                    </div>`;
            }
            return;
        }

        modalSearchResults.innerHTML = results.map((item, index) => `
            <a href="${item.url}" class="search-result-item block px-6 py-4 mx-2 rounded-xl transition-all ${index === 0 ? 'bg-yellow-400 text-zinc-950 shadow-lg shadow-yellow-400/20' : 'hover:bg-white/5 text-zinc-400'}" data-index="${index}">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <h4 class="font-bold ${index === 0 ? 'text-zinc-950' : 'text-white'}">${item.title}</h4>
                        <p class="text-xs mt-1 line-clamp-1 ${index === 0 ? 'text-zinc-900/70' : 'text-zinc-500'}">${item.description}</p>
                    </div>
                    <i class="fas fa-chevron-right text-[10px] opacity-30 ${index === 0 ? 'text-zinc-950' : ''}"></i>
                </div>
            </a>
        `).join('');
    }

    function updateSelection() {
        const items = modalSearchResults.querySelectorAll('.search-result-item');
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('bg-yellow-400', 'text-zinc-950', 'shadow-lg', 'shadow-yellow-400/20');
                item.classList.remove('hover:bg-white/5', 'text-zinc-400');
                item.querySelector('h4').classList.replace('text-white', 'text-zinc-950');
                item.querySelector('p').classList.replace('text-zinc-500', 'text-zinc-900/70');
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.classList.remove('bg-yellow-400', 'text-zinc-950', 'shadow-lg', 'shadow-yellow-400/20');
                item.classList.add('hover:bg-white/5', 'text-zinc-400');
                item.querySelector('h4').classList.replace('text-zinc-950', 'text-white');
                item.querySelector('p').classList.replace('text-zinc-900/70', 'text-zinc-500');
            }
        });
    }

    function search(query) {
        if (!query) {
            displayResults([]);
            return;
        }

        const lowerCaseQuery = query.toLowerCase();
        const results = searchData.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(lowerCaseQuery);
            const descriptionMatch = item.description.toLowerCase().includes(lowerCaseQuery);
            const keywordsMatch = item.keywords.some(k => k.toLowerCase().includes(lowerCaseQuery));
            return titleMatch || descriptionMatch || keywordsMatch;
        });

        displayResults(results.slice(0, 10));
    }

    // Input Events
    modalSearchInput.addEventListener('input', () => search(modalSearchInput.value));

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        // Open Modal
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            toggleModal(true);
        }

        // Close Modal
        if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
            toggleModal(false);
        }

        if (searchModal.classList.contains('hidden')) return;

        // Navigation
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % filteredResults.length;
            updateSelection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + filteredResults.length) % filteredResults.length;
            updateSelection();
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            window.location.href = filteredResults[selectedIndex].url;
        }
    });

    // Trigger Events
    if (searchTrigger) {
        searchTrigger.addEventListener('click', () => toggleModal(true));
    }

    searchModalBackdrop.addEventListener('click', () => toggleModal(false));

    loadSearchData();
});

