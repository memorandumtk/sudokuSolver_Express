const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('Unit Tests', () => {

    // Valid variable
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
    const coordinate = 'A1';
    const value = '7';
    // Invalid variable
    const wrongPuzzle = 'W.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
    const lackOfPuzzle = '..9..'
    const coordinateWrongRow = 'P1';
    const coordinateWrongColumn = 'A0';
    const coordinateWrong = 'P0';
    const notSolvedPuzzule = '229..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

    test('#1 Logic handles a valid puzzle string of 81 characters'
        , function (done) {
            assert.equal(solver.validate(puzzle, coordinate, value)
                , 'pass initial value checking')
            done()
        });

    test('#2 Logic handles a puzzle string with invalid characters (not 1-9 or .)'
        , function (done) {
            assert.deepEqual(solver.validate(wrongPuzzle, coordinate, value)
                , { error: 'Invalid characters in puzzle' })
            done()
        });

    test('#3 Logic handles a puzzle string that is not 81 characters in length'
        , function (done) {
            assert.deepEqual(solver.validate(lackOfPuzzle, coordinate, value)
                , { error: 'Expected puzzle to be 81 characters long' })
            done()
        });

    test('#4 Logic handles a valid row placement'
        , function (done) {
            assert.equal(solver.validate(puzzle, coordinate, value)
                , 'pass initial value checking')
            done()
        });

    test('#5 Logic handles an invalid row placement'
        , function (done) {
            assert.deepEqual(solver.validate(puzzle, coordinateWrongRow, value)
                , { error: 'Invalid coordinate' })
            done()
        });

    test('#6 Logic handles a valid column placement'
        , function (done) {
            assert.equal(solver.validate(puzzle, coordinate, value)
                , 'pass initial value checking')
            done()
        });

    test('#7 Logic handles a invalid column placement'
        , function (done) {
            assert.deepEqual(solver.validate(puzzle, coordinateWrongColumn, value)
                , { error: 'Invalid coordinate' })
            done()
        });

    test('#8 Logic handles a valid region (3x3 grid) placement'
        , function (done) {
            assert.equal(solver.validate(puzzle, coordinate, value)
                , 'pass initial value checking')
            done()
        });

    test('#9 Logic handles an invalid region (3x3 grid) placement'
        , function (done) {
            assert.deepEqual(solver.validate(puzzle, coordinateWrong, value)
                , { error: 'Invalid coordinate' })
            done()
        });

    test('#10 Valid puzzle strings pass the solver'
        , function (done) {
            assert.property((solver.solve(puzzle, coordinate, value))
                , "solution")
            done()
        });

    test('#11 Invalid puzzle strings fail the solver'
        , function (done) {
            assert.deepEqual((solver.solve(wrongPuzzle, coordinate, value))
                , { error: 'Invalid characters in puzzle' })
            done()
        });

    test('#12 Solver returns the expected solution for an incomplete puzzle'
        , function (done) {
            assert.deepEqual((solver.solve(notSolvedPuzzule, coordinate, value))
                , { error: 'Puzzle cannot be solved' })
            done()
        });
});