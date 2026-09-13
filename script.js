const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const gameArea = document.getElementById("gameArea");

const gameTitle = document.getElementById("gameTitle");
const difficultyText = document.getElementById("difficultyText");
const scoreDisplay = document.getElementById("scoreDisplay");

const homeBtn = document.getElementById("homeBtn");
const backBtn = document.getElementById("backBtn");
const restartBtn = document.getElementById("restartBtn");

const messageBox = document.getElementById("messageBox");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const messageRestart = document.getElementById("messageRestart");
const messageHome = document.getElementById("messageHome");

let difficulty = "easy";
let currentGame = "";
let score = 0;


/* =========================
   DIFFICULTY
========================= */

document.querySelectorAll(".difficulty-btn").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".difficulty-btn")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    difficulty = button.dataset.level;

  });

});


/* =========================
   GAME SELECTION
========================= */

document.querySelectorAll(".game-card").forEach(card => {

  card.addEventListener("click", () => {

    currentGame = card.dataset.game;

    homeScreen.classList.remove("active");
    gameScreen.classList.add("active");

    gameTitle.textContent =
      card.querySelector("h3").textContent;

    difficultyText.textContent =
      difficulty.charAt(0).toUpperCase() +
      difficulty.slice(1);

    startSelectedGame();

  });

});


function startSelectedGame() {

  score = 0;
  updateScore();

  gameArea.innerHTML = "";

  if (currentGame === "sliding") startSliding();
  if (currentGame === "memory") startMemory();
  if (currentGame === "2048") start2048();
  if (currentGame === "sudoku") startSudoku();
  if (currentGame === "minesweeper") startMinesweeper();
  if (currentGame === "word") startWord();

}


/* =========================
   GENERAL
========================= */

function updateScore() {
  scoreDisplay.textContent = "Score: " + score;
}

function addScore(points) {
  score += points;
  updateScore();
}

function winGame(title, text) {

  messageTitle.textContent = title;
  messageText.textContent = text;

  messageBox.classList.remove("hidden");

}

function closeMessage() {
  messageBox.classList.add("hidden");
}

messageRestart.addEventListener("click", () => {
  closeMessage();
  startSelectedGame();
});

messageHome.addEventListener("click", () => {
  closeMessage();
  gameScreen.classList.remove("active");
  homeScreen.classList.add("active");
});

homeBtn.addEventListener("click", () => {

  closeMessage();

  gameScreen.classList.remove("active");
  homeScreen.classList.add("active");

});

backBtn.addEventListener("click", () => {

  gameScreen.classList.remove("active");
  homeScreen.classList.add("active");

});

restartBtn.addEventListener("click", () => {
  startSelectedGame();
});


/* =========================================================
   1. SLIDING PUZZLE
========================================================= */

function startSliding() {

  let size =
    difficulty === "easy" ? 3 :
    difficulty === "medium" ? 4 : 5;

  let board = [];

  for (let i = 1; i < size * size; i++) {
    board.push(i);
  }

  board.push(0);

  // Shuffle by legal moves
  for (let i = 0; i < size * size * 50; i++) {

    const empty = board.indexOf(0);
    const row = Math.floor(empty / size);
    const col = empty % size;

    const possible = [];

    if (row > 0) possible.push(empty - size);
    if (row < size - 1) possible.push(empty + size);
    if (col > 0) possible.push(empty - 1);
    if (col < size - 1) possible.push(empty + 1);

    const target =
      possible[Math.floor(Math.random() * possible.length)];

    [board[empty], board[target]] =
      [board[target], board[empty]];

  }

  const boardElement =
    document.createElement("div");

  boardElement.className = "sliding-board";

  boardElement.style.gridTemplateColumns =
    `repeat(${size}, 1fr)`;

  function render() {

    boardElement.innerHTML = "";

    board.forEach((value, index) => {

      const tile =
        document.createElement("button");

      tile.className =
        "slide-tile" + (value === 0 ? " empty" : "");

      tile.textContent =
        value === 0 ? "" : value;

      tile.addEventListener("click", () => {

        const empty = board.indexOf(0);

        const row = Math.floor(index / size);
        const col = index % size;

        const emptyRow = Math.floor(empty / size);
        const emptyCol = empty % size;

        if (
          Math.abs(row - emptyRow) +
          Math.abs(col - emptyCol) === 1
        ) {

          [board[index], board[empty]] =
            [board[empty], board[index]];

          addScore(1);
          render();
          checkWin();

        }

      });

      boardElement.appendChild(tile);

    });

  }

  function checkWin() {

    for (let i = 0; i < board.length - 1; i++) {

      if (board[i] !== i + 1) return;

    }

    winGame(
      "Puzzle Solved!",
      "Excellent! You arranged all the tiles correctly."
    );

  }

  gameArea.appendChild(boardElement);

  render();

}


