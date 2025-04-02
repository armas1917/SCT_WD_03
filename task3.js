// script.js
const cells = document.querySelectorAll('.cell');
const messageDiv = document.getElementById('message');
const resetButton = document.getElementById('reset');
const modeSelect = document.getElementById('modeSelect');
const boardDiv = document.getElementById('board');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'player';

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    if (checkWin()) {
        messageDiv.textContent = `${currentPlayer} wins!`;
        gameActive = false;
        visualizeWin();
        return;
    }

    if (checkDraw()) {
        messageDiv.textContent = 'Draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (gameMode === 'computer' && currentPlayer === 'O' && gameActive) {
        computerMove();
    }
}

function checkWin() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return condition;
        }
    }
    return null;
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    messageDiv.textContent = '';
    cells.forEach(cell => cell.textContent = '');
    document.querySelectorAll('.winning-line').forEach(line => line.remove());
}

function computerMove() {
    let bestMove = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    if (checkWin()) {
        messageDiv.textContent = 'Computer wins!';
        gameActive = false;
        visualizeWin();
    } else if (checkDraw()) {
        messageDiv.textContent = 'Draw!';
        gameActive = false;
    } else {
        currentPlayer = 'X';
    }
}

function minimax(board, depth, isMaximizing) {
    if (checkWin()) {
        return isMaximizing ? -1 : 1;
    }
    if (checkDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function visualizeWin() {
    const winCondition = checkWin();
    if (winCondition) {
        const [a, b, c] = winCondition;
        const cellA = cells[a].getBoundingClientRect();
        const cellC = cells[c].getBoundingClientRect();

        const line = document.createElement('div');
        line.classList.add('winning-line');
        boardDiv.appendChild(line);

        const length = Math.sqrt(Math.pow(cellC.left - cellA.left, 2) + Math.pow(cellC.top - cellA.top, 2));
        const angle = Math.atan2(cellC.top - cellA.top, cellC.left - cellA.left) * (180 / Math.PI);

        line.style.width = length + 'px';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.left = (cellA.left + cellA.width / 2 + window.scrollX) + 'px';
        line.style.top = (cellA.top + cellA.height / 2 + window.scrollY) + 'px';
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
modeSelect.addEventListener('change', (event) => {
    gameMode = event.target.value;
    resetGame();
});