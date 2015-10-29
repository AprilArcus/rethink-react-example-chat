import * as auth from './auth';
import { dbHost, dbPort, webPort } from './config';
import express from 'express';
import http from 'http';
import { listen as wsListen } from 'rethinkdb-websocket-server';
import { queryWhitelist } from './queries';
import cors from 'cors';

// Set up the HTTP routes

const app = express();

app.use(cors());

app.use('/', express.static('assets'));

app.post('/signup', async (req, res) => {
  const {userId, password} = req.query;
  try {
    const {id, authToken} = await auth.signup(userId, password);
    res.send({userId: id, authToken});
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/login', async (req, res) => {
  const {userId, password} = req.query;
  try {
    const {id, authToken} = await auth.login(userId, password);
    res.send({userId: id, authToken});
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

const httpServer = http.createServer(app);

// Instantiate a session object with a userId property for every incoming
// websocket connection
async function sessionCreator(urlQueryParams) {
  const {userId, authToken} = urlQueryParams;
  await auth.tokenAuth(userId, authToken);
  return {userId};
}

// Configure rethinkdb-websocket-server to listen on the /db path
wsListen({
  httpServer,
  httpPath: '/db',
  dbHost,
  dbPort,
  sessionCreator,
  unsafelyAllowAnyQuery: false,
  queryWhitelist,
});

// Start the HTTP server on the configured port
httpServer.listen(webPort);
console.log(`Chat server listening on http://localhost:${webPort}`);
