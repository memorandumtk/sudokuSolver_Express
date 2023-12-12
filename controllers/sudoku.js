// Reference
// https://lisperator.net/blog/javascript-sudoku-solver/
// https://lisperator.net/s/js/sudoku2.js~5e97a5c0d1e7d58ab46fed924490a6feaa997dbd 

function i2rc(index) { // Convert index to row and column
    return { row: Math.floor(index / 9), col: index % 9 };
}

function rc2i(row, col) { // Convert row and column
    return row * 9 + col;
}

// Decide to index correction, I cound't understand completely 'i!=index'
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

// Make candidate less
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


export class Sudoku {
    bestBet(board) {
        let bestIndex, bestLen = 100, bestMoves;
        for (let index = 0; index < board.length; ++index) {
            if (!board[index]) {
                let count = 0, moves = 0;
                // '<<' means shifting a bit to left
                // This code using bit to solve, bit scale is 1-511.
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

    // solve method
    // I passed 'board' data from soduku-solver.js as an argument.
    solve(data) {
        let self = this; // This 'self' is important to pass second solve function.
        let backtrack = 0;
        let board = data;
        if (solve()) {
            return board;
        } else {
            return "no solution";
        }
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

    // Check method
    // This is a method I created for checking whether or not 
    //value is conflicting on each direction and region,
    //returns an array indicating conflicting direction or region.
    check(board, index, value) {
        let conflict = [];
        if (board[index]) {
            board[index] = 0;
        }
        let { row, col } = i2rc(index);
        for (let i = 0; i < 9; ++i) {
            if (board[rc2i(i, col)] == value) {
                conflict.push("column");
            }
            if (board[rc2i(row, i)] == value) {
                conflict.push("row");
            }
        }
        let r1 = Math.floor(row / 3) * 3;
        let c1 = Math.floor(col / 3) * 3;
        for (let r = r1; r < r1 + 3; ++r) {
            for (let c = c1; c < c1 + 3; ++c) {
                if (board[rc2i(r, c)] == value) {
                    conflict.push("region");
                }
            }
        }
        if (conflict.length === 0) {
            return true;
        } else {
            return conflict;
        }
    }
}

// export const examples = [
//     ["Medium 1",
//         0, 0, 0, 0, 0, 0, 0, 0, 6,
//         0, 3, 0, 0, 7, 1, 0, 4, 0,
//         0, 0, 0, 0, 0, 0, 8, 0, 0,

//         0, 0, 0, 9, 0, 8, 0, 7, 1,
//         1, 0, 3, 0, 0, 0, 0, 0, 0,
//         0, 0, 2, 0, 3, 0, 9, 0, 0,

//         5, 0, 7, 0, 0, 6, 0, 0, 0,
//         2, 0, 0, 0, 0, 0, 7, 0, 0,
//         0, 0, 1, 8, 0, 0, 0, 0, 2,
//     ],
// ];