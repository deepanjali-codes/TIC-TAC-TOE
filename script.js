 (() => {
    const boardEl = document.getElementById('board');
    const statusEl = document.getElementById('status');
    const restartBtn = document.getElementById('restart-btn');

    let board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ];
    let currentPlayer = "X";
    let gameOver = false;

    function createBoard() {
      boardEl.innerHTML = '';
      for(let r=0; r<3; r++) {
        for(let c=0; c<3; c++) {
          let cell = document.createElement('div');
          cell.classList.add('cell');
          cell.setAttribute('role', 'gridcell');
          cell.setAttribute('aria-rowindex', r + 1);
          cell.setAttribute('aria-colindex', c + 1);
          cell.setAttribute('tabindex', 0);
          cell.dataset.row = r;
          cell.dataset.col = c;
          cell.addEventListener('click', cellClickHandler);
          cell.addEventListener('keydown', cellKeyDownHandler);
          boardEl.appendChild(cell);
        }
      }
    }

    function cellClickHandler(e) {
      const cell = e.currentTarget;
      const r = parseInt(cell.dataset.row);
      const c = parseInt(cell.dataset.col);
      makeMove(r, c, cell);
    }

    // Support Enter and Space key to click cells for accessibility
    function cellKeyDownHandler(e) {
      if (gameOver) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.currentTarget.click();
      }
    }

    function makeMove(row, col, cellEl) {
      if (gameOver) return;
      if (board[row][col] !== "") {
        // Invalid move
        statusEl.textContent = `Cell already taken. Player ${currentPlayer}'s turn.`;
        return;
      }
      board[row][col] = currentPlayer;
      cellEl.textContent = currentPlayer;
      cellEl.classList.add('disabled');
      if (checkWinner()) {
        statusEl.textContent = `Player ${currentPlayer} wins! 🥳🎉`;
        gameOver = true;
        highlightWinningCells();
      } else if (isBoardFull()) {
        statusEl.textContent = `It's a draw! 🤝`;
        gameOver = true;
      } else {
        currentPlayer = (currentPlayer === "X" ? "O" : "X");
        statusEl.textContent = `Player ${currentPlayer}'s turn`;
      }
    }

    function checkWinner() {
      // Rows, columns and diagonals check
      for(let i=0; i<3; i++) {
        // check rows
        if (board[i][0] &&
            board[i][0] === board[i][1] &&
            board[i][1] === board[i][2]) {
          return [[i,0],[i,1],[i,2]];
        }
        // check columns
        if (board[0][i] &&
            board[0][i] === board[1][i] &&
            board[1][i] === board[2][i]) {
          return [[0,i],[1,i],[2,i]];
        }
      }
      // diagonals
      if (board[0][0] &&
          board[0][0] === board[1][1] &&
          board[1][1] === board[2][2]) {
        return [[0,0],[1,1],[2,2]];
      }
      if (board[0][2] &&
          board[0][2] === board[1][1] &&
          board[1][1] === board[2][0]) {
        return [[0,2],[1,1],[2,0]];
      }
      return null;
    }

    function highlightWinningCells() {
      const winningCells = checkWinner();
      if (!winningCells) return;
      winningCells.forEach(([r,c]) => {
        const index = r * 3 + c;
        boardEl.children[index].style.backgroundColor = 'rgba(255, 215, 0, 0.85)';
        boardEl.children[index].style.color = '#000';
        boardEl.children[index].classList.add('disabled');
      });
      // Disable further clicks
      for (let cell of boardEl.children) {
        cell.classList.add('disabled');
        cell.removeEventListener('click', cellClickHandler);
        cell.removeEventListener('keydown', cellKeyDownHandler);
      }
    }

    function isBoardFull() {
      return board.every(row => row.every(cell => cell !== ""));
    }

    function restartGame() {
      board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
      ];
      currentPlayer = "X";
      gameOver = false;
      statusEl.textContent = `Player ${currentPlayer}'s turn`;
      createBoard();
    }

    // Initialize
    createBoard();
    restartBtn.addEventListener('click', restartGame);

  })();
