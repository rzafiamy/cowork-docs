// src/search.js
document.addEventListener('DOMContentLoaded', () => {
    const searchTrigger = document.getElementById('search-trigger');
    const searchModal = document.getElementById('search-modal');
    const searchModalContent = document.getElementById('search-modal-content');
    const searchModalBackdrop = document.getElementById('search-modal-backdrop');
    const modalSearchInput = document.getElementById('modal-search-input');
    const modalSearchResults = document.getElementById('modal-search-results');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let searchData = [];
    let selectedIndex = -1;
    let filteredResults = [];
    let currentCategory = 'all';

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
            searchModal.offsetHeight; // Force reflow
            searchModal.classList.remove('opacity-0');
            searchModalContent.classList.remove('scale-95');
            modalSearchInput.value = '';
            modalSearchInput.focus();
            resetFilters();
            displayResults([]);
        } else {
            searchModal.classList.add('opacity-0');
            searchModalContent.classList.add('scale-95');
            setTimeout(() => {
                searchModal.classList.add('hidden');
            }, 200);
        }
    }

    function resetFilters() {
        currentCategory = 'all';
        filterButtons.forEach(btn => {
            if (btn.dataset.category === 'all') {
                btn.classList.add('bg-yellow-400', 'text-zinc-950', 'shadow-lg', 'shadow-yellow-400/10', 'active');
                btn.classList.remove('bg-white/5', 'text-zinc-500');
            } else {
                btn.classList.remove('bg-yellow-400', 'text-zinc-950', 'shadow-lg', 'shadow-yellow-400/10', 'active');
                btn.classList.add('bg-white/5', 'text-zinc-500');
            }
        });
    }

    function displayResults(results) {
        filteredResults = results;
        selectedIndex = results.length > 0 ? 0 : -1;

        if (results.length === 0) {
            if (modalSearchInput.value) {
                modalSearchResults.innerHTML = `
                    <div class="px-8 py-16 text-center text-zinc-500 animate-fade-in">
                        <i class="fas fa-search-minus text-3xl mb-4 opacity-20"></i>
                        <p class="text-lg">No results found for "${modalSearchInput.value}"</p>
                        <p class="text-xs uppercase tracking-widest mt-2 opacity-50">Try a different category or keyword</p>
                    </div>`;
            } else {
                modalSearchResults.innerHTML = `
                    <div class="px-8 py-16 text-center text-zinc-500 animate-fade-in">
                        <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <i class="fas fa-keyboard text-2xl opacity-20"></i>
                        </div>
                        <p class="text-sm font-medium text-zinc-400">Search documentation...</p>
                        <p class="text-[10px] mt-3 uppercase tracking-widest opacity-30">Quick search architecture, skills, or CLI</p>
                    </div>`;
            }
            return;
        }

        modalSearchResults.innerHTML = results.map((item, index) => `
            <a href="${item.url}" class="search-result-item group block px-6 py-4 mx-4 my-1 rounded-xl transition-all border border-transparent ${index === 0 ? 'bg-white/5 border-white/10' : 'hover:bg-white/[0.02] text-zinc-400'}" data-index="${index}">
                <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0 pr-4">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-1.5 py-0.5 rounded bg-zinc-800 text-yellow-400/80 text-[8px] uppercase font-bold tracking-wider border border-white/5">${item.category || 'Core'}</span>
                            <h4 class="font-bold text-white truncate transition-colors">${item.title}</h4>
                        </div>
                        <p class="text-xs line-clamp-1 text-zinc-500 transition-colors">${item.description}</p>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                         <div class="flex items-center gap-1 text-[10px] text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <i class="fas fa-level-down-alt fa-rotate-90"></i>
                         </div>
                        <i class="fas fa-chevron-right text-[10px] opacity-20"></i>
                    </div>
                </div>
            </a>
        `).join('');

        if (selectedIndex >= 0) updateSelection();
    }

    function updateSelection() {
        const items = modalSearchResults.querySelectorAll('.search-result-item');
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('bg-white/5', 'border-white/10', 'active-result');
                item.classList.remove('hover:bg-white/[0.02]', 'text-zinc-400');
                item.querySelector('h4').classList.add('text-yellow-400');
                item.querySelector('p').classList.replace('text-zinc-500', 'text-zinc-300');
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.classList.remove('bg-white/5', 'border-white/10', 'active-result');
                item.classList.add('hover:bg-white/[0.02]', 'text-zinc-400');
                item.querySelector('h4').classList.remove('text-yellow-400');
                item.querySelector('p').classList.replace('text-zinc-300', 'text-zinc-500');
            }
        });
    }

    function performSearch() {
        const query = modalSearchInput.value.toLowerCase();

        let results = searchData;

        // Filter by category first
        if (currentCategory !== 'all') {
            results = results.filter(item => item.category === currentCategory);
        }

        // Then by query
        if (query) {
            results = results.filter(item => {
                const titleMatch = item.title.toLowerCase().includes(query);
                const descriptionMatch = item.description.toLowerCase().includes(query);
                const keywordsMatch = item.keywords.some(k => k.toLowerCase().includes(query));
                return titleMatch || descriptionMatch || keywordsMatch;
            });
        }

        displayResults(results.slice(0, 10));
    }

    // Filter Click Events
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;

            // Update active state
            filterButtons.forEach(b => {
                if (b === btn) {
                    b.classList.add('bg-yellow-400', 'text-zinc-950', 'shadow-lg', 'shadow-yellow-400/10', 'active');
                    b.classList.remove('bg-white/5', 'text-zinc-500');
                } else {
                    b.classList.remove('bg-yellow-400', 'text-zinc-950', 'shadow-lg', 'shadow-yellow-400/10', 'active');
                    b.classList.add('bg-white/5', 'text-zinc-500');
                }
            });

            performSearch();
        });
    });

    // Input Events
    modalSearchInput.addEventListener('input', () => performSearch());

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        // Open Modal (Cmd/Ctrl + K)
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            toggleModal(true);
        }

        // Close Modal (Escape)
        if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
            toggleModal(false);
        }

        if (searchModal.classList.contains('hidden')) return;

        // Result Navigation
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (filteredResults.length > 0) {
                selectedIndex = (selectedIndex + 1) % filteredResults.length;
                updateSelection();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (filteredResults.length > 0) {
                selectedIndex = (selectedIndex - 1 + filteredResults.length) % filteredResults.length;
                updateSelection();
            }
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            window.location.href = filteredResults[selectedIndex].url;
        }

        // Switch Filters with Tab
        if (e.key === 'Tab') {
            e.preventDefault();
            const currentIdx = Array.from(filterButtons).findIndex(btn => btn.dataset.category === currentCategory);
            const nextIdx = (currentIdx + (e.shiftKey ? -1 : 1) + filterButtons.length) % filterButtons.length;
            filterButtons[nextIdx].click();
        }
    });

    // Modal Trigger Listeners
    const allSearchTriggers = document.querySelectorAll('#search-trigger');
    allSearchTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal(true);
        });
    });

    searchModalBackdrop.addEventListener('click', () => toggleModal(false));

    loadSearchData();
});
