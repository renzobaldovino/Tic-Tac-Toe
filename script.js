const gameBoard = document.querySelector(".game-board");
const announcement = document.getElementById("announcement");
const continueBtn = document.getElementById("btn-continue");
const resetBtn = document.getElementById("btn-reset");
const xScore = document.getElementById("x-score");
const oScore = document.getElementById("o-score");
let board = [];
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
let playerTurn = 0;

gameBoard.addEventListener('click', function(e) {
    let cell = document.getElementById(e.target.id);
    if(cell.textContent === ''){
        if(playerTurn % 2 === 0){
            cell.textContent = "X";
            announcement.textContent = "Player O's Turn";
        }
        else {
            cell.textContent = "O";
            announcement.textContent = "Player X's Turn";
        }
        playerTurn++;
        setBoard();
        if (playerTurn === 9) {
            announcement.textContent = "It's a Draw";
            reset()
        }
        if (result()) {
            reset();
        }
    }
});

resetBtn.addEventListener('click', function () {
    reset();
    xScore.textContent = 0;
    oScore.textContent = 0;
});

function setBoard(){
    board = [];
    for(let i = 1; i <= 9; i++){
        board.push(document.getElementById("cell" + i).textContent);
    }
}

function result(){
    for(let i = 0; i < 8; i++) {
        const condition = winningConditions[i];
        const a = board[condition[0]];
        const b = board[condition[1]];
        const c = board[condition[2]];
        if (a === '' && b === '' && c === '') {
            continue;
        }
        if (a === b && b === c) {
            if (a === "X") {
                xScore.innerText = Number(xScore.innerText) + 1;
                announcement.textContent = "Player X Wins";
            }
            if (a === "O") {
                oScore.innerText = Number(oScore.innerText) + 1;
                announcement.textContent = "Player O Wins";
            }
            return true;
        }
    }
}

function reset () {
    playerTurn = 0;
    board = [];
    announcement.textContent = "Player X's Turn";
    for(let i = 1; i <= 9; i++){
        document.getElementById("cell" + i).textContent = '';
    }
}