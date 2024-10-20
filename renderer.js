// renderer.js
import { COLORS } from './config.js';

let DEBUG_MODE = false; // Toggle this to show/hide the debug box

export function initCanvas(canvas, COLS, ROWS, BLOCK_SIZE) {
    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;
    return canvas.getContext('2d');
}

export function draw(ctx, board, piece, score, gameOver, showInstructions, BLOCK_SIZE) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    drawBoard(ctx, board, BLOCK_SIZE);
    if (piece) drawPiece(ctx, piece, BLOCK_SIZE);
    drawScore(ctx, score);
    drawHelpIcon(ctx);
    
    if (DEBUG_MODE) {
        drawDebugBox(ctx);
    }
    
    if (showInstructions) {
        drawInstructions(ctx);
    }
    if (gameOver) {
        drawGameOver(ctx, score);
    }
}
function drawBoard(ctx, board, BLOCK_SIZE) {
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                ctx.fillStyle = COLORS[value - 1];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        });
    });
}

function drawPiece(ctx, piece, BLOCK_SIZE) {
    ctx.fillStyle = COLORS[piece.colorIndex];
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                ctx.fillRect((piece.x + x) * BLOCK_SIZE, (piece.y + y) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        });
    });
}

function drawScore(ctx, score) {
    ctx.fillStyle = '#FFF';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 10, 20);
}

function drawHelpIcon(ctx) {
    ctx.fillStyle = '#4ECDC4';
    ctx.beginPath();
    ctx.arc(ctx.canvas.width - 20, 20, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', ctx.canvas.width - 20, 20);
}

function drawDebugBox(ctx) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ctx.canvas.width - 20, 20, 15, 0, Math.PI * 2);
    ctx.stroke();

    // Draw a box around the clickable area
    ctx.strokeRect(ctx.canvas.width - 35, 5, 30, 30);
}
function drawInstructions(ctx) {
    const instructions = [
        "Use arrow keys or buttons to move",
        "Up arrow or Rotate button to rotate",
        "Down arrow for soft drop",
        "Space bar for hard drop",
        "Click the ? for instructions"
    ];

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#FFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    instructions.forEach((instruction, index) => {
        ctx.fillText(instruction, ctx.canvas.width / 2, 100 + index * 30);
    });
}

function drawGameOver(ctx, score) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#FFF';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', ctx.canvas.width / 2, ctx.canvas.height / 2 - 50);
    ctx.fillText(`Score: ${score}`, ctx.canvas.width / 2, ctx.canvas.height / 2);
    
    ctx.font = '20px Arial';
    ctx.fillStyle = '#4ECDC4';
    ctx.fillText('Tap or Click to Restart', ctx.canvas.width / 2, ctx.canvas.height / 2 + 50);
}