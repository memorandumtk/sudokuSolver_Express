'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const { response } = require('../server.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res, next) => {
      if (req.body.puzzle && req.body.coordinate && req.body.value) {
        let result = solver.checkPlacement(req);
        res.send(result);
      } else {
        res.send({ error: 'Required field(s) missing' })
      }
    });

  app.route('/api/solve')
    .post((req, res, next) => {
      if (req.body.puzzle) {
        let result = solver.solve(req.body.puzzle);
        res.send(result);
      } else {
        res.send({ error: 'Required field missing' })
      }
    });
};
