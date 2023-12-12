const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    suite('Tests for /api/solve', () => {
        const validForm = {
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        };
        const missPuzzuleForm = {
            notpuzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        };
        const invalidPuzzuleForm = {
            puzzle: 'W.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        };
        const inCorrectLengthForm = {
            puzzle: '..9..',
        };
        const notSolvedForm = {
            puzzle: '.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        };

        test('#1 Solve a puzzle with valid puzzle string: POST request to /api/solve'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/solve')
                    .send(validForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.property(res.body, "solution");
                        done();
                    });
            });

        test('#2 Solve a puzzle with missing puzzle string: POST request to /api/solve'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/solve')
                    .send(missPuzzuleForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body
                            , { error: 'Required field missing' });
                        done();
                    });
            });

        test('#3 Solve a puzzle with invalid characters: POST request to /api/solve'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/solve')
                    .send(invalidPuzzuleForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body
                            , { error: 'Invalid characters in puzzle' });
                        done();
                    });
            });

        test('#4 Solve a puzzle with incorrect length: POST request to /api/solve'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/solve')
                    .send(inCorrectLengthForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body
                            , { error: 'Expected puzzle to be 81 characters long' });
                        done();
                    });
            });

        test('#5 Solve a puzzle that cannot be solved: POST request to /api/solve'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/solve')
                    .send(notSolvedForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body
                            , { error: 'Puzzle cannot be solved' });
                        done();
                    });
            });
    });

    suite('Tests for /api/check', () => {
        const checkForm = {
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: '7'
        };
        const singleConflictForm = {
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: '6'
        };
        const multiConflictForm = {
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: '9'
        };
        const tripleConflictForm = {
            puzzle: '..92.5.1.85.4....2432......1...69.83.9.....6.62.71...92.....1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: '2'
        };
        const missingCheckForm = {
            puzzle: '..92.5.1.85.4....2432......1...69.83.9.....6.62.71...92.....1945....4.37.4.3..6..',
            value: '2'
        };
        const invalidCharCheckForm = {
            puzzle: 'W.92.5.1.85.4....2432......1...69.83.9.....6.62.71...92.....1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: '2'
        };
        const inCorectLengthCheckForm = {
            puzzle: '..92.',
            coordinate: 'A1',
            value: '2'
        };
        const invalidCoordinateForm = {
            puzzle: '..92.5.1.85.4....2432......1...69.83.9.....6.62.71...92.....1945....4.37.4.3..6..',
            coordinate: 'A11',
            value: '2'
        };
        const invalidValueCheckForm = {
            puzzle: '..92.5.1.85.4....2432......1...69.83.9.....6.62.71...92.....1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: '11'
        };

        test('#6 Check a puzzle placement with all fields: POST request to /api/check'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/check')
                    .send(checkForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body
                            , "valid", true);
                        done();
                    });
            });

        test('#7 Check a puzzle placement with single placement conflict: POST request to /api/check'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/check')
                    .send(singleConflictForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body
                            , "valid", false);
                        assert.deepEqual(res.body.conflict
                            , ["column"]);
                        done();
                    });
            });

        test('#8 Check a puzzle placement with multiple placement conflicts: POST request to /api/check'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/check')
                    .send(multiConflictForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body
                            , "valid", false);
                        assert.deepEqual(res.body.conflict
                            , ["row", "region"]);
                        done();
                    });
            });

        test('#9 Check a puzzle placement with all placement conflicts: POST request to /api/check'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/check')
                    .send(tripleConflictForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body
                            , "valid", false);
                        assert.deepEqual(res.body.conflict
                            , ["row", "column", "region"]);
                        done();
                    });
            });

        test('#10 Check a puzzle placement with missing required fields: POST request to /api/check'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/check')
                    .send(missingCheckForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body
                            , { error: 'Required field(s) missing' });
                        done();
                    });
            });

        test('#11 Check a puzzle placement with invalid characters: POST request to /api/check'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/check')
                    .send(invalidCharCheckForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body
                            , { error: 'Invalid characters in puzzle' });
                        done();
                    });
            });

        test('#12 Check a puzzle placement with incorrect length: POST request to /api/check'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/check')
                    .send(inCorectLengthCheckForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body
                            , { error: 'Expected puzzle to be 81 characters long' });
                        done();
                    });
            });

        test('#13 Check a puzzle placement with invalid placement coordinate: POST request to /api/check'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/check')
                    .send(invalidCoordinateForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body
                            , { error: 'Invalid coordinate' });
                        done();
                    });
            });

        test('#14 Check a puzzle placement with invalid placement value: POST request to /api/check'
            , function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/check')
                    .send(invalidValueCheckForm)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body
                            , { error: 'Invalid value' });
                        done();
                    });
            });
    });
});
