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
let currentDraggedPiece = null;
let currentDraggedFromRow = null;
let currentDraggedFromCol = null;
let touchedPiece = null;

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

    if (piece) {
      square.draggable = true;

      // Highlight when mouse is pressed
      square.addEventListener("mousedown", () => {
        clearHighlights();
        const valid = canMove(piece, row, col, emptyRow, emptyCol);
        const emptyIndex = emptyRow * 2 + emptyCol;
        const emptySquare = boardDiv.children[emptyIndex];
        emptySquare.classList.add(valid ? "green" : "red");
      });

      // Start drag
      square.addEventListener("dragstart", (e) => {
        const valid = canMove(piece, row, col, emptyRow, emptyCol);
        if (!valid) {
          e.preventDefault();
        } else {
          e.dataTransfer.setData("text/plain", `${row},${col}`);
        }
      });

      // Clear highlight when mouse released
      square.addEventListener("mouseup", () => {
        clearHighlights();
      });

      square.addEventListener("dragend", () => {
        clearHighlights();
      });

      // Touch event listeners for mobile devices
      square.addEventListener("touchstart", (e) => {
        e.preventDefault(); // Prevent default mobile behaviors like scrolling
        clearHighlights();
        const valid = canMove(piece, row, col, emptyRow, emptyCol);
        if (valid) {
          const emptyIndex = emptyRow * 2 + emptyCol;
          const emptySquare = boardDiv.children[emptyIndex];
          emptySquare.classList.add("green");
          touchedPiece = { piece, row, col };
        } else {
          const emptyIndex = emptyRow * 2 + emptyCol;
          const emptySquare = boardDiv.children[emptyIndex];
          emptySquare.classList.add("red");
        }
      });

      square.addEventListener("touchend", () => {
        clearHighlights();
        touchedPiece = null;
      });
    }

    if (!piece) {
      square.addEventListener("dragover", (e) => e.preventDefault());
      square.addEventListener("drop", (e) => {
        e.preventDefault();
        const [fromRow, fromCol] = e.dataTransfer
          .getData("text/plain")
          .split(",")
          .map(Number);
        const movingPiece = board[fromRow][fromCol];
        if (canMove(movingPiece, fromRow, fromCol, row, col)) {
          board[row][col] = movingPiece;
          board[fromRow][fromCol] = null;
          renderBoard(board);
        }
      });

      // Touch event listener for drop
      square.addEventListener("touchend", (e) => {
        e.preventDefault();
        if (touchedPiece) {
          const {
            piece: movingPiece,
            row: fromRow,
            col: fromCol,
          } = touchedPiece;
          if (canMove(movingPiece, fromRow, fromCol, row, col)) {
            board[row][col] = movingPiece;
            board[fromRow][fromCol] = null;
            renderBoard(board);
            touchedPiece = null; // Clear the tracked piece after a successful move
          }
        }
      });
    }

    boardDiv.appendChild(square);
  });

  checkWin();
}

function clearHighlights() {
  document.querySelectorAll(".square").forEach((sq) => {
    sq.classList.remove("red", "green");
  });
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

  switch (piece) {
    case "king":
      return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
    case "queen":
      return dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
    case "rook":
      return dr === 0 || dc === 0;
    case "bishop":
      return Math.abs(dr) === Math.abs(dc);
    case "knight":
      return (
        (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
        (Math.abs(dr) === 1 && Math.abs(dc) === 2)
      );
  }
  return false;
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
        showOverlay("You win! The King escaped!");
        return;
      }
    }
  }
}

document.getElementById("try-again").addEventListener("click", () => {
  hideOverlay();
  board = initialBoard.map((row) => [...row]); // restore starting layout
  renderBoard(board);
});

document.getElementById("new-game").addEventListener("click", () => {
  hideOverlay();
  board = setupBoard(); // generate new board
  initialBoard = board.map((row) => [...row]); // save new initial layout
  renderBoard(board);
});

// Initial draw
hideOverlay();
renderBoard(board);