/* =========================================================
   2. MEMORY MATCH
========================================================= */

function startMemory() {

  const pairs =
    difficulty === "easy" ? 6 :
    difficulty === "medium" ? 8 : 12;

  const symbols = [
    "🍎","🚀","⚽","🎯","🌟","🎵",
    "🐱","🔥","🌎","🎮","🍕","🦁"
  ];

  let cards =
    [...symbols.slice(0, pairs), ...symbols.slice(0, pairs)];

  cards.sort(() => Math.random() - 0.5);

  const board =
    document.createElement("div");

  board.className = "memory-board";

  const columns =
    pairs <= 6 ? 4 :
    pairs <= 8 ? 4 : 6;

  board.style.gridTemplateColumns =
    `repeat(${columns}, 1fr)`;

  let first = null;
  let second = null;
  let locked = false;
  let matched = 0;

  cards.forEach(symbol => {

    const card =
      document.createElement("button");

    card.className = "memory-card";
    card.textContent = "?";

    card.addEventListener("click", () => {

      if (
        locked ||
        card.classList.contains("matched") ||
        card === first
      ) return;

      card.textContent = symbol;
      card.classList.add("flipped");

      if (!first) {

        first = card;
        return;

      }

      second = card;
      locked = true;

      if (first.textContent === second.textContent) {

        first.classList.add("matched");
        second.classList.add("matched");

        matched++;
        addScore(10);

        first = null;
        second = null;
        locked = false;

        if (matched === pairs) {

          winGame(
            "Memory Complete!",
            "You found every matching pair."
          );

        }

      } else {

        setTimeout(() => {

          first.textContent = "?";
          second.textContent = "?";

          first.classList.remove("flipped");
          second.classList.remove("flipped");

          first = null;
          second = null;
          locked = false;

        }, 700);

      }

    });

    board.appendChild(card);

  });

  gameArea.appendChild(board);

}


/* =========================================================
   3. 2048
========================================================= */

function start2048() {

  let board = Array(16).fill(0);

  const element =
    document.createElement("div");

  element.className = "board-2048";

  function addTile() {

    const empty =
      board.map((v, i) => v === 0 ? i : -1)
      .filter(i => i !== -1);

    if (!empty.length) return;

    const index =
      empty[Math.floor(Math.random() * empty.length)];

    board[index] =
      Math.random() < 0.9 ? 2 : 4;

  }

  addTile();
  addTile();

  function draw() {

    element.innerHTML = "";

    board.forEach(value => {

      const tile =
        document.createElement("div");

      tile.className = "tile2048";
      tile.textContent = value || "";

      element.appendChild(tile);

    });

  }

  function slide(row) {

    row = row.filter(v => v !== 0);

    for (let i = 0; i < row.length - 1; i++) {

      if (row[i] === row[i + 1]) {

        row[i] *= 2;
        addScore(row[i]);
        row.splice(i + 1, 1);

      }

    }

    while (row.length < 4) {
      row.push(0);
    }

    return row;

  }

  function move(direction) {

    let changed = false;

    if (
      direction === "left" ||
      direction === "right"
    ) {

      for (let r = 0; r < 4; r++) {

        let row =
          board.slice(r * 4, r * 4 + 4);

        const original = [...row];

        if (direction === "right") {
          row.reverse();
        }

        row = slide(row);

        if (direction === "right") {
          row.reverse();
        }

        for (let c = 0; c < 4; c++) {
          board[r * 4 + c] = row[c];
        }

        if (original.join() !== row.join()) {
          changed = true;
        }

      }

    } else {

      for (let c = 0; c < 4; c++) {

        let line = [];

        for (let r = 0; r < 4; r++) {
          line.push(board[r * 4 + c]);
        }

        const original = [...line];

        if (direction === "down") {
          line.reverse();
        }

        line = slide(line);

        if (direction === "down") {
          line.reverse();
        }

        for (let r = 0; r < 4; r++) {
          board[r * 4 + c] = line[r];
        }

        if (original.join() !== line.join()) {
          changed = true;
        }

      }

    }

    if (changed) {

      addTile();
      draw();

      if (board.includes(2048)) {

        winGame(
          "2048!",
          "You reached the legendary 2048 tile!"
        );

      }

    }

  }

  function keyHandler(event) {

    const map = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
      w: "up",
      a: "left",
      s: "down",
      d: "right"
    };

    if (map[event.key]) {

      event.preventDefault();
      move(map[event.key]);

    }

  }

  window.addEventListener("keydown", keyHandler);

  gameArea.appendChild(element);

  draw();

}


/* =========================================================
   4. SUDOKU
========================================================= */

function startSudoku() {

  const board =
    document.createElement("div");

  board.className = "sudoku-board";

  const solution = generateSudoku();

  const removeCount =
    difficulty === "easy" ? 35 :
    difficulty === "medium" ? 45 : 52;

  const puzzle = [...solution];

  let removed = 0;

  while (removed < removeCount) {

    const index =
      Math.floor(Math.random() * 81);

    if (puzzle[index] !== 0) {

      puzzle[index] = 0;
      removed++;

    }

  }

  puzzle.forEach((value, index) => {

    const cell =
      document.createElement("input");

    cell.className = "sudoku-cell";
    cell.type = "text";
    cell.maxLength = 1;

    if (value !== 0) {

      cell.value = value;
      cell.disabled = true;
      cell.classList.add("fixed");

    }

    cell.addEventListener("input", () => {

      cell.value =
        cell.value.replace(/[^1-9]/g, "");

      checkSudoku();

    });

    board.appendChild(cell);

  });

  gameArea.appendChild(board);

  function checkSudoku() {

    const cells =
      [...board.querySelectorAll("input")];

    for (let i = 0; i < 81; i++) {

      if (
        Number(cells[i].value) !==
        solution[i]
      ) return;

    }

    winGame(
      "Sudoku Complete!",
      "Perfect! You solved the Sudoku."
    );

  }

}


function generateSudoku() {

  const grid = Array(81).fill(0);

  function solve(pos) {

    if (pos === 81) return true;

    if (grid[pos] !== 0) {
      return solve(pos + 1);
    }

    const nums =
      [1,2,3,4,5,6,7,8,9]
      .sort(() => Math.random() - .5);

    const row = Math.floor(pos / 9);
    const col = pos % 9;

    for (const n of nums) {

      let valid = true;

      for (let c = 0; c < 9; c++) {
        if (grid[row * 9 + c] === n) {
          valid = false;
        }
      }

      for (let r = 0; r < 9; r++) {
        if (grid[r * 9 + col] === n) {
          valid = false;
        }
      }

      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;

      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {

          if (grid[r * 9 + c] === n) {
            valid = false;
          }

        }
      }

      if (valid) {

        grid[pos] = n;

        if (solve(pos + 1)) {
          return true;
        }

        grid[pos] = 0;

      }

    }

    return false;

  }

  solve(0);

  return grid;

}


/* =========================================================
   5. MINESWEEPER
========================================================= */

function startMinesweeper() {

  const size =
    difficulty === "easy" ? 8 :
    difficulty === "medium" ? 12 : 16;

  const mines =
    difficulty === "easy" ? 10 :
    difficulty === "medium" ? 25 : 45;

  const board =
    document.createElement("div");

  board.className = "mine-board";

  board.style.gridTemplateColumns =
    `repeat(${size}, 1fr)`;

  const cells = [];

  for (let i = 0; i < size * size; i++) {

    const cell =
      document.createElement("button");

    cell.className = "mine-cell";

    cells.push({
      element: cell,
      mine: false,
      revealed: false
    });

    board.appendChild(cell);

  }

  let placed = 0;

  while (placed < mines) {

    const index =
      Math.floor(Math.random() * cells.length);

    if (!cells[index].mine) {

      cells[index].mine = true;
      placed++;

    }

  }

  function neighbours(index) {

    const result = [];

    const row = Math.floor(index / size);
    const col = index % size;

    for (let dr = -1; dr <= 1; dr++) {

      for (let dc = -1; dc <= 1; dc++) {

        if (dr === 0 && dc === 0) continue;

        const r = row + dr;
        const c = col + dc;

        if (
          r >= 0 &&
          r < size &&
          c >= 0 &&
          c < size
        ) {

          result.push(r * size + c);

        }

      }

    }

    return result;

  }

  function mineCount(index) {

    return neighbours(index)
      .filter(i => cells[i].mine)
      .length;

  }

  function reveal(index) {

    const cell = cells[index];

    if (
      cell.revealed
    ) return;

    cell.revealed = true;
    cell.element.classList.add("revealed");

    if (cell.mine) {

      cell.element.textContent = "💣";
      cell.element.classList.add("mine");

      cells.forEach(c => {

        if (c.mine) {
          c.element.textContent = "💣";
          c.element.classList.add("mine");
        }

      });

      setTimeout(() => {

        winGame(
          "Mine Hit!",
          "You found a mine. Try again!"
        );

      }, 150);

      return;

    }

    const count = mineCount(index);

    cell.element.textContent =
      count === 0 ? "" : count;

    addScore(1);

    if (count === 0) {

      neighbours(index).forEach(reveal);

    }

    checkMinesweeperWin();

  }

  function checkMinesweeperWin() {

    const safe =
      cells.filter(c => !c.mine);

    const revealed =
      safe.filter(c => c.revealed);

    if (revealed.length === safe.length) {

      winGame(
        "Board Cleared!",
        "You cleared the Minesweeper board!"
      );

    }

  }

  cells.forEach((cell, index) => {

    cell.element.addEventListener("click", () => {
      reveal(index);
    });

    cell.element.addEventListener("contextmenu", event => {

      event.preventDefault();

      if (!cell.revealed) {

        cell.element.textContent =
          cell.element.textContent === "🚩"
            ? ""
            : "🚩";

      }

    });

  });

  gameArea.appendChild(board);

}


/* =========================================================
   6. WORD SCRAMBLE
========================================================= */

function startWord() {

  const words = [
    "planet",
    "computer",
    "puzzle",
    "keyboard",
    "football",
    "science",
    "galaxy",
    "history",
    "mountain",
    "diamond",
    "library",
    "adventure",
    "technology",
    "elephant",
    "rainbow"
  ];

  let currentWord =
    words[Math.floor(Math.random() * words.length)];

  function scramble(word) {

    let letters = word.split("");

    do {

      letters.sort(() => Math.random() - .5);

    } while (letters.join("") === word);

    return letters.join("");

  }

  const wrapper =
    document.createElement("div");

  wrapper.className = "word-game";

  const heading =
    document.createElement("h2");

  heading.textContent =
    "Unscramble the word";

  const scrambled =
    document.createElement("div");

  scrambled.className = "scrambled-word";

  scrambled.textContent =
    scramble(currentWord).toUpperCase();

  const input =
    document.createElement("input");

  input.className = "word-input";
  input.placeholder = "Type your answer";

  const submit =
    document.createElement("button");

  submit.className = "word-submit";
  submit.textContent = "CHECK";

  const info =
    document.createElement("p");

  info.style.marginTop = "18px";
  info.style.color = "#aeb9d5";

  wrapper.appendChild(heading);
  wrapper.appendChild(scrambled);
  wrapper.appendChild(input);
  wrapper.appendChild(submit);
  wrapper.appendChild(info);

  gameArea.appendChild(wrapper);

  function check() {

    const answer =
      input.value.trim().toLowerCase();

    if (answer === currentWord) {

      addScore(25);

      winGame(
        "Correct!",
        `The word was "${currentWord.toUpperCase()}".`
      );

    } else {

      info.textContent =
        "Not quite. Try again!";

    }

  }

  submit.addEventListener("click", check);

  input.addEventListener("keydown", event => {

    if (event.key === "Enter") {
      check();
    }

  });

}
