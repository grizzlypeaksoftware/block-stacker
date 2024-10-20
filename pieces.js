// pieces.js
import { PIECES, COLS } from './config.js';

export function getRandomPiece() {
    const shapeIndex = Math.floor(Math.random() * PIECES.length);
    return {
        shape: PIECES[shapeIndex],
        x: Math.floor(COLS / 2) - 1,
        y: 0,
        colorIndex: shapeIndex
    };
}

export function rotatePiece(piece) {
    const rotated = piece.shape[0].map((_, i) => 
        piece.shape.map(row => row[i]).reverse()
    );
    return { ...piece, shape: rotated };
}

export function movePiece(piece, dx, dy) {
    return { ...piece, x: piece.x + dx, y: piece.y + dy };
}