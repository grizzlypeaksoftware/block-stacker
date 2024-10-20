// input.js

export function setupKeyboardControls(handlers) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') handlers.moveLeft();
        else if (e.key === 'ArrowRight') handlers.moveRight();
        else if (e.key === 'ArrowDown') handlers.moveDown();
        else if (e.key === 'ArrowUp' || e.code === 'Space') handlers.rotate();
    });
}

export function setupTouchControls(canvas, handlers) {
    let canvasRect, canvasScale;

    function updateCanvasMetrics() {
        canvasRect = canvas.getBoundingClientRect();
        canvasScale = {
            x: canvas.width / canvasRect.width,
            y: canvas.height / canvasRect.height
        };
    }

    window.addEventListener('resize', updateCanvasMetrics);
    window.addEventListener('load', updateCanvasMetrics);

    function handleCanvasInteraction(event) {
        event.preventDefault();

        let x, y;
        if (event.type === 'touchstart') {
            const touch = event.touches[0];
            x = touch.clientX - canvasRect.left;
            y = touch.clientY - canvasRect.top;
        } else {
            x = event.clientX - canvasRect.left;
            y = event.clientY - canvasRect.top;
        }

        x *= canvasScale.x;
        y *= canvasScale.y;

        if (Math.sqrt(Math.pow(x - (canvas.width - 20), 2) + Math.pow(y - 20, 2)) <= 15) {
            handlers.toggleInstructions();
        } else {
            handlers.hideInstructions();
        }
    }

    canvas.addEventListener('click', handleCanvasInteraction);
    canvas.addEventListener('touchstart', handleCanvasInteraction);
}

export function setupMobileControls(handlers) {
    const controlButtons = [
        { id: 'leftBtn', action: 'moveLeft' },
        { id: 'rightBtn', action: 'moveRight' },
        { id: 'downBtn', action: 'moveDown' },
        { id: 'rotateBtn', action: 'rotate' }
    ];

    controlButtons.forEach(({ id, action }) => {
        const btn = document.getElementById(id);
        ['touchstart', 'mousedown'].forEach(eventType => {
            btn.addEventListener(eventType, (e) => {
                e.preventDefault();
                handlers[action]();
            }, { passive: false });
        });
    });
}