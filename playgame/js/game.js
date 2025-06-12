/**
 * Arcade Haven - Game Page JavaScript
 */

// Initialize game page
async function initGamePage() {
    // Load games data
    const data = await loadGamesData();
    if (!data) return;
    
    // Get game ID from URL
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');
    
    if (!gameId) {
        window.location.href = 'index.html'; // Redirect to home if no game ID
        return;
    }
    
    // Find the game
    const game = getGameById(gameId);
    if (!game) {
        displayGameNotFound();
        return;
    }
    
    // Update active navigation
    setActiveNavLink(game.category);
    
    // Update page content
    updateGamePage(game);
    
    // Load similar games
    loadSimilarGames(game);
}

// Update game page content
function updateGamePage(game) {
    // Update page title
    document.title = `${game.title} - Arcade Haven`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute(
            'content', 
            `Play ${game.title} online for free at Arcade Haven. ${game.description.substring(0, 100)}...`
        );
    }
    
    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
        canonicalLink.setAttribute(
            'href', 
            `https://arcadehaven.com/game.html?id=${game.id}`
        );
    }
    
    // Get category data
    const category = getCategoryById(game.category);
    const categoryName = category ? category.name : game.category.charAt(0).toUpperCase() + game.category.slice(1);
    
    // Update breadcrumbs
    const breadcrumbTitle = document.getElementById('game-title-breadcrumb');
    const breadcrumbCategory = document.getElementById('game-category');
    if (breadcrumbTitle) breadcrumbTitle.textContent = game.title;
    if (breadcrumbCategory) {
        breadcrumbCategory.textContent = categoryName;
        breadcrumbCategory.href = `category.html?cat=${game.category}`;
    }
    
    // Update game title and info
    const gameTitle = document.getElementById('game-title');
    const gameDescription = document.getElementById('game-description');
    const gameCategoryBadge = document.getElementById('game-category-badge');
    const gameLikes = document.getElementById('game-likes');
    const gamePlays = document.getElementById('game-plays');
    
    if (gameTitle) gameTitle.textContent = game.title;
    if (gameDescription) gameDescription.textContent = game.description;
    if (gameCategoryBadge) gameCategoryBadge.textContent = categoryName;
    if (gameLikes) gameLikes.textContent = game.likes;
    if (gamePlays) gamePlays.textContent = game.plays;
    
    // Update game instructions
    const gameInstructions = document.getElementById('game-instructions');
    if (gameInstructions) gameInstructions.textContent = game.instructions;
    
    // Update iframe source
    const gameIframe = document.getElementById('game-iframe');
    if (gameIframe) gameIframe.src = game.iframe;
    
    // Update game details
    const gameDeveloper = document.getElementById('game-developer');
    const gameRelease = document.getElementById('game-release');
    const gameControls = document.getElementById('game-controls');
    const gameAgeRating = document.getElementById('game-age-rating');
    
    if (gameDeveloper) gameDeveloper.textContent = game.developer;
    if (gameRelease) gameRelease.textContent = game.date_added;
    if (gameControls) gameControls.textContent = game.controls;
    if (gameAgeRating) gameAgeRating.textContent = 'Everyone';
    
    // Update features list
    const featuresContainer = document.getElementById('game-features');
    if (featuresContainer) {
        // Sample features (in a real app, these would come from the game data)
        const features = [
            'Multiple challenging levels',
            'Stunning graphics and animations',
            'Engaging gameplay mechanics',
            'Achievements to unlock',
            'Competitive leaderboards'
        ];
        
        featuresContainer.innerHTML = features.map(feature => `<li>${feature}</li>`).join('');
    }
}

// Load similar games
function loadSimilarGames(game) {
    const similarGamesContainer = document.getElementById('similar-games');
    if (!similarGamesContainer) return;
    
    // Find games in the same category
    const similarGames = gamesData
        .filter(g => g.category === game.category && g.id !== game.id)
        .slice(0, 4); // Get up to 4 similar games
    
    if (similarGames.length === 0) {
        similarGamesContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full">No similar games found.</p>';
        return;
    }
    
    // Create HTML for each similar game
    const similarGamesHTML = similarGames.map(similarGame => {
        return `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <a href="game.html?id=${similarGame.id}">
                    <div class="h-32 bg-apple-gray-3 flex items-center justify-center">
                        ${similarGame.thumbnail ? 
                            `<img src="${similarGame.thumbnail}" alt="${similarGame.title}" class="w-full h-full object-cover">` : 
                            `<span class="text-gray-600">Game Image</span>`
                        }
                    </div>
                    <div class="p-3">
                        <h3 class="font-bold">${similarGame.title}</h3>
                        <p class="text-xs text-gray-600 line-clamp-2">${similarGame.description}</p>
                    </div>
                </a>
            </div>
        `;
    }).join('');
    
    // Update container
    similarGamesContainer.innerHTML = similarGamesHTML;
}

// Display game not found message
function displayGameNotFound() {
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-6 text-center">
                <h1 class="text-3xl font-bold mb-4 text-gray-800">Game Not Found</h1>
                <p class="text-gray-600 mb-6">Sorry, the game you're looking for doesn't exist or has been removed.</p>
                <a href="index.html" class="bg-apple-blue text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors">
                    Return to Home
                </a>
            </div>
        `;
    }
}

// Initialize fullscreen functionality
function initFullscreenButton() {
    const fullscreenButton = document.querySelector('button:last-child');
    const gameIframe = document.getElementById('game-iframe');
    
    if (fullscreenButton && gameIframe) {
        fullscreenButton.addEventListener('click', function() {
            if (gameIframe.requestFullscreen) {
                gameIframe.requestFullscreen();
            } else if (gameIframe.mozRequestFullScreen) { // Firefox
                gameIframe.mozRequestFullScreen();
            } else if (gameIframe.webkitRequestFullscreen) { // Chrome, Safari, Opera
                gameIframe.webkitRequestFullscreen();
            } else if (gameIframe.msRequestFullscreen) { // IE/Edge
                gameIframe.msRequestFullscreen();
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initGamePage();
    initFullscreenButton();
}); 