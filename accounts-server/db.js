const mongodb = require('mongodb');
const _ = require('lodash');
const config$mongo = require('./config/mongo.config');

const db = { db$: null, db$my_accounts: null, db$my_accounts$: {} };


const setup = (dbKey) => {
  const _db = db[`db$${dbKey.toLowerCase()}`];
  for (let c in config$mongo[dbKey].COLLECTIONS) {
    const collection = config$mongo[dbKey].COLLECTIONS[c];
    _.set(db.db$my_accounts$, collection, _db ? _db.collection(collection) : null);
  }
}

setup('MY_ACCOUNTS');

const createMongoConnection = async (opts) => {
  const url = _.get(opts, 'URL');
  const client = new mongodb.MongoClient(url);
  await client.connect();
  db.db$ = client.db('my_accounts');
  db.db$my_accounts = db.db$;
  setup('MY_ACCOUNTS');
  return client;
};


module.exports = { createMongoConnection, db };