const cells = document.querySelectorAll(".grid-cell");
const announcement = document.getElementById("announcement");
const continueBtn = document.getElementById("btn-continue");
const resetBtn = document.getElementById("btn-reset");
const xScore = document.getElementById("x-score");
const oScore = document.getElementById("o-score");
let board = ["", "", "", "", "", "", "", "", ""];
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
let endGame = false;

setGame();

function setGame () {
    endGame = false;
    playerTurn = 0;
    board = ["", "", "", "", "", "", "", "", ""];
    announcement.textContent = "Player X's Turn";
    for(let i = 0; i < 9; i++){
        document.getElementById(i).textContent = '';
    }
}

cells.forEach((cell) => {
    cell.addEventListener('click', (e) => {
        let id = e.target.id;
        if (cell.textContent === '' && !endGame) {
            if(playerTurn % 2 === 0){
                cell.textContent = "X";
                board[id] = "X";
                announcement.textContent = "Player O's Turn";
            }
            else {
                cell.textContent = "O";
                board[id] = "O"
                announcement.textContent = "Player X's Turn";
            }
            playerTurn++;
            if (result()) {
                endGame = true;
            }
            if (playerTurn === 9) {
                announcement.textContent = "It's a Draw";
                endGame = true;
            }
            if (endGame) {
                continueBtn.style.opacity = "1";
            }
        }
    });
});

resetBtn.addEventListener('click', () => {
    setGame();
    xScore.textContent = 0;
    oScore.textContent = 0;
});

continueBtn.addEventListener('click', () => {
    setGame();
    continueBtn.style.opacity = "0";
});

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