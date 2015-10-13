'use strict';

// Instantiate a session object with a userId property for every incoming
// websocket connection

var sessionCreator = _asyncToGenerator(function* (urlQueryParams) {
  const userId = urlQueryParams.userId;
  const authToken = urlQueryParams.authToken;

  yield authManager.tokenAuth(userId, authToken);
  return { userId };
}

// Configure rethinkdb-websocket-server to listen on the /db path
);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _AuthManager = require('./AuthManager');

var _config = require('./config');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _rethinkdbWebsocketServer = require('rethinkdb-websocket-server');

var _bluebird = require('bluebird');

var _queries = require('./queries');

var _rethinkdb = require('rethinkdb');

var _rethinkdb2 = _interopRequireDefault(_rethinkdb);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

// Connect to rethinkdb so we can perform authentication queries
const dbOpts = { host: _config.dbHost, port: _config.dbPort, db: _config.dbName };
const dbConnPromise = (0, _bluebird.promisify)(_rethinkdb2['default'].connect)(dbOpts);
const authManager = new _AuthManager.AuthManager(dbConnPromise);

// Set up the HTTP routes

const app = (0, _express2['default'])();

app.use((0, _cors2['default'])());

app.use('/', _express2['default']['static']('assets'));

app.post('/signup', _asyncToGenerator(function* (req, res) {
  var _req$query = req.query;
  const userId = _req$query.userId;
  const password = _req$query.password;

  try {
    var _ref = yield authManager.signup(userId, password);

    const id = _ref.id;
    const authToken = _ref.authToken;

    res.send({ userId: id, authToken });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}));

app.post('/login', _asyncToGenerator(function* (req, res) {
  var _req$query2 = req.query;
  const userId = _req$query2.userId;
  const password = _req$query2.password;

  try {
    var _ref2 = yield authManager.login(userId, password);

    const id = _ref2.id;
    const authToken = _ref2.authToken;

    res.send({ userId: id, authToken });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}));

const httpServer = _http2['default'].createServer(app);(0, _rethinkdbWebsocketServer.listen)({
  httpServer,
  httpPath: '/db',
  dbHost: _config.dbHost,
  dbPort: _config.dbPort,
  sessionCreator,
  unsafelyAllowAnyQuery: false,
  queryWhitelist: _queries.queryWhitelist
});

// Start the HTTP server on the configured port
httpServer.listen(_config.webPort);
console.log(`Chat server listening on http://localhost:${ _config.webPort }`);
