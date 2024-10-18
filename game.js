// Game constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20;
const GAME_SPEED = 400; // Slightly faster speed (milliseconds per drop)

// Game variables
let board = [];
let currentPiece;
let score = 0;
let dropCounter = 0;
let lastTime = 0;
let gameOver = false;

// Piece shapes (slightly different from traditional Tetris)
const PIECES = [
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1], [1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 1, 1]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1, 1], [0, 0, 1]]
];

// Colors for pieces
const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FDCB6E", "#6C5CE7", "#FFA07A", "#55E6C1"];

// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set initial canvas size
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

// Function to handle canvas resizing
function resizeCanvas() {
    const gameContainer = document.getElementById('gameContainer');
    const maxWidth = Math.min(gameContainer.clientWidth, 400);
    const maxHeight = window.innerHeight - 120; // Increased to account for controls and prevent scrolling
    const aspectRatio = COLS / ROWS;

    let newWidth = maxWidth;
    let newHeight = newWidth / aspectRatio;

    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
    }

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
}

// Call resizeCanvas on window resize and initial load
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

// Initialize the game board
function initBoard() {
    board = [];
    for (let r = 0; r < ROWS; r++) {
        board[r] = new Array(COLS).fill(0);
    }
}

// Game loop
function gameLoop(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    
    if (!gameOver) {
        dropCounter += deltaTime;
        if (dropCounter > GAME_SPEED) {
            moveDown();
            dropCounter = 0;
        }
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

// Draw the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const scale = canvas.width / (COLS * BLOCK_SIZE);
    ctx.save();
    ctx.scale(scale, scale);
    
    // Draw the board
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c]) {
                ctx.fillStyle = COLORS[board[r][c] - 1];
                ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        }
    }
    
    // Draw the current piece
    if (currentPiece) {
        ctx.fillStyle = COLORS[currentPiece.colorIndex];
        for (let r = 0; r < currentPiece.shape.length; r++) {
            for (let c = 0; c < currentPiece.shape[r].length; c++) {
                if (currentPiece.shape[r][c]) {
                    ctx.fillRect((currentPiece.x + c) * BLOCK_SIZE, (currentPiece.y + r) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                }
            }
        }
    }
    
    ctx.restore();
    
    // Draw score
    ctx.fillStyle = '#FFF';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 25);

    // Draw game over screen
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.font = '16px "Press Start 2P"';
        ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 10);
        
        ctx.font = '12px "Press Start 2P"';
        ctx.fillText('Press SPACE', canvas.width / 2, canvas.height / 2 + 40);
        ctx.fillText('to restart', canvas.width / 2, canvas.height / 2 + 60);
    }
}

// Get a random piece
function getRandomPiece() {
    const shapeIndex = Math.floor(Math.random() * PIECES.length);
    return {
        shape: PIECES[shapeIndex],
        x: Math.floor(COLS / 2) - 1,
        y: 0,
        colorIndex: shapeIndex
    };
}

// Check for collision
function collision() {
    for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
            if (currentPiece.shape[r][c]) {
                const newX = currentPiece.x + c;
                const newY = currentPiece.y + r;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Merge the piece with the board
function mergePiece() {
    for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
            if (currentPiece.shape[r][c]) {
                board[currentPiece.y + r][currentPiece.x + c] = currentPiece.colorIndex + 1;
            }
        }
    }
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            board.splice(r, 1);
            board.unshift(new Array(COLS).fill(0));
            linesCleared++;
            r++; // Check the same row again
        }
    }
    score += linesCleared * 100;
}

// Reset the game
function resetGame() {
    initBoard();
    score = 0;
    currentPiece = getRandomPiece();
    gameOver = false;
}

// Handle key presses
document.addEventListener('keydown', handleInput);

function handleInput(e) {
    if (gameOver) {
        if (e.code === 'Space') {
            resetGame();
        }
        return;
    }

    if (!currentPiece) return;
    
    if (e.key === 'ArrowLeft') {
        moveLeft();
    } else if (e.key === 'ArrowRight') {
        moveRight();
    } else if (e.key === 'ArrowDown') {
        moveDown();
    } else if (e.key === 'ArrowUp' || e.code === 'Space') {
        rotatePiece();
    }
}

function moveLeft() {
    currentPiece.x--;
    if (collision()) currentPiece.x++;
}

function moveRight() {
    currentPiece.x++;
    if (collision()) currentPiece.x--;
}

function moveDown() {
    currentPiece.y++;
    if (collision()) {
        currentPiece.y--;
        mergePiece();
        clearLines();
        currentPiece = getRandomPiece();
        
        if (collision()) {
            gameOver = true;
        }
    }
}

// Rotate the current piece
function rotatePiece() {
    const rotated = currentPiece.shape[0].map((_, i) => 
        currentPiece.shape.map(row => row[i]).reverse()
    );
    const prevShape = currentPiece.shape;
    currentPiece.shape = rotated;
    if (collision()) {
        currentPiece.shape = prevShape;
    }
}

// Mobile controls
document.getElementById('leftBtn').addEventListener('click', moveLeft);
document.getElementById('rightBtn').addEventListener('click', moveRight);
document.getElementById('downBtn').addEventListener('click', moveDown);
document.getElementById('rotateBtn').addEventListener('click', rotatePiece);

// Start the game
initBoard();
resetGame();
gameLoop();