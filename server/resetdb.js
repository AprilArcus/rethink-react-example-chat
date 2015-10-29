import { promisify } from 'bluebird';
import r from 'rethinkdb';
import { dbHost, dbPort, dbName } from './config';

const dbOpts = {host: dbHost, port: dbPort, db: dbName};
const connPromise = promisify(r.connect)(dbOpts);
async function run(query) {
  return query.run(await connPromise);
}

console.log('Resetting chat db...');

async function recreateDb(name) {
  try {
    await run(r.dbDrop(name));
  } catch (error) {} //eslint-disable-line no-empty
  await run(r.dbCreate(name));
}

async function recreateTable(name) {
  try {
    await run(r.tableDrop(name));
  } catch (error) {} //eslint-disable-line no-empty
  await run(r.tableCreate(name));
}

async function resetDb() {
  await recreateDb(dbName);
  await Promise.all([
    recreateTable('messages').then(() => (
      run(r.table('messages').indexCreate('createdAt'))
    )),
    recreateTable('users'),
  ]);
  const connection = await connPromise;
  await connection.close();
  console.log('Completed');
}

resetDb();
