import bcrypt from 'bcrypt';
import cfg from './config';
import crypto from 'crypto';
import {promisify} from 'bluebird';
import rethinkdb from 'rethinkdb';
import {dbHost, dbPort, dbName} from './config';

// Connect to rethinkdb so we can perform authentication queries
const dbOpts = {host: dbHost, port: dbPort, db: dbName};
const dbConnPromise = promisify(rethinkdb.connect)(dbOpts);

async function run(query) {
  const c = await dbConnPromise;
  return query.run(c);
}

function hashPassword(password) {
  return promisify(bcrypt.hash)(password, cfg.bcryptRounds);
}

function comparePassword(password, hashedPassword) {
  return promisify(bcrypt.compare)(password, hashedPassword);
}

async function genAuthToken() {
  const buf = await promisify(crypto.randomBytes)(cfg.authTokenBytes);
  return buf.toString('base64');
}

// Create a user in the database with the specified userId and password, and
// return a promise that resolves to the user object. The promise will be
// rejected if there are any errors, such as duplicate userId.
export async function signup(userId, password) {
  const user = await Promise.all([
    hashPassword(password),
    genAuthToken()
  ]).then(results => {
    const [hashedPassword, authToken] = results;
    return {id: userId, hashedPassword, authToken}
  })
  const result = await run(rethinkdb.table('users').insert(user));
  if (result.errors) throw result.first_error;
  return user;
}

// Attempt to login with the specified userId and password, and return a
// promise that resolves to the user object if successful. The promise will
// be rejected if the authentication was unsuccessful.
export async function login(userId, password) {
  const user = await run(rethinkdb.table('users').get(userId));
  if (!user) throw 'Non-existent user';
  const matches = await comparePassword(password, user.hashedPassword);
  if (!matches) throw 'Incorrect password';
  return user;
}

// Check to see if there is an existing user with the specified userId and
// authToken. Return a promise that resolves to true if so, otherwise the
// returned promise will be rejected.
export async function tokenAuth(userId, authToken) {
  const query =
    rethinkdb
      .table('users')
      .get(userId)
      .getField('authToken')
      .eq(authToken);
  const success = await run(query);
  if (!success) throw 'Authentication failure';
  return true;
}
