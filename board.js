// board.js
import { COLS, ROWS } from './config.js';

export function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

export function clearLines(board, score) {
    let linesCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            board.splice(r, 1);
            board.unshift(new Array(COLS).fill(0));
            linesCleared++;
            r++; // Check the same row again
        }
    }
    return score + linesCleared * 100;
}

export function collision(piece, board) {
    if (!piece || !piece.shape) return true; // Add this line to check if piece exists

    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c]) {
                const newX = piece.x + c;
                const newY = piece.y + r;
                if (
                    newX < 0 || newX >= COLS || newY >= ROWS ||
                    (newY >= 0 && board[newY] && board[newY][newX] !== 0)
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function mergePiece(piece, board) {
    if (!piece || !piece.shape) return; // Add this check

    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const boardY = piece.y + y;
                const boardX = piece.x + x;
                if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                    board[boardY][boardX] = piece.colorIndex + 1;
                }
            }
        });
    });
}