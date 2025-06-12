/**
 * Arcade Haven - Category Page JavaScript
 */

// Initialize category page
async function initCategoryPage() {
    // Load games data
    const data = await loadGamesData();
    if (!data) return;
    
    // Get parameters from URL
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('cat');
    const searchQuery = params.get('search');
    
    if (searchQuery) {
        // Handle search
        handleSearch(searchQuery);
    } else if (categoryId) {
        // Handle category
        handleCategory(categoryId);
    } else {
        // Show all games if no category or search specified
        handleCategory('all');
    }
    
    // Initialize filter functionality
    initFilters();
}

// Handle category display
function handleCategory(categoryId) {
    // Set active navigation link
    setActiveNavLink(categoryId);
    
    // Get category information
    const category = getCategoryById(categoryId);
    let categoryTitle = 'All Games';
    let categoryDescription = 'Browse our complete collection of free online games. Find your next favorite game!';
    let isSpecialCategory = false;
    
    if (category) {
        categoryTitle = category.name;
        categoryDescription = category.description;
        
        // Special categories check
        isSpecialCategory = ['popular', 'new'].includes(categoryId);
    }
    
    // Update page title and description
    document.title = `${categoryTitle} - Arcade Haven`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', categoryDescription);
    }
    
    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
        canonicalLink.setAttribute(
            'href', 
            `https://arcadehaven.com/category.html?cat=${categoryId}`
        );
    }
    
    // Update header
    const categoryHeader = document.getElementById('category-header');
    const categoryDescElement = document.getElementById('category-description');
    
    if (categoryHeader) categoryHeader.textContent = categoryTitle;
    if (categoryDescElement) categoryDescElement.textContent = categoryDescription;
    
    // Get games for this category
    const games = getGamesByCategory(categoryId);
    
    // Display games
    displayGames(games);
}

// Handle search display
function handleSearch(query) {
    // Reset active nav link
    setActiveNavLink(null);
    
    // Update page title and description
    document.title = `Search: ${query} - Arcade Haven`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute(
            'content', 
            `Search results for "${query}" at Arcade Haven. Find and play free online games.`
        );
    }
    
    // Update header
    const categoryHeader = document.getElementById('category-header');
    const categoryDescElement = document.getElementById('category-description');
    
    if (categoryHeader) categoryHeader.textContent = `Search Results: "${query}"`;
    if (categoryDescElement) categoryDescElement.textContent = 'Here are the games that match your search.';
    
    // Search games
    const searchResults = searchGames(query);
    
    // Display search results
    displayGames(searchResults);
}

// Display games in the grid
function displayGames(games) {
    const gamesGrid = document.getElementById('games-grid');
    if (!gamesGrid) return;
    
    if (games.length === 0) {
        gamesGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-500 mb-4">No games found.</p>
                <a href="/index.html" class="text-apple-blue hover:underline">Return to Home</a>
            </div>
        `;
        return;
    }
    
    // Create HTML for each game
    const gamesHTML = games.map(game => createGameCard(game)).join('');
    
    // Update grid
    gamesGrid.innerHTML = gamesHTML;
    
    // Update game count
    const gameCount = document.getElementById('game-count');
    if (gameCount) {
        gameCount.textContent = `${games.length} games`;
    }
}

// Initialize filter functionality
function initFilters() {
    const sortSelect = document.getElementById('sort-select');
    const filterRadios = document.querySelectorAll('input[name="rating-filter"]');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    
    if (filterRadios.length > 0) {
        filterRadios.forEach(radio => {
            radio.addEventListener('change', applyFilters);
        });
    }
}

// Apply filters and sort
function applyFilters() {
    // Get current view (category or search)
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('cat');
    const searchQuery = params.get('search');
    
    // Get base set of games
    let games = [];
    if (searchQuery) {
        games = searchGames(searchQuery);
    } else if (categoryId) {
        games = getGamesByCategory(categoryId);
    } else {
        games = [...gamesData];
    }
    
    // Apply rating filter
    const ratingFilter = document.querySelector('input[name="rating-filter"]:checked');
    if (ratingFilter && ratingFilter.value !== 'all') {
        const minRating = parseFloat(ratingFilter.value);
        games = games.filter(game => game.rating >= minRating);
    }
    
    // Apply sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        const sortValue = sortSelect.value;
        
        switch (sortValue) {
            case 'rating-high':
                games.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating-low':
                games.sort((a, b) => a.rating - b.rating);
                break;
            case 'name-asc':
                games.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                games.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'newest':
                games.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));
                break;
            default:
                // Default: most popular
                games.sort((a, b) => {
                    const playsA = parseInt(a.plays.replace(/[KM]/g, ''));
                    const playsB = parseInt(b.plays.replace(/[KM]/g, ''));
                    return playsB - playsA;
                });
        }
    }
    
    // Display filtered games
    displayGames(games);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCategoryPage); 