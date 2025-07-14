// Variables del juego
let canvas, ctx;
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameRunning = false;
let gamePaused = false;
let score = 0;
let gameSpeed = 150;
let gameLoop;

// Configuración del juego
const gridSize = 40;
const canvasSize = 600;

// Colores
const colors = {
    snake: '#D4C4A8',
    snakeHead: '#8B7355',
    food: '#654321',
    background: '#F4F1E8',
    grid: '#E8E0D0'
};

// Imagen de grano de café para la comida
const cafeImg = new Image();
cafeImg.src = '../img/cafe-ficha.png';
let cafeImgLoaded = false;
cafeImg.onload = function() {
    cafeImgLoaded = true;
    drawGame(); // Redibuja el juego cuando la imagen esté lista
}

// Inicializar el juego
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Inicializar serpiente
    snake = [
        {x: 6, y: 10},
        {x: 5, y: 10},
        {x: 4, y: 10}
    ];
    
    // Generar comida inicial
    generateFood();
    
    // Dibujar estado inicial
    drawGame();
    
    // Configurar controles de teclado
    document.addEventListener('keydown', handleKeyPress);
}

// Generar comida en posición aleatoria
function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * (canvasSize / gridSize)),
            y: Math.floor(Math.random() * (canvasSize / gridSize))
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// Dibujar el juego
function drawGame() {
    // Limpiar canvas
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    // Dibujar grid
    drawGrid();
    
    // Dibujar serpiente
    drawSnake();
    
    // Dibujar comida
    drawFood();
}

// Dibujar grid
function drawGrid() {
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= canvasSize; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasSize, i);
        ctx.stroke();
    }
}

// Dibujar serpiente
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? colors.snakeHead : colors.snake;
        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
    });
}

// Dibujar comida
function drawFood() {
    if (cafeImgLoaded) {
        const size = gridSize * 0.9;
        const offset = (gridSize - size) / 2;
        ctx.drawImage(
            cafeImg,
            food.x * gridSize + offset,
            food.y * gridSize + offset,
            size,
            size
        );
    } else {
        // Si la imagen no está lista, dibujar círculo marrón
        ctx.fillStyle = colors.food;
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 3,
            0,
            2 * Math.PI
        );
        ctx.fill();
    }
}

// Mover serpiente
function moveSnake() {
    if (!gameRunning || gamePaused) return;
    
    direction = nextDirection;
    
    // Obtener nueva posición de la cabeza
    const head = {...snake[0]};
    
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Verificar colisiones
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    // Agregar nueva cabeza
    snake.unshift(head);
    
    // Verificar si come
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        generateFood();
        
        // Aumentar velocidad
        if (score % 50 === 0 && gameSpeed > 50) {
            gameSpeed -= 10;
            clearInterval(gameLoop);
            gameLoop = setInterval(moveSnake, gameSpeed);
        }
    } else {
        // Remover cola si no comió
        snake.pop();
    }
    
    drawGame();
}

// Verificar colisiones
function checkCollision(head) {
    // Colisión con bordes
    if (head.x < 0 || head.x >= canvasSize / gridSize || 
        head.y < 0 || head.y >= canvasSize / gridSize) {
        return true;
    }
    
    // Colisión con el cuerpo
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// Manejar teclas
function handleKeyPress(event) {
    if (!gameRunning) return;
    
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
}

// Cambiar dirección (para botones táctiles)
function changeDirection(newDirection) {
    if (!gameRunning) return;
    
    const opposites = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
    };
    
    if (direction !== opposites[newDirection]) {
        nextDirection = newDirection;
    }
}

// Iniciar juego
function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    gamePaused = false;
    score = 0;
    gameSpeed = 150;
    direction = 'right';
    nextDirection = 'right';
    
    document.getElementById('score').textContent = '0';
    
    // Reinicializar serpiente
    snake = [
        {x: 6, y: 10},
        {x: 5, y: 10},
        {x: 4, y: 10}
    ];
    
    generateFood();
    drawGame();
    
    gameLoop = setInterval(moveSnake, gameSpeed);
}

// Pausar juego
function pauseGame() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        clearInterval(gameLoop);
        // Mostrar mensaje de pausa
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSADO', canvasSize/2, canvasSize/2);
    } else {
        gameLoop = setInterval(moveSnake, gameSpeed);
    }
}

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // Mostrar pantalla de game over
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    ctx.fillStyle = 'white';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvasSize/2, canvasSize/2 - 20);
    
    ctx.font = '20px Arial';
    ctx.fillText(`Puntuación: ${score}`, canvasSize/2, canvasSize/2 + 20);
    ctx.fillText('Presiona "Jugar" para reiniciar', canvasSize/2, canvasSize/2 + 50);
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', initGame); 