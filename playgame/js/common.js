/**
 * Arcade Haven - Common JavaScript Functions
 * This file contains common functions used across the website
 */

// Global variables
let gamesData = null;
let categoriesData = null;

// Load games data from JSON file
async function loadGamesData() {
    if (gamesData !== null) {
        return gamesData;
    }
    
    try {
        const response = await fetch('data/games.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        gamesData = data.games;
        categoriesData = data.categories;
        return data;
    } catch (error) {
        console.error('Error loading games data:', error);
        
        // Display error message to the user
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-6 text-center">
                    <h1 class="text-3xl font-bold mb-4 text-gray-800">Unable to Load Games</h1>
                    <p class="text-gray-600 mb-6">Sorry, we're having trouble loading the game data. Please try refreshing the page.</p>
                    <button onclick="location.reload()" class="bg-apple-blue text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors">
                        Refresh Page
                    </button>
                </div>
            `;
        }
        
        return null;
    }
}

// Get game by ID
function getGameById(gameId) {
    if (!gamesData) return null;
    return gamesData.find(game => game.id === gameId);
}

// Get category by ID
function getCategoryById(categoryId) {
    if (!categoriesData) return null;
    return categoriesData.find(category => category.id === categoryId);
}

// Get games by category
function getGamesByCategory(categoryId) {
    if (!gamesData) return [];
    
    // Special categories
    if (categoryId === 'popular') {
        return gamesData.filter(game => game.popular);
    } else if (categoryId === 'new') {
        return gamesData.filter(game => game.new);
    } else if (categoryId === 'all') {
        return gamesData;
    }
    
    // Regular categories
    return gamesData.filter(game => game.category === categoryId);
}

// Get featured games
function getFeaturedGames() {
    if (!gamesData) return [];
    return gamesData.filter(game => game.featured);
}

// Format number with K/M suffix
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Set active navigation link
function setActiveNavLink(categoryId) {
    // Remove active class from all nav links
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('text-apple-blue');
        link.classList.add('text-gray-600');
    });
    
    // Add active class to current nav link
    if (categoryId) {
        const navLink = document.querySelector(`.nav-${categoryId}`);
        if (navLink) {
            navLink.classList.remove('text-gray-600');
            navLink.classList.add('text-apple-blue');
        }
    }
}

// Create game card HTML
function createGameCard(game) {
    let categoryClass = '';
    switch(game.category) {
        case 'action':
            categoryClass = 'bg-apple-red bg-opacity-10 text-apple-red';
            break;
        case 'puzzle':
            categoryClass = 'bg-apple-blue bg-opacity-10 text-apple-blue';
            break;
        case 'strategy':
            categoryClass = 'bg-apple-green bg-opacity-10 text-apple-green';
            break;
        case 'sports':
            categoryClass = 'bg-apple-orange bg-opacity-10 text-apple-orange';
            break;
        case 'adventure':
            categoryClass = 'bg-apple-purple bg-opacity-10 text-apple-purple';
            break;
        case 'racing':
            categoryClass = 'bg-apple-red bg-opacity-10 text-apple-orange';
            break;
        case 'multiplayer':
            categoryClass = 'bg-apple-indigo bg-opacity-10 text-apple-indigo';
            break;
        default:
            categoryClass = 'bg-apple-gray bg-opacity-10 text-apple-gray';
    }
    
    const category = getCategoryById(game.category);
    const categoryName = category ? category.name : game.category.charAt(0).toUpperCase() + game.category.slice(1);
    
    return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover-card">
            <a href="game.html?id=${game.id}">
                <div class="h-40 bg-apple-gray-3 flex items-center justify-center">
                    ${game.thumbnail ? 
                        `<img src="${game.thumbnail}" alt="${game.title}" class="w-full h-full object-cover">` : 
                        `<span class="text-gray-600">Game Image</span>`
                    }
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-1">${game.title}</h3>
                    <p class="text-sm text-gray-600 mb-2 line-clamp-2">${game.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="inline-block ${categoryClass} px-2 py-1 rounded text-xs">
                            ${categoryName}
                        </span>
                        <div class="flex items-center text-xs text-gray-500">
                            <div class="mr-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                ${game.rating}
                            </div>
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                ${game.plays}
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `;
}

// Search games
function searchGames(query) {
    if (!gamesData || !query) return [];
    
    query = query.toLowerCase();
    
    return gamesData.filter(game => 
        game.title.toLowerCase().includes(query) || 
        game.description.toLowerCase().includes(query) ||
        game.category.toLowerCase().includes(query)
    );
}

// Initialize search functionality
function initSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query) {
                window.location.href = `category.html?search=${encodeURIComponent(query)}`;
            }
        }
    });
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize search
    initSearchFunctionality();
    
    // Update copyright year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}); 