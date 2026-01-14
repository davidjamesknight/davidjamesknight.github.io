// --- Constants & Symbols ---
const pieceSymbols = {
  king: "♔",
  queen: "♕",
  rook: "♖",
  bishop: "♗",
  knight: "♘",
};

// --- DOM Elements ---
const rulesOverlay = document.getElementById("rules-overlay");
const rulesToggle = document.getElementById("rules-toggle");
const closeRules = document.getElementById("close-rules");

// Sidebar Control Buttons
const startOverBtn = document.getElementById("start-over"); // ⟲
const newGameBtnSidebar = document.getElementById("new-game-btn"); // ⟳

// Modal Buttons (Win Screen)
const tryAgainBtn = document.getElementById("try-again");
const newGameBtnModal = document.getElementById("new-game");

const overlay = document.getElementById("overlay");
const overlayMessage = document.getElementById("overlay-message");

// --- Game State ---
let board = [];
let initialBoard = [];
let moveCount = 0;

/**
 * Generates a valid, solvable board layout.
 */
function setupBoard() {
  const piecesPool = [
    ...Array(2).fill("queen"),
    ...Array(4).fill("rook"),
    ...Array(4).fill("bishop"),
    ...Array(4).fill("knight"),
  ];

  let newBoard;
  let isUnsolvable;

  do {
    // Shuffle pieces
    const pieces = [...piecesPool].sort(() => Math.random() - 0.5);
    newBoard = Array.from({ length: 8 }, () => Array(2).fill(null));

    // King fixed at bottom-left, empty square at bottom-right
    newBoard[7][0] = "king";
    newBoard[7][1] = null;

    // Fill remaining 14 squares
    let idx = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 2; c++) {
        if (r === 7) continue;
        newBoard[r][c] = pieces[idx++];
      }
    }

    // Helper to check piece at coordinates
    const b = (r, c) => newBoard[r][c];

    // Check unsolvable configurations
    isUnsolvable =
      (b(6, 0) === "knight" && b(6, 1) === "knight") ||
      (b(6, 1) === "knight" && b(5, 0) === "bishop") ||
      (b(6, 0) === "knight" && b(5, 1) === "bishop") ||
      (b(6, 0) === "knight" && b(4, 1) === "knight" && b(3, 0) === "bishop") ||
      (b(6, 1) === "knight" && b(4, 0) === "knight" && b(3, 1) === "bishop") ||
      (b(6, 0) === "knight" &&
        b(4, 1) === "knight" &&
        b(2, 0) === "knight" &&
        b(1, 1) === "bishop") ||
      (b(6, 1) === "knight" &&
        b(4, 0) === "knight" &&
        b(2, 1) === "knight" &&
        b(1, 0) === "bishop") ||
      (b(6, 0) === "knight" &&
        b(4, 1) === "knight" &&
        b(2, 0) === "knight" &&
        b(0, 1) === "knight") ||
      (b(6, 1) === "knight" &&
        b(4, 0) === "knight" &&
        b(2, 1) === "knight" &&
        b(0, 0) === "knight");
  } while (isUnsolvable);

  return newBoard;
}

/**
 * Resets or Starts a new game.
 * @param {boolean} isNewBoard - If true, generates a completely new layout.
 */
function initGame(isNewBoard = true) {
  if (isNewBoard) {
    board = setupBoard();
    initialBoard = board.map((row) => [...row]);
  } else {
    board = initialBoard.map((row) => [...row]);
  }

  moveCount = 0;
  hideOverlay();
  renderBoard();
}

function renderBoard() {
  const [emptyRow, emptyCol] = findEmpty();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 2; c++) {
      const piece = board[r][c];
      const square = document.getElementById(`sq-${r}-${c}`);

      square.textContent = piece ? pieceSymbols[piece] : "";
      square.className = "square"; // Clear existing classes

      if (r === 0) square.classList.add("finish-line");
      if (piece === "king") square.classList.add("king");

      // Visual aid: highlight pieces that cannot currently move
      if (piece && !canMove(piece, r, c, emptyRow, emptyCol)) {
        square.classList.add("unmovable");
      }
    }
  }
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

  let valid = false;
  switch (piece) {
    case "king":
      valid = Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
      break;
    case "queen":
      valid = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
      break;
    case "rook":
      valid = dr === 0 || dc === 0;
      break;
    case "bishop":
      valid = Math.abs(dr) === Math.abs(dc);
      break;
    case "knight":
      valid =
        (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
        (Math.abs(dr) === 1 && Math.abs(dc) === 2);
      break;
  }

  if (!valid) return false;
  if (piece === "knight" || piece === "king") return true;

  // Path blocking check for sliding pieces
  const rStep = dr === 0 ? 0 : dr > 0 ? 1 : -1;
  const cStep = dc === 0 ? 0 : dc > 0 ? 1 : -1;
  let currR = r + rStep;
  let currC = c + cStep;

  while (currR !== er || currC !== ec) {
    if (board[currR][currC]) return false;
    currR += rStep;
    currC += cStep;
  }
  return true;
}

function checkWin() {
  if (board[0].includes("king")) {
    showOverlay(`You escaped in ${moveCount} moves!`);
  }
}

function showOverlay(msg) {
  overlayMessage.textContent = msg;
  overlay.classList.remove("hidden");
}

function hideOverlay() {
  overlay.classList.add("hidden");
}

// --- Event Listeners ---

// 1. Board Clicks
for (let r = 0; r < 8; r++) {
  for (let c = 0; c < 2; c++) {
    document.getElementById(`sq-${r}-${c}`).addEventListener("click", () => {
      const piece = board[r][c];
      const [er, ec] = findEmpty();
      if (piece && canMove(piece, r, c, er, ec)) {
        board[er][ec] = piece;
        board[r][c] = null;
        moveCount++;
        renderBoard();
      }
    });
  }
}

// 2. Sidebar/UI Controls
rulesToggle.addEventListener("click", () =>
  rulesOverlay.classList.remove("hidden")
);
closeRules.addEventListener("click", () =>
  rulesOverlay.classList.add("hidden")
);

startOverBtn.addEventListener("click", () => initGame(false)); // Reset current
newGameBtnSidebar.addEventListener("click", () => initGame(true)); // New layout

// 3. Win Screen Modal Controls
tryAgainBtn.addEventListener("click", () => initGame(false));
newGameBtnModal.addEventListener("click", () => initGame(true));

// --- Initialization ---
initGame(true); // Generate board
