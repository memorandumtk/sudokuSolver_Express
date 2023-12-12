require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');

const fccTestingRoutes = require('./routes/fcctesting.js');
const apiRoutes = require('./routes/api.js');
const runner = require('./test-runner');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const requestLogger = (request, response, next) => {
  console.log(`${request.method} url:: ${request.url}`);
  console.log('body::')
  console.log(request.body);
  next()
}
app.use(requestLogger)

// Reference:
// https://copyprogramming.com/howto/node-js-express-how-to-log-the-request-body-and-response-body#how-to-log-all-requests-and-responses-in-a-route
// app.use(function responseLogger(req, res, next) {
//   const originalSendFunc = res.send.bind(res);
//   res.send = function(body) {
//     console.log(body);    // do whatever here
//     return originalSendFunc(body);
//   };
//   next()
// });


//Index page (static HTML)
app.route('/')
  .get(function (req, res, next) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

app.route('/test')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/test.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

// User routes
apiRoutes(app);

// Ref site: https://reflectoring.io/express-error-handling/
// Error handling Middleware functions
const errorLogger = (error, request, response, next) => {
  console.log(`error ${error.message}`)
  next(error) // calling next middleware
}

const errorResponder = (error, request, response, next) => {
  response.header("Content-Type", 'application/json')
  const status = error.status || 400
  response.status(status).send(error.message)
}
app.use(errorLogger)
app.use(errorResponder)
//404 Not Found Middleware
// app.use(function(req, res, next) {
//   res.status(404)
//     .type('text')
//     .send('Not Found');
// });

//Start our server and tests!
const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
  // process.env.NODE_ENV='test'
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // for testing
