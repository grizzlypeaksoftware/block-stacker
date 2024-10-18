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
let showInstructions = false;
let canvasRect;
let canvasScale;

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
    const maxHeight = window.innerHeight - 120;
    const aspectRatio = COLS / ROWS;

    let newWidth = maxWidth;
    let newHeight = newWidth / aspectRatio;

    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
    }

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;

    // Update canvasRect and canvasScale
    canvasRect = canvas.getBoundingClientRect();
    canvasScale = {
        x: canvas.width / canvasRect.width,
        y: canvas.height / canvasRect.height
    };
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
    
    if (!gameOver && !showInstructions) {
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
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 10, 15);

    // Draw help icon
    ctx.fillStyle = '#4ECDC4';
    ctx.beginPath();
    ctx.arc(canvas.width - 25, 25, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', canvas.width - 25, 25);

    // Draw instructions if showInstructions is true
    if (showInstructions) {
        drawInstructions();
    }

    // Draw game over screen
    if (gameOver) {
        drawGameOver();
    }
}

function drawInstructions() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFF';
    ctx.font = '16px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('INSTRUCTIONS', canvas.width / 2, 25);
    
    ctx.font = '12px Arial';
    const instructions = [
        'Desktop:',
        '← → : Move left/right',
        '↑ : Rotate',
        '↓ : Move down',
        '',
        'Mobile:',
        'Use on-screen buttons',
        '',
        'Clear lines to score!',
        'Game over when blocks',
        'reach the top!'
    ];
    
    instructions.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, 50 + index * 30);
    });
    
    ctx.font = '12px Arial';
    ctx.fillText('Tap anywhere to close', canvas.width / 2, canvas.height - 30);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFF';
    ctx.font = '16px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 10);
    
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 50);
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
    if (showInstructions) {
        showInstructions = false;
        return;
    }

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

// Function to handle both click and touch events
function handleCanvasInteraction(event) {
    event.preventDefault(); // Prevent default touch behavior

    let x, y;
    if (event.type === 'touchstart') {
        const touch = event.touches[0];
        x = touch.clientX - canvasRect.left;
        y = touch.clientY - canvasRect.top;
    } else { // click event
        x = event.clientX - canvasRect.left;
        y = event.clientY - canvasRect.top;
    }

    x *= canvasScale.x;
    y *= canvasScale.y;

    // Check if help icon was tapped/clicked (increased detection area)
    if (Math.sqrt(Math.pow(x - (canvas.width - 25), 2) + Math.pow(y - 25, 2)) <= 20) {
        showInstructions = !showInstructions;
        console.log('Help icon interacted, showInstructions:', showInstructions); // Debug log
    } else if (showInstructions) {
        showInstructions = false;
    }
}

// Add both click and touch event listeners
canvas.addEventListener('click', handleCanvasInteraction);
canvas.addEventListener('touchstart', handleCanvasInteraction);

// Prevent default touch behavior
function preventDefault(e) {
    e.preventDefault();
}

canvas.addEventListener('touchmove', preventDefault, { passive: false });
canvas.addEventListener('touchend', preventDefault, { passive: false });

// Update mobile controls
const controlButtons = ['leftBtn', 'rightBtn', 'downBtn', 'rotateBtn'];
controlButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        btn.click();
    }, { passive: false });
});

// Start the game
initBoard();
resetGame();
gameLoop();