// config.js
export const COLS = 10;
export const ROWS = 20;
export const GAME_SPEED = 400; // milliseconds per drop

export const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FDCB6E", "#6C5CE7", "#FFA07A", "#55E6C1"];

export const PIECES = [
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1], [1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 1, 1]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1, 1], [0, 0, 1]]
];

export function calculateBlockSize() {
    const maxWidth = Math.min(400, window.innerWidth - 20); // 20px for padding
    return Math.floor(maxWidth / COLS);
}