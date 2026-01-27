function makeBoard(nDims) {
  const dims = nDims;
  let freeFields;
  let board;

  function newBoard() {
    board = new Array(dims ** 2).fill(0);
    freeFields = dims ** 2;
  }

  function getValues() {
    return board;
  }

  function getRow(row) {
    const startIdx = row * dims;
    return board.slice(startIdx, startIdx + dims);
  }

  function getCol(col) {
    const out = [];
    for (let i = 0; i < dims; i++) {
      out.push(board[i * dims + col]);
    }
    return out;
  }

  function getDiag(centre, anti) {
    const row = Math.floor(centre / dims);
    const col = centre % dims;

    const out = [];
    for (let i = 0; i < dims; i++) {
      const offset = i - row;
      let j = col + (anti ? -offset : offset);
      if (j < 0 || j >= dims) continue;
      const r = getRow(i);
      out.push(r[j]);
    }
    return out;
  }

  function setField(value, idx) {
    board[idx] = value;
    freeFields--;
  }

  function isFull(r, c) {
    return freeFields === 0;
  }
  return {
    dims,
    newBoard,
    getValues,
    getRow,
    getCol,
    getDiag,
    setField,
    isFull,
  };
}

function makePlayer() {
  let score = 0;

  function getScore() {
    return score;
  }
  function addScore() {
    score++;
  }
  return { getScore, addScore };
}

function makeRenderer(doc, turn) {
  const dialog = doc.getElementById("result");

  function init(dims, moveHandler) {
    const boardElem = doc.getElementById("board");
    board.style.gridTemplateColumns = `repeat(${dims}, min-content)`;

    const playerElems = doc.querySelectorAll(".player");
    playerElems[turn].classList.add("active");
    playerElems[1 - turn].classList.remove("active");
    dialog.close();
    boardElem.innerHTML = "";
    for (let i = 0; i < dims ** 2; i++) {
      const field = doc.createElement("DIV");
      field.setAttribute("data-id", i);
      field.addEventListener("click", moveHandler, { once: true });
      boardElem.appendChild(field);
    }
  }

  function renderMove(val, idx) {
    doc.querySelectorAll("#board > div")[idx].innerHTML = val === 1 ? "X" : "O";
  }

  function updateScores(scores) {
    doc
      .querySelectorAll(".score-value")
      .forEach((el, i) => (el.innerHTML = scores[i]));
  }

  function togglePlayer() {
    doc
      .querySelectorAll(".player")
      .forEach((p) => p.classList.toggle("active"));
  }

  function gameOver(msg, scores) {
    const boardElem = doc.getElementById("board");
    console.log("Game over: " + msg);
    dialog.querySelector("#message").innerHTML = "Game over: " + msg;
    dialog.showModal();
    const clone = boardElem.cloneNode(true);
    boardElem.parentNode.replaceChild(clone, boardElem);
    updateScores(scores);
  }

  return { init, renderMove, updateScores, togglePlayer, gameOver };
}

const game = (function (doc) {
  let dims;
  let nToWin;
  let board;
  let renderer;
  const players = [0, 1].map((i) => makePlayer());
  let moves = [];
  let moveNumber;
  let turn = 0;
  let startingPlayer;

  doc
    .querySelector("#result button")
    .addEventListener("click", () => newGame(dims));

  doc.querySelector("input#dims").addEventListener("change", (e) => {
    let value = Math.floor(Number(e.target.value));
    if (value < 3) {
      value = 3;
    } else if (value > 10) {
      value = 10;
    }

    e.target.value = value;
    newGame(value);
  });

  function newGame(nDims) {
    dims = nDims;
    nToWin = Math.min(dims, 5);
    board = makeBoard(dims);
    renderer = makeRenderer(doc, turn);
    board.newBoard();
    moveNumber = 0;
    startingPlayer = turn;

    doc.querySelector("#n-to-win").innerHTML = nToWin;
    renderer.init(dims, move);
  }

  function move(e) {
    if (turn === 0) moveNumber++;
    const idx = Number(e.target.dataset.id);
    moves.push(idx);
    board.setField(turn + 1, idx);
    renderer.renderMove(turn + 1, idx);
    const finished = checkBoard(board);
    let msg = "It's a draw!";
    if (finished) {
      msg = `Player ${turn + 1} won!`;
      players[turn].addScore();
    }
    if (finished || board.isFull()) {
      renderer.gameOver(
        msg,
        players.map((p) => p.getScore()),
      );
      if (!finished) turn = 1 - startingPlayer;
      return;
    }
    renderer.togglePlayer();
    turn = (turn + 1) % 2;
  }

  const winCondition = (arr) => {
    let nInARow = 0;
    for (let el of arr) {
      if (el === turn + 1) {
        nInARow++;
      } else {
        nInARow = 0;
      }
      if (nInARow === nToWin) return true;
    }
    return false;
  };

  function checkBoard(board) {
    const lastMove = moves.at(-1);
    const arrsToCheck = [
      board.getRow(Math.floor(lastMove / dims)),
      board.getCol(lastMove % dims),
      board.getDiag(lastMove, false),
      board.getDiag(lastMove, true),
    ];
    for (let arr of arrsToCheck) if (winCondition(arr)) return true;

    return false;
  }
  return { newGame };
})(document);

game.newGame(Number(document.querySelector("#ctrl input").value));
