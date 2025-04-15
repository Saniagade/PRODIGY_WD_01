const cells = document.querySelectorAll("[data-cell]");
const winningMessage = document.getElementById("winningMessage");
const messageText = document.getElementById("messageText");
const restartButton = document.getElementById("restartButton");

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let isPlayerTurn = true;
const difficulty = 0.6; 

startGame();
restartButton.addEventListener("click", startGame);

function startGame() {
  isPlayerTurn = true;
  cells.forEach(cell => {
    cell.classList.remove("x", "o");
    cell.textContent = "";
    cell.removeAttribute("disabled");
    cell.addEventListener("click", handleClick, { once: true });
  });
  winningMessage.classList.remove("show");
}

function handleClick(e) {
  if (!isPlayerTurn) return;

  const cell = e.target;
  placeMark(cell, "x");

  if (checkWin("x")) {
    endGame("X");
    return;
  } else if (isDraw()) {
    endGame("draw");
    return;
  }

  isPlayerTurn = false;
  setTimeout(computerMove, 300);
}

function computerMove() {
  const bestMove = getBestMove();
  if (bestMove !== undefined) {
    placeMark(cells[bestMove], "o");

    if (checkWin("o")) {
      endGame("O");
      return;
    } else if (isDraw()) {
      endGame("draw");
      return;
    }

    isPlayerTurn = true;
  }
}

function placeMark(cell, mark) {
  cell.classList.add(mark);
  cell.textContent = mark.toUpperCase();
  cell.setAttribute("disabled", "true");
}

function checkWin(mark) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cells[index].classList.contains(mark);
    });
  });
}

function isDraw() {
  return [...cells].every(cell =>
    cell.classList.contains("x") || cell.classList.contains("o")
  );
}

function endGame(result) {
  if (result === "draw") {
    messageText.textContent = "It's a Draw!";
  } else {
    messageText.textContent = `${result} Wins! 🎉`;
  }
  winningMessage.classList.add("show");
  cells.forEach(cell => cell.setAttribute("disabled", "true"));
}

function getBestMove() {
  let moves = [];

  cells.forEach((cell, index) => {
    if (!cell.classList.contains("x") && !cell.classList.contains("o")) {
      cell.classList.add("o");
      let score = minimax(cells, 0, false);
      cell.classList.remove("o");
      moves.push({ index, score });
    }
  });

  
  if (Math.random() > difficulty) {
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return randomMove.index;
  }

  
  return moves.sort((a, b) => b.score - a.score)[0].index;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinOnBoard(board, "o")) return 10 - depth;
  if (checkWinOnBoard(board, "x")) return depth - 10;
  if ([...board].every(cell => cell.classList.contains("x") || cell.classList.contains("o"))) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    board.forEach((cell, index) => {
      if (!cell.classList.contains("x") && !cell.classList.contains("o")) {
        cell.classList.add("o");
        let score = minimax(board, depth + 1, false);
        cell.classList.remove("o");
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    board.forEach((cell, index) => {
      if (!cell.classList.contains("x") && !cell.classList.contains("o")) {
        cell.classList.add("x");
        let score = minimax(board, depth + 1, true);
        cell.classList.remove("x");
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

function checkWinOnBoard(board, mark) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return board[index].classList.contains(mark);
    });
  });
}

