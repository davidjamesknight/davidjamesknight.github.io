// Unicode symbols for white chess pieces
const pieceSymbols = {
  king: "♔",
  queen: "♕",
  rook: "♖",
  bishop: "♗",
  knight: "♘",
};

function setupBoard() {
  const piecesPool = [
    "queen",
    "queen",
    "rook",
    "rook",
    "rook",
    "rook",
    "bishop",
    "bishop",
    "bishop",
    "bishop",
    "knight",
    "knight",
    "knight",
    "knight",
  ];

  let board;
  do {
    // shuffle pieces
    const pieces = [...piecesPool];
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }

    // build empty 8x2 board
    board = Array.from({ length: 8 }, () => Array(2).fill(null));

    // bottom row fixed
    board[7][0] = "king"; // king bottom-left
    board[7][1] = null; // empty bottom-right

    // fill remaining 14 squares
    let idx = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 2; c++) {
        if (r === 7 && (c === 0 || c === 1)) continue; // skip bottom row
        board[r][c] = pieces[idx++];
      }
    }

    // check second-to-bottom row (row 6) for two knights
  } while (board[6].filter((p) => p === "knight").length === 2);

  return board;
}

// initialize board
let board = setupBoard();
let initialBoard = board.map((row) => [...row]); // deep copy for Try Again
let selectedPiece = null;
let highlightsEnabled = false; // New state variable
let moveCount = 0;

function renderBoard(board) {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  const [emptyRow, emptyCol] = findEmpty();

  board.flat().forEach((piece, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;

    const square = document.createElement("div");
    square.className = "square";
    square.textContent = piece ? pieceSymbols[piece] : "";

    // Add the 'finish-line' class to the top row squares
    if (row === 0) {
      square.classList.add("finish-line");
    }

    if (piece === "king") {
      square.classList.add("king");
    }

    if (piece) {
      const valid = canMove(piece, row, col, emptyRow, emptyCol);
      if (valid) {
        if (highlightsEnabled) {
          square.classList.add("highlight");
        }
      } else {
        square.classList.add("unmovable");
      }
    }

    square.addEventListener("click", () => {
      if (piece) {
        // If a piece is clicked
        const valid = canMove(piece, row, col, emptyRow, emptyCol);
        if (valid) {
          board[emptyRow][emptyCol] = piece;
          board[row][col] = null;
          moveCount++;
          renderBoard(board);
        }
      }
    });

    boardDiv.appendChild(square);
  });

  checkWin();
}

function findEmpty() {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 2; c++) {
      if (!board[r][c]) return [r, c];
    }
  }
}

function canMove(piece, r, c, er, ec) {
  const dr = er - r;
  const dc = ec - c;

  // First, check if the move is a valid type for the piece.
  let isValidMoveType = false;
  switch (piece) {
    case "king":
      isValidMoveType = Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
      break;
    case "queen":
      isValidMoveType = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
      break;
    case "rook":
      isValidMoveType = dr === 0 || dc === 0;
      break;
    case "bishop":
      isValidMoveType = Math.abs(dr) === Math.abs(dc);
      break;
    case "knight":
      isValidMoveType =
        (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
        (Math.abs(dr) === 1 && Math.abs(dc) === 2);
      break;
  }

  if (!isValidMoveType) {
    return false;
  }

  // Knights and Kings don't need path checking.
  if (piece === "knight" || piece === "king") {
    return true;
  }

  // Now, check for path blocking for Rook, Bishop, and Queen.
  if (dr === 0) {
    // Horizontal movement
    const step = dc > 0 ? 1 : -1;
    for (let i = c + step; i !== ec; i += step) {
      if (board[r][i]) return false;
    }
  } else if (dc === 0) {
    // Vertical movement
    const step = dr > 0 ? 1 : -1;
    for (let i = r + step; i !== er; i += step) {
      if (board[i][c]) return false;
    }
  } else {
    // Diagonal movement
    const rStep = dr > 0 ? 1 : -1;
    const cStep = dc > 0 ? 1 : -1;
    let currR = r + rStep;
    let currC = c + cStep;
    while (currR !== er && currC !== ec) {
      if (board[currR][currC]) return false;
      currR += rStep;
      currC += cStep;
    }
  }

  return true;
}

function showOverlay(message) {
  const overlay = document.getElementById("overlay");
  document.getElementById("overlay-message").textContent = message;
  overlay.classList.remove("hidden");
}

function hideOverlay() {
  const overlay = document.getElementById("overlay");
  console.log(overlay);
  if (!overlay.classList.contains("hidden")) {
    overlay.classList.add("hidden");
  }
}

function checkWin() {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 2; c++) {
      if (board[r][c] === "king" && r === 0) {
        showOverlay(`You escaped in ${moveCount} moves!`);
        return;
      }
    }
  }
}

document.getElementById("try-again").addEventListener("click", () => {
  hideOverlay();
  board = initialBoard.map((row) => [...row]); // restore starting layout
  moveCount = 0;
  renderBoard(board);
});

document.getElementById("new-game").addEventListener("click", () => {
  hideOverlay();
  board = setupBoard(); // generate new board
  initialBoard = board.map((row) => [...row]); // save new initial layout
  moveCount = 0;
  renderBoard(board);
});

document.getElementById("toggle-highlights").addEventListener("click", () => {
  highlightsEnabled = !highlightsEnabled;
  renderBoard(board);
});

// Initial draw
hideOverlay();
renderBoard(board);
