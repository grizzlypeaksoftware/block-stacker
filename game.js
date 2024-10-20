// game.js
import { COLS, ROWS, GAME_SPEED, calculateBlockSize } from './config.js';
import { createBoard, clearLines, collision, mergePiece } from './board.js';
import { getRandomPiece, rotatePiece, movePiece } from './pieces.js';
import { initCanvas, draw } from './renderer.js';
import { setupKeyboardControls, setupTouchControls, setupMobileControls } from './input.js';

const gameState = {
    board: null,
    currentPiece: null,
    score: 0,
    dropCounter: 0,
    lastTime: 0,
    gameOver: false,
    showInstructions: false,
    BLOCK_SIZE: 0,
    lastToggleTime: 0
};

const canvas = document.getElementById('gameCanvas');
let ctx;

function init() {
    gameState.board = createBoard();
    gameState.score = 0;
    gameState.dropCounter = 0;
    gameState.lastTime = 0;
    gameState.gameOver = false;
    gameState.showInstructions = false;
    gameState.currentPiece = getRandomPiece();
    
    gameState.BLOCK_SIZE = calculateBlockSize();
    ctx = initCanvas(canvas, COLS, ROWS, gameState.BLOCK_SIZE);
}

function gameLoop(time = 0) {
    const deltaTime = time - gameState.lastTime;
    gameState.lastTime = time;
    
    if (!gameState.gameOver && !gameState.showInstructions) {
        gameState.dropCounter += deltaTime;
        if (gameState.dropCounter > GAME_SPEED) {
            moveDown();
            gameState.dropCounter = 0;
        }
    }
    
    draw(ctx, gameState.board, gameState.currentPiece, gameState.score, gameState.gameOver, gameState.showInstructions, gameState.BLOCK_SIZE);
    requestAnimationFrame(gameLoop);
}

function moveDown() {
    const newPiece = movePiece(gameState.currentPiece, 0, 1);
    if (!collision(newPiece, gameState.board)) {
        gameState.currentPiece = newPiece;
    } else {
        mergePiece(gameState.currentPiece, gameState.board);
        gameState.score = clearLines(gameState.board, gameState.score);
        gameState.currentPiece = getRandomPiece();
        
        if (collision(gameState.currentPiece, gameState.board)) {
            gameState.gameOver = true;
        }
    }
}

function moveLeft() {
    const newPiece = movePiece(gameState.currentPiece, -1, 0);
    if (!collision(newPiece, gameState.board)) gameState.currentPiece = newPiece;
}

function moveRight() {
    const newPiece = movePiece(gameState.currentPiece, 1, 0);
    if (!collision(newPiece, gameState.board)) gameState.currentPiece = newPiece;
}

function rotate() {
    const newPiece = rotatePiece(gameState.currentPiece);
    if (!collision(newPiece, gameState.board)) gameState.currentPiece = newPiece;
}

function restartGame() {
    if (gameState.gameOver) {
        init();
        gameLoop();
    }
}

function toggleInstructions() {
    const now = Date.now();
    if (now - gameState.lastToggleTime < 300) {
        console.log('Debounced toggle');
        return;
    }
    gameState.lastToggleTime = now;
    console.log('toggleInstructions called. Before:', gameState.showInstructions);
    gameState.showInstructions = !gameState.showInstructions;
    console.log('After:', gameState.showInstructions);
}

function hideInstructions() {
    if (gameState.showInstructions) {
        console.log('Hiding instructions');
        gameState.showInstructions = false;
    }
}

function handleInteraction(event) {
    event.preventDefault();
    
    const touch = event.type.startsWith('touch') ? event.touches[0] : event;
    
    const rect = canvas.getBoundingClientRect();
    const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
    
    console.log('Interaction at:', x, y);
    
    // Check if click/tap is on the ? icon
    if (x >= canvas.width - 35 && x <= canvas.width - 5 && y >= 5 && y <= 35) {
        console.log('? icon clicked');
        toggleInstructions();
        event.stopPropagation();
        return;
    }
    
    // If instructions are shown, hide them on any click/tap outside the ? icon
    if (gameState.showInstructions) {
        hideInstructions();
        return;
    }
    
    // Handle other game interactions
    if (gameState.gameOver) {
        console.log('Restarting game');
        restartGame();
    }
    
    draw(ctx, gameState.board, gameState.currentPiece, gameState.score, gameState.gameOver, gameState.showInstructions, gameState.BLOCK_SIZE);
}

const handlers = {
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    toggleInstructions,
    hideInstructions,
    restartGame
};

setupKeyboardControls(handlers);
setupTouchControls(canvas, handlers);
setupMobileControls(handlers);

window.addEventListener('resize', () => {
    gameState.BLOCK_SIZE = calculateBlockSize();
    ctx = initCanvas(canvas, COLS, ROWS, gameState.BLOCK_SIZE);
    draw(ctx, gameState.board, gameState.currentPiece, gameState.score, gameState.gameOver, gameState.showInstructions, gameState.BLOCK_SIZE);
});

// Remove existing event listeners
canvas.removeEventListener('click', handleInteraction);
canvas.removeEventListener('touchstart', handleInteraction);

// Add new event listeners
canvas.addEventListener('click', handleInteraction, { capture: true });
canvas.addEventListener('touchstart', handleInteraction, { passive: false, capture: true });

init();
gameLoop();