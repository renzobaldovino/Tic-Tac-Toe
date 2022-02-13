const modePage = document.querySelector(".mode-page");
const symbolPage = document.querySelector(".symbol-page");
const gamePage = document.querySelector(".game-page");

const mode1 = document.getElementById("mode1");
const mode2 = document.getElementById("mode2");

const cells = document.querySelectorAll(".grid-cell");
const xScore = document.getElementById("x-score-value");
const oScore = document.getElementById("o-score-value");
const drawScore = document.getElementById("draw-score-value")
const continueBtn = document.getElementById("btn-continue");
const resetBtn = document.getElementById("btn-reset");
const homeBtn = document.getElementById("btn-home");
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let gameMode = 0;
let origBoard;
let playerTurn = 0;
let player1 = "X";
let player2 = "O";

setGame();

function selectMode(mode) {
    gameMode = mode;
    modePage.style.display = "none";
    if (gameMode === 1) {
        symbolPage.style.display = "flex";
    }
    else {
        gamePage.style.display = "flex";
    }
}

function selectSymbol(symbol) {
    player1 = symbol;
    player2 = symbol === "O" ? "X" : "O";
    symbolPage.style.display = "none";
    gamePage.style.display = "flex";
    if (player2 === "X") {
        turn(aiMove(), player2);
    }
}

function setGame() {
    document.querySelector(".gameOver").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for(let i = 0; i < 9; i++){
        cells[i].innerText = '';
        cells[i].style.background = "#f5f5f5"
        cells[i].addEventListener('click', handleClick, false);
    }
}

function handleClick(e) {
    let id = e.target.id;
    if (typeof origBoard[id] === 'number') {
        if (gameMode === 1) {
            turn(id, player1);
            if (!checkWin(origBoard, player1) && !checkTie()) {
                turn(aiMove(), player2);
            }
        }
        else if (gameMode === 2) {
            player1 = "X";
            player2 = "O";
            if (playerTurn % 2 === 0) {
                turn(id, player1);
            }
            else {
                turn(id, player2);
            }
            playerTurn++;
        }
    }
}

function turn(id, player) {
    origBoard[id] = player;
    document.getElementById(id).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) {
        gameOver(gameWon);
        if (gameMode === 2) {
            playerTurn = -1;
        }
    }
    else if (checkTie()) {
        announce("It's a Draw");
        drawScore.innerText++;
        if (gameMode === 2) {
            playerTurn = -1;
        }
    }
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winningConditions.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winningConditions[gameWon.index]) {
        let element = document.getElementById(index)
        element.style.background = "#406b6c60";
    }
    for (let i = 0; i < 9; i++) {
        cells[i].removeEventListener('click', handleClick, false);
    }
    gameWon.player === "X" ? xScore.innerText++ : oScore.innerText++;
    if (gameMode === 1){
        announce(gameWon.player === player1 ? "You Win!" : "You Lose");
    }
    else {
        announce(gameWon.player === "X" ? "Player 1 Wins" : "Player 2 Wins");
    }
}

function announce(announcement) {
    document.querySelector(".gameOver").style.display = "flex";
    document.getElementById("announcement").innerText = announcement;
}

function emptyCell() {
    return origBoard.filter((elem, i) => i === elem);
}

function checkTie() {
    if (emptyCell().length === 0) {
        for (let i = 0; i < 9; i++) {
            cells[i].removeEventListener('click', handleClick, false);
        }
        return true;
    }
    return false;
}

function aiMove() {
    return minimax(origBoard, player2).index;
}

function minimax(newBoard, player) {
    var avplayer2lSpots = emptyCell(newBoard);

    if (checkWin(newBoard, player1)) {
        return {score: -10};
    } else if (checkWin(newBoard, player2)) {
        return {score: 10};
    } else if (avplayer2lSpots.length === 0) {
        return {score: 0};
    }
      
    var moves = [];
    for (let i = 0; i < avplayer2lSpots.length; i ++) {
        var move = {};
        move.index = newBoard[avplayer2lSpots[i]];
        newBoard[avplayer2lSpots[i]] = player;
        
        if (player === player2){
            move.score = minimax(newBoard, player1).score;
        }
        else {
            move.score =  minimax(newBoard, player2).score;
        }
        newBoard[avplayer2lSpots[i]] = move.index;
        if ((player === player2 && move.score === 10) || (player === player1 && move.score === -10)){
            return move;
        }
        else {
            moves.push(move);
        }
    }
      
    let bestMove, bestScore;
    if (player === player2) {
        bestScore = -1000;
        for(let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
            }
        }
    }
    else {
        bestScore = 1000;
        for(let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
            }
        }
    }
    
    return moves[bestMove];
}

function reset() {
    setGame();
    xScore.textContent = 0;
    oScore.textContent = 0;
    drawScore.textContent = 0;
}

continueBtn.addEventListener('click', () => {
    setGame();
    if (gameMode === 1 && player2 === "X"){
        turn(aiMove(), player2);
    }
}, false);

resetBtn.addEventListener('click', reset, false);

homeBtn.addEventListener('click', () => {
    reset();
    gamePage.style.display = "none";
    modePage.style.display = "flex";
}, false);

