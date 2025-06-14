/**
 * Arcade Haven - Index Page JavaScript
 */

// Initialize homepage
async function initHomepage() {
    // Set active navigation link
    setActiveNavLink('home');
    
    // Load games data
    const data = await loadGamesData();
    if (!data) return;
    
    // Populate featured games
    populateFeaturedGames();
    
    // Populate recently added games
    populateRecentGames();
}

// Populate featured games section
function populateFeaturedGames() {
    const featuredGamesContainer = document.getElementById('featured-games');
    if (!featuredGamesContainer) return;
    
    // Get featured games
    const featuredGames = getFeaturedGames();
    if (featuredGames.length === 0) {
        featuredGamesContainer.innerHTML = '<p class="text-center text-gray-500">No featured games available.</p>';
        return;
    }
    
    // Display up to 4 featured games
    const gamesToShow = featuredGames.slice(0, 4);
    
    // Create HTML for each game
    const gamesHTML = gamesToShow.map(game => createGameCard(game)).join('');
    
    // Update container
    featuredGamesContainer.innerHTML = gamesHTML;
}

// Populate recently added games section
function populateRecentGames() {
    const recentGamesContainer = document.getElementById('recent-games');
    if (!recentGamesContainer) return;
    
    // Sort games by date added (descending)
    const sortedGames = [...gamesData].sort((a, b) => 
        new Date(b.date_added) - new Date(a.date_added)
    );
    
    // Get 3 most recent games
    const recentGames = sortedGames.slice(0, 3);
    
    if (recentGames.length === 0) {
        recentGamesContainer.innerHTML = '<p class="text-center text-gray-500">No recent games available.</p>';
        return;
    }
    
    // Create HTML for each recent game
    const recentGamesHTML = recentGames.map(game => {
        const category = getCategoryById(game.category);
        const categoryName = category ? category.name : game.category.charAt(0).toUpperCase() + game.category.slice(1);
        
        return `
            <div class="bg-white rounded-lg shadow-md overflow-hidden flex hover:shadow-lg transition-shadow">
                <div class="w-1/3 bg-apple-gray-3 flex items-center justify-center">
                    ${game.thumbnail ? 
                        `<img src="${game.thumbnail}" alt="${game.title}" class="w-full h-full object-cover">` : 
                        `<span class="text-gray-600 text-sm">Image</span>`
                    }
                </div>
                <div class="w-2/3 p-4">
                    <h3 class="font-bold mb-1">${game.title}</h3>
                    <p class="text-xs text-gray-600 mb-2 line-clamp-2">${game.description}</p>
                    <a href="game.html?id=${game.id}" class="text-apple-blue text-sm hover:underline">Play Now</a>
                </div>
            </div>
        `;
    }).join('');
    
    // Update container
    recentGamesContainer.innerHTML = recentGamesHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initHomepage); 