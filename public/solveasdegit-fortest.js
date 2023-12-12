
function i2rc(index) {
    return { row: Math.floor(index / 9), col: index % 9 };
}

function rc2i(row, col) {
    return row * 9 + col;
}

function unique(board, index, value) {
    let { row, col } = i2rc(index);
    let r1 = Math.floor(row / 3) * 3;
    let c1 = Math.floor(col / 3) * 3;
    for (let r = r1; r < r1 + 3; ++r) {
        for (let c = c1; c < c1 + 3; ++c) {
            let i = rc2i(r, c);
            if (i != index && !board[i] && acceptable(board, i, value)) {
                return false;
            }
        }
    }
    return true;
}

function acceptable(board, index, value) {
    let { row, col } = i2rc(index);
    for (let i = 0; i < 9; ++i) {
        if (board[rc2i(i, col)] == value || board[rc2i(row, i)] == value)
            return false;
    }
    let r1 = Math.floor(row / 3) * 3;
    let c1 = Math.floor(col / 3) * 3;
    for (let r = r1; r < r1 + 3; ++r) {
        for (let c = c1; c < c1 + 3; ++c) {
            if (board[rc2i(r, c)] == value) return false;
        }
    }
    return true;
}

function log(el, txt) {
    let out = el.querySelector(".js-console");
    if (out)
        out.textContent = txt;
}

export class Sudoku {
    constructor(container, { controls = true } = {}) {
        this.container = container;
        this.init(controls);

        if (controls) {
            container.querySelector(".js-examples-select").addEventListener("change", ev => {
                this.writeBoard(ev.target.value.split(",").map(parseFloat), true);
            });
            container.querySelector(".js-examples-select").addEventListener("click", ev => {
                this.writeBoard(ev.target.value.split(",").map(parseFloat), true);
            });
            container.querySelector(".js-solve").addEventListener("click", ev => this.solve());
            container.querySelector(".js-reset").addEventListener("click", ev => this.reset());
            container.querySelector(".js-clear").addEventListener("click", ev => this.clearBoard());
        }
    }

    init(controls = true) {
        let container = this.container;
        let html = `\
  <div class="sudoku">
    <div class="sudoku-board">
      ${[...Array(81).keys()].map(i => {
            let { row, col } = i2rc(i);
            return `<input class="js-field" maxlength="1" type="text" data-index="${i}" data-row="${row}" data-col="${col}" />`;
        }).join("")}
    </div>
    <div class="controls">
    ${!controls ? '' : `
        <select class="js-examples-select">
          <option selected disabled hidden>Examples</option>
          ${examples.map(example => `
              <option value="${example.slice(1).join(",")}">${example[0]}</option>
            `).join("")}
        </select>
        <button class="js-solve">Solve!</button>
        <button class="js-reset">Reset</button>
        <button class="js-clear">Clear</button>`}
      <div class="stats js-console"></div>
    </div>
  </div>`;
        container.innerHTML = html;
        let fields = container.querySelectorAll("input.js-field");
        fields.forEach(input => {
            input.addEventListener("input", ev => {
                let input = ev.target;
                input.classList.toggle("init", input.value);
            });
            input.addEventListener("click", ev => {
                input.focus();
                input.select();
            });
        });
    }

    readBoard() {
        return [...this.container.querySelectorAll("input.js-field")]
            .map(el => el.value ? parseInt(el.value, 10) : 0);
    }

    writeBoard(values, init = false) {
        let el = this.container;
        [...el.querySelectorAll("input.js-field")].forEach((el, i) => {
            el.value = values[i] || "";
            if (init) {
                el.classList.toggle("init", values[i]);
            }
        });
        if (init) {
            this._initBoard = values;
            this._reset();
        }
    }

    clearBoard() {
        let el = this.container;
        [...el.querySelectorAll("input.js-field")].forEach(el => {
            el.value = "";
            el.classList.remove("init");
        });
        this._reset();
    }

    reset() {
        this.writeBoard(this._initBoard || [], true);
    }

    _reset() {
        let el = this.container;
        el.classList.remove("solved", "playing", "paused");
        log(el, "");
    }

    bestBet(board) {
        let bestIndex, bestLen = 100, bestMoves;
        for (let index = 0; index < board.length; ++index) {
            if (!board[index]) {
                let count = 0, moves = 0;
                for (let value = 1, m = 1; value <= 9; ++value, m <<= 1) {
                    if (acceptable(board, index, value)) {
                        if (unique(board, index, value)) {
                            moves = m;
                            count = 1;
                            break;
                        } else {
                            moves |= m;
                            count++;
                        }
                    }
                }
                if (count < bestLen) {
                    bestLen = count;
                    bestMoves = moves;
                    bestIndex = index;
                    if (!bestLen) break;
                }
            }
        }
        if (bestIndex != null) board[bestIndex] = bestMoves;
        return bestIndex;
    }

    solve() {
        let self = this;
        let el = self.container;
        let board = self.readBoard();
        let backtrack = 0;
        let time = Date.now();
        if (solve()) {
            self.writeBoard(board);
            el.classList.add("solved");
        } else {
            alert("no solution");
        }
        log(el, backtrack + " take-backs, " + (Date.now() - time) + " ms");
        function solve() {
            let index = self.bestBet(board);
            if (index == null) return true;
            let moves = board[index];
            for (let m = 1; moves; ++m, moves >>= 1) {
                if (moves & 1) {
                    board[index] = m;
                    if (solve()) return true;
                }
            }
            board[index] = 0;
            ++backtrack;
            return false;
        }
    }
}

export const examples = [
    ["Medium 1",
        0, 0, 0, 0, 0, 0, 0, 0, 6,
        0, 3, 0, 0, 7, 1, 0, 4, 0,
        0, 0, 0, 0, 0, 0, 8, 0, 0,

        0, 0, 0, 9, 0, 8, 0, 7, 1,
        1, 0, 3, 0, 0, 0, 0, 0, 0,
        0, 0, 2, 0, 3, 0, 9, 0, 0,

        5, 0, 7, 0, 0, 6, 0, 0, 0,
        2, 0, 0, 0, 0, 0, 7, 0, 0,
        0, 0, 1, 8, 0, 0, 0, 0, 2,
    ],
    ["Medium 2",
        0, 0, 0, 0, 1, 7, 2, 0, 0,
        0, 0, 0, 4, 0, 0, 0, 0, 0,
        0, 0, 9, 0, 0, 3, 0, 0, 0,

        4, 0, 0, 7, 8, 0, 5, 0, 0,
        0, 2, 5, 0, 0, 0, 8, 0, 0,
        0, 0, 0, 6, 0, 0, 0, 0, 0,

        6, 0, 1, 5, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 6, 0, 3, 0,
        2, 0, 0, 0, 0, 1, 7, 0, 4,
    ],
    ["Medium 3",
        1, 0, 5, 0, 0, 2, 0, 8, 4, 0, 0, 6,
        3, 0, 1, 2, 0, 7, 0, 2, 0, 0, 5, 0,
        0, 0, 0, 0, 9, 0, 0, 1, 0, 0, 0, 0,
        8, 0, 2, 0, 3, 6, 7, 4, 0, 3, 0, 7,
        0, 2, 0, 0, 9, 0, 4, 7, 0, 0, 0, 8,
        0, 0, 1, 0, 0, 1, 6, 0, 0, 0, 0, 9,
        2, 6, 9, 1, 4, 0, 3, 7, 0
    ],
    ["Medium 4",
        0, 0, 0, 0, 3, 0, 5, 7, 0,
        0, 0, 2, 0, 0, 8, 0, 0, 0,
        6, 0, 0, 0, 0, 0, 0, 0, 0,

        0, 3, 0, 5, 7, 0, 0, 4, 0,
        0, 0, 0, 4, 0, 0, 0, 0, 2,
        0, 0, 5, 6, 0, 0, 7, 1, 8,

        0, 7, 8, 0, 0, 0, 0, 0, 0,
        0, 0, 6, 7, 0, 9, 0, 0, 1,
        0, 0, 0, 0, 0, 0, 0, 2, 0,
    ],
    ["Hard",
        8, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 3, 6, 0, 0, 0, 0, 0,
        0, 7, 0, 0, 9, 0, 2, 0, 0,

        0, 5, 0, 0, 0, 7, 0, 0, 0,
        0, 0, 0, 0, 4, 5, 7, 0, 0,
        0, 0, 0, 1, 0, 0, 0, 3, 0,

        0, 0, 1, 0, 0, 0, 0, 6, 8,
        0, 0, 8, 5, 0, 0, 0, 1, 0,
        0, 9, 0, 0, 0, 0, 4, 0, 0,
    ],
    ["Really Hardâ„¢",
        0, 0, 0, 8, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 4, 3,
        5, 0, 0, 0, 0, 0, 0, 0, 0,

        0, 0, 0, 0, 7, 0, 8, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 0,
        0, 2, 0, 0, 3, 0, 0, 0, 0,

        6, 0, 0, 0, 0, 0, 0, 7, 5,
        0, 0, 3, 4, 0, 0, 0, 0, 0,
        0, 0, 0, 2, 0, 0, 6, 0, 0,
    ],
    // [ "tmp1",
    //   0, 9, 0,  0, 0, 0,  7, 0, 0,
    //   0, 0, 0,  0, 0, 7,  5, 2, 0,
    //   0, 0, 3,  0, 0, 0,  0, 0, 0,

    //   0, 0, 0,  0, 4, 0,  0, 0, 0,
    //   5, 2, 0,  0, 0, 0,  0, 0, 0,
    //   0, 0, 0,  8, 3, 0,  0, 0, 1,

    //   0, 0, 8,  0, 0, 0,  0, 0, 3,
    //   0, 0, 0,  0, 1, 0,  0, 0, 0,
    //   0, 7, 0,  0, 0, 5,  0, 0, 0,
    // ],
    // [ "tmp2",
    //   0, 0, 0,  0, 0, 0,  0, 0, 0,
    //   0, 0, 0,  0, 0, 0,  0, 0, 0,
    //   0, 0, 0,  0, 0, 0,  0, 0, 0,

    //   0, 0, 0,  0, 0, 0,  0, 0, 0,
    //   0, 0, 0,  0, 0, 0,  0, 0, 0,
    //   0, 0, 0,  0, 0, 0,  0, 0, 0,

    //   0, 0, 0,  0, 0, 0,  0, 0, 0,
    //   0, 0, 0,  0, 0, 0,  0, 0, 0,
    //   0, 0, 0,  0, 0, 0,  0, 0, 0,
    // ]
];