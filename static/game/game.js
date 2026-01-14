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
const rulesGotItBtn = document.getElementById("rules-got-it-btn");

const startOverBtn = document.getElementById("start-over");
const newGameBtnSidebar = document.getElementById("new-game-btn");

const tryAgainBtn = document.getElementById("try-again");
const newGameBtnModal = document.getElementById("new-game");

const finishOverlay = document.getElementById("finish-overlay");
const overlayMessage = document.getElementById("overlay-message");

let board = [];
let initialBoard = [];
let moveCount = 0;

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
    const pieces = [...piecesPool].sort(() => Math.random() - 0.5);
    newBoard = Array.from({ length: 8 }, () => Array(2).fill(null));
    newBoard[7][0] = "king";
    newBoard[7][1] = null;

    let idx = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 2; c++) {
        if (r === 7) continue;
        newBoard[r][c] = pieces[idx++];
      }
    }

    const b = (r, c) => newBoard[r][c];
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

function initGame(isNewBoard = true) {
  if (isNewBoard) {
    board = setupBoard();
    initialBoard = board.map((row) => [...row]);
  } else {
    board = initialBoard.map((row) => [...row]);
  }
  moveCount = 0;
  finishOverlay.classList.add("hidden");
  renderBoard();
}

function renderBoard() {
  const [er, ec] = findEmpty();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 2; c++) {
      const piece = board[r][c];
      const square = document.getElementById(`sq-${r}-${c}`);
      square.textContent = piece ? pieceSymbols[piece] : "";
      square.className = "square";
      if (piece === "king") square.classList.add("king");
      if (piece && !canMove(piece, r, c, er, ec))
        square.classList.add("unmovable");
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
  const rStep = dr === 0 ? 0 : dr > 0 ? 1 : -1;
  const cStep = dc === 0 ? 0 : dc > 0 ? 1 : -1;
  let currR = r + rStep,
    currC = c + cStep;
  while (currR !== er || currC !== ec) {
    if (board[currR][currC]) return false;
    currR += rStep;
    currC += cStep;
  }
  return true;
}

function checkWin() {
  if (board[0].includes("king")) {
    overlayMessage.textContent = `You escaped in ${moveCount} moves!`;
    finishOverlay.classList.remove("hidden");
  }
}

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

const closeRulesModal = () => rulesOverlay.classList.add("hidden");
rulesToggle.addEventListener("click", () =>
  rulesOverlay.classList.remove("hidden")
);
closeRules.addEventListener("click", closeRulesModal);
rulesGotItBtn.addEventListener("click", closeRulesModal);
rulesOverlay.addEventListener("click", (e) => {
  if (e.target === rulesOverlay) closeRulesModal();
});

startOverBtn.addEventListener("click", () => initGame(false));
newGameBtnSidebar.addEventListener("click", () => initGame(true));
tryAgainBtn.addEventListener("click", () => initGame(false));
newGameBtnModal.addEventListener("click", () => initGame(true));

initGame(true);
