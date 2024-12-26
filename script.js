const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const gridSize = 20; // 20x20 grid
let snake = [2, 1, 0]; // Initial snake segments (indexes)
let direction = 1; // Snake moving right
let food = 0; // Food position
let score = 0;

// Get audio elements
const backgroundMusic = document.getElementById('background-music');
const wallHitSound = document.getElementById('wall-hit-sound');
const foodEatenSound = document.getElementById('food-eaten-sound');

// Add a flag to detect user interaction
let musicStarted = false;

// Create game board cells
for (let i = 0; i < gridSize * gridSize; i++) {
    const div = document.createElement('div');
    game.appendChild(div);
}

// Draw the snake
function drawSnake() {
    snake.forEach(index => game.children[index].classList.add('snake'));
}

// Remove the snake
function removeSnake() {
    snake.forEach(index => game.children[index].classList.remove('snake'));
}

// Place food inside the grid and not on the snake's body
function placeFood() {
    do {
        // Ensure food position is within the valid grid (0 to gridSize*gridSize-1)
        food = Math.floor(Math.random() * (gridSize * gridSize));
    } while (game.children[food].classList.contains('snake')); // Check that food is not placed on the snake

    game.children[food].classList.add('food'); // Add food to the game grid
}

drawSnake();
placeFood();

function moveSnake() {
    const head = snake[0] + direction;

    // Check for collisions (wall or self)
    if (
        head % gridSize === gridSize - 1 && direction === 1 || // Right wall
        head % gridSize === 0 && direction === -1 || // Left wall
        head < 0 || head >= gridSize * gridSize || // Top/Bottom wall
        game.children[head].classList.contains('snake') // Self
    ) {
        // Stop background music
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Reset music to the start

        // Play wall hit sound
        wallHitSound.play();

        // Show game over alert
        setTimeout(() => {
            alert('Game Over!');
            location.reload(); // Reload the page to restart the game
        }, 500); // Delay alert after the sound finishes

        // Stop the game loop
        return clearInterval(interval);
    }

    // Add new head
    snake.unshift(head);

    // Check if snake eats food
    if (head === food) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        game.children[food].classList.remove('food');
        placeFood();
        foodEatenSound.play(); // Play food eaten sound
    } else {
        // Remove last part of snake
        const tail = snake.pop();
        game.children[tail].classList.remove('snake');
    }

    drawSnake();
}

// Start music on keypress or user interaction
document.addEventListener('keydown', (e) => {
    // Check if background music has started
    if (!musicStarted) {
        backgroundMusic.play(); // Start background music
        musicStarted = true; // Set flag to prevent replaying
    }

    if (e.key === 'ArrowUp' && direction !== gridSize) direction = -gridSize; // Up
    if (e.key === 'ArrowDown' && direction !== -gridSize) direction = gridSize; // Down
    if (e.key === 'ArrowLeft' && direction !== 1) direction = -1; // Left
    if (e.key === 'ArrowRight' && direction !== -1) direction = 1; // Right
});

// Add boundary checks for the snake to avoid it going out of bounds
function boundaryCheck() {
    const head = snake[0];
    if (head % gridSize === gridSize - 1 && direction === 1) {
        // If moving right and snake reaches the right edge, stop
        direction = 0; // Stop movement
    }
    if (head % gridSize === 0 && direction === -1) {
        // If moving left and snake reaches the left edge, stop
        direction = 0; // Stop movement
    }
    if (head < 0 || head >= gridSize * gridSize) {
        // If snake goes out of bounds (top or bottom), stop
        direction = 0; // Stop movement
    }
}

// Start the game loop
const interval = setInterval(() => {
    boundaryCheck(); // Perform boundary check before each move
    moveSnake(); // Move the snake
}, 90); // Speed of the game
