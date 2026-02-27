// src/search.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');
    let searchData = [];
    let isSearchFocused = false;

    if (!searchInput || !searchResultsContainer) {
        return;
    }

    async function loadSearchData() {
        try {
            const response = await fetch('/search-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            searchData = await response.json();
        } catch (error) {
            console.error("Could not load search data:", error);
        }
    }

    function displayResults(results) {
        searchResultsContainer.innerHTML = '';
        if (results.length === 0) {
            searchResultsContainer.classList.add('hidden');
            return;
        }

        results.forEach(item => {
            const resultElement = document.createElement('a');
            resultElement.href = item.url;
            resultElement.className = 'block p-4 border-b border-white/5 hover:bg-yellow-400/10 transition-colors group';
            resultElement.innerHTML = `
                <h4 class="text-white font-bold group-hover:text-yellow-400 transition-colors">${item.title}</h4>
                <p class="text-zinc-500 text-xs mt-1 leading-relaxed">${item.description}</p>
            `;
            searchResultsContainer.appendChild(resultElement);
        });

        searchResultsContainer.classList.remove('hidden');
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

        displayResults(results.slice(0, 8)); // Limit to 8 results
    }

    searchInput.addEventListener('input', () => {
        search(searchInput.value);
    });

    searchInput.addEventListener('focus', () => {
        isSearchFocused = true;
        if (searchInput.value) {
            search(searchInput.value);
        }
    });

    searchInput.addEventListener('blur', () => {
        isSearchFocused = false;
        // Delay hiding to allow click on results
        setTimeout(() => {
            if (!isSearchFocused) {
                searchResultsContainer.classList.add('hidden');
            }
        }, 200);
    });

    searchResultsContainer.addEventListener('mousedown', (e) => {
        // Prevent searchInput blur event when clicking on a result
        e.preventDefault();
    });

    // Keyboard shortcuts (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    loadSearchData();
});
