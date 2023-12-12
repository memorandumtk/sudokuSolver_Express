const { getRequireSource } = require("@babel/preset-env/lib/utils");
import { Sudoku } from "./sudoku.js";

// create numbered 81 values array from 'puzzle'
const makeArray = (puzzle) => {
  let board = [];
  for (let i = 0; i < 81; i++) {
    if (puzzle[i] != '.') {
      board.push(Number(puzzle[i]));
    } else {
      board.push(0);
    }
  }
  return board;
}

const makeIndex = (coordinate) => {
  let row = 0;
  let coordinateAfter = (coordinate[0].toUpperCase() + coordinate[1])
  let result = (parseInt(coordinateAfter.charCodeAt(0)) - 65) * 9
    + (parseInt(coordinateAfter[1]) - 1);
  return result;
}

const make99 = (puzzle) => {
  let board = [];
  for (let i = 0; i < 9; i++) {
    let row = [];
    for (let j = 0; j < 9; j++) {
      row.push(puzzle[i * 9 + j])
    }
    board.push(row);
  }
  return board;
}

class SudokuSolver {

  validate(puzzle, coordinate, value) {
    if (puzzle.length != 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (/[^\d\.)]/.exec(puzzle)) {
      return { error: 'Invalid characters in puzzle' };
    }
    const coRegex = /^([a-iA-I])([1-9])$/.exec(coordinate);
    if (!coRegex) {
      return { error: 'Invalid coordinate' };
    }
    const valueRegex = /^[1-9]$/.exec(value);
    if (!valueRegex) {
      return { error: 'Invalid value' };
    }
    return 'pass initial value checking';
  }

  checkPlacement(req) {
    let { puzzle, coordinate, value } = req.body;
    let index = makeIndex(coordinate);
    let initialValidate = this.validate(puzzle, coordinate, value);
    if (initialValidate !== 'pass initial value checking') {
      return initialValidate;
    }
    let sudokuInstance = new Sudoku();
    try {
      let board = makeArray(puzzle);
      let result = sudokuInstance.check(board, index, value);
      if (result === true) {
        return { "valid": true };
      } else {
        return { "valid": false, "conflict": result };
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  solve(puzzle) {
    if (puzzle.length != 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (/[^\d\.)]/.exec(puzzle)) {
      return { error: 'Invalid characters in puzzle' };
    }
    let board = makeArray(puzzle);
    // console.log('this is initial board');
    // console.log(board)
    let result;
    try {
      let sudokuInstance = new Sudoku();
      let time = Date.now();
      result = sudokuInstance.solve(board);
      result = result.join("");
      console.log('calculating time is ' + (Date.now() - time) + 'ms');
      // console.log('this is result of solutionofsudoku');
      // console.log(result);
      return { solution: result };
    } catch (err) {
      return { error: 'Puzzle cannot be solved' };
    }
  }
}

module.exports = SudokuSolver;

  // checkRowPlacement(puzzleString, row, column, value) {

  // }

  // checkColPlacement(puzzleString, row, column, value) {

  // }

  // checkRegionPlacement(puzzleString, row, column, value) {

  // }

