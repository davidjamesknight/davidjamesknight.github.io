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
    ...Array(2).fill("queen"),
    ...Array(4).fill("rook"),
    ...Array(4).fill("bishop"),
    ...Array(4).fill("knight"),
  ];

  let board;
  let bannedPlacement0;
  let bannedPlacement1;
  let bannedPlacement2;
  let bannedPlacement3;
  let bannedPlacement4;
  let bannedPlacement5;
  let bannedPlacement6;
  let bannedPlacement7;
  let bannedPlacement8;

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

    // Check for placements that make the puzzle unsolvable

    bannedPlacement0 = board[6][0] === "knight" && board[6][1] === "knight";
    bannedPlacement1 = board[6][1] === "knight" && board[5][0] === "bishop";
    bannedPlacement2 = board[6][0] === "knight" && board[5][1] === "bishop";
    bannedPlacement3 =
      board[6][0] === "knight" &&
      board[4][1] === "knight" &&
      board[3][0] === "bishop";
    bannedPlacement4 =
      board[6][1] === "knight" &&
      board[4][0] === "knight" &&
      board[3][1] === "bishop";
    bannedPlacement5 =
      board[6][0] === "knight" &&
      board[4][1] === "knight" &&
      board[2][0] === "knight" &&
      board[1][1] === "bishop";
    bannedPlacement6 =
      board[6][1] === "knight" &&
      board[4][0] === "knight" &&
      board[2][1] === "knight" &&
      board[1][0] === "bishop";
    bannedPlacement7 =
      board[6][0] === "knight" &&
      board[4][1] === "knight" &&
      board[2][0] === "knight" &&
      board[0][1] === "knight";
    bannedPlacement8 =
      board[6][1] === "knight" &&
      board[4][0] === "knight" &&
      board[2][1] === "knight" &&
      board[0][0] === "knight";

    // Keep regenerating the board until all rules are satisfied
  } while (
    bannedPlacement0 ||
    bannedPlacement1 ||
    bannedPlacement2 ||
    bannedPlacement3 ||
    bannedPlacement4 ||
    bannedPlacement5 ||
    bannedPlacement6 ||
    bannedPlacement7 ||
    bannedPlacement8
  );

  return board;
}

// These variables must be outside the setupBoard function
let board = setupBoard();
let initialBoard = board.map((row) => [...row]); // deep copy for Try Again
let moveCount = 0;

function renderBoard(board) {
  const [emptyRow, emptyCol] = findEmpty();

  // Iterate over the board data and update the corresponding HTML elements
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 2; c++) {
      const piece = board[r][c];
      const square = document.getElementById(`sq-${r}-${c}`);
      square.textContent = piece ? pieceSymbols[piece] : "";

      // Reset classes
      square.className = "square";
      if (r === 0) square.classList.add("finish-line");
      if (piece === "king") square.classList.add("king");

      // Apply unmovable highlights
      if (piece) {
        const valid = canMove(piece, r, c, emptyRow, emptyCol);
        if (!valid) {
          square.classList.add("unmovable");
        }
      }
    }
  }

  checkWin();
}

// Event listeners for each square (attached once)
function setupEventListeners() {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 2; c++) {
      const square = document.getElementById(`sq-${r}-${c}`);
      square.addEventListener("click", () => {
        const piece = board[r][c];
        if (piece) {
          const [emptyRow, emptyCol] = findEmpty();
          const valid = canMove(piece, r, c, emptyRow, emptyCol);
          if (valid) {
            board[emptyRow][emptyCol] = piece;
            board[r][c] = null;
            moveCount++;
            renderBoard(board);
          }
        }
      });
    }
  }
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

// Initial draw
hideOverlay();
setupEventListeners(); // Call this once to set up listeners
renderBoard(board);
