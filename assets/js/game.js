const gameBoard = document.getElementById('game-board');
const ROWS = 15;
const COLUMNS = 20;
const PIXEL = 20;
const gameBoardMap = new Map();
let SNAKE_POINTER = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
];
let SNAKE_DIRECTION = 'right';
let GAME_INTERVAL = null;
let GAME_TIMEOUT = 500;
let FRUIT = null;

function initGameBoard() {
  // Set game board height width based on rows, columns and pixels.
  gameBoard.style.height = ROWS * PIXEL + 'px';
  gameBoard.style.width = COLUMNS * PIXEL + 'px';

  // Add pixels to the game board.
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      let position = i + '-' + j;
      let pixel = document.createElement('div');
      pixel.style.width = PIXEL + 'px';
      pixel.style.height = PIXEL + 'px';
      pixel.style.position = 'absolute';
      pixel.style.border = '1px solid #ddd';
      pixel.style.top = i * PIXEL + 'px';
      pixel.style.left = j * PIXEL + 'px';
      pixel.id = position;
      gameBoard.appendChild(pixel);
      gameBoardMap.set(position, pixel);
    }
  }
}

function drawSnake() {
  // Snake set.
  const snake = new Set();
  for (let i = 0; i < SNAKE_POINTER.length; i++) {
    snake.add(`${SNAKE_POINTER[i][0]}-${SNAKE_POINTER[i][1]}`);
  }

  // Draw snake.
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      let position = i + '-' + j;
      let fruit_position = FRUIT[0] + '-' + FRUIT[1];
      let pixel = gameBoardMap.get(position);
      pixel.style.background = snake.has(position)
        ? 'black'
        : position === fruit_position
        ? 'red'
        : 'white';
    }
  }
}

function moveSnake() {
  // Derive next pointer.
  let current_pointer = SNAKE_POINTER[SNAKE_POINTER.length - 1];
  switch (SNAKE_DIRECTION) {
    case 'top':
      [next_x, next_y] = [current_pointer[0] - 1, current_pointer[1]];
      break;
    case 'right':
      [next_x, next_y] = [current_pointer[0], current_pointer[1] + 1];
      break;
    case 'bottom':
      [next_x, next_y] = [current_pointer[0] + 1, current_pointer[1]];
      break;
    case 'left':
      [next_x, next_y] = [current_pointer[0], current_pointer[1] - 1];
      break;
  }

  // Snake set without first element.
  const snake = new Set();
  for (let i = 1; i < SNAKE_POINTER.length; i++) {
    snake.add(`${SNAKE_POINTER[i][0]}-${SNAKE_POINTER[i][1]}`);
  }

  let [fruit_x, fruit_y] = FRUIT;

  // Move snake.
  if (
    typeof next_x !== 'undefined' &&
    typeof next_y !== 'undefined' &&
    typeof gameBoardMap.get(next_x + '-' + next_y) !== 'undefined' &&
    !snake.has(next_x + '-' + next_y)
  ) {
    if (fruit_x === next_x && fruit_y === next_y) {
      placeFruit();
    } else {
      SNAKE_POINTER.shift();
    }
    SNAKE_POINTER.push([next_x, next_y]);
  } else {
    // Game over!!!
    clearInterval(GAME_INTERVAL);
  }

  drawSnake();
}

function gameControls() {
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        if (SNAKE_DIRECTION !== 'top' && SNAKE_DIRECTION !== 'bottom')
          SNAKE_DIRECTION = 'top';
        break;
      case 'd':
      case 'ArrowRight':
        if (SNAKE_DIRECTION !== 'right' && SNAKE_DIRECTION !== 'left')
          SNAKE_DIRECTION = 'right';
        break;
      case 's':
      case 'ArrowDown':
        if (SNAKE_DIRECTION !== 'bottom' && SNAKE_DIRECTION !== 'top')
          SNAKE_DIRECTION = 'bottom';
        break;
      case 'a':
      case 'ArrowLeft':
        if (SNAKE_DIRECTION !== 'left' && SNAKE_DIRECTION !== 'right')
          SNAKE_DIRECTION = 'left';
        break;
      case 'Escape':
        clearInterval(GAME_INTERVAL);
        window.location.reload(true);
        break;
    }
  });
}

function placeFruit() {
  // Snake set.
  const snake = new Set();
  for (let i = 0; i < SNAKE_POINTER.length; i++) {
    snake.add(`${SNAKE_POINTER[i][0]}-${SNAKE_POINTER[i][1]}`);
  }

  // Find where to place which doesn't cover snake pixels.
  do {
    [fruit_x, fruit_y] = [
      Math.floor(Math.random() * ROWS),
      Math.floor(Math.random() * COLUMNS),
    ];
  } while (snake.has(fruit_x + '-' + fruit_y));

  FRUIT = [fruit_x, fruit_y];
  console.log(FRUIT);
}

initGameBoard();
placeFruit();
drawSnake();
gameControls();

GAME_INTERVAL = setInterval(moveSnake, GAME_TIMEOUT);
