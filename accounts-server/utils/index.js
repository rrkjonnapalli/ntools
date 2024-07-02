const _ = require('lodash');
const { db } = require('../db');
const jwt = require("jsonwebtoken");
const config$mongo = require("../config/mongo.config");
const { JWT } = require('../config');

const store$ = (collection, source) => db[source ? source : 'db$my_accounts$'][collection];

const map$object = (o, t) => {
  let result = {};
  for (let key in t) {
    const value = t[key];
    if (typeof value === 'object') {
      result[key] = map$(o, value);
    } else {
      result[key] = _.get(o, value);
    }
  }
  return result;
};

const map$array = (o, t) => {
  let result = [];
  for (let e of t) {
    if (typeof e === 'object') {
      result.push(map$(o, e));
    } else {
      result.push(_.get(o, e));
    }
  }
  return result;
};

const map$ = (o, t) => {
  if (Array.isArray(t)) {
    return map$array(o, t);
  } else {
    return map$object(o, t);
  }
};

const blacklist = (() => {
  const collection = config$mongo.MY_ACCOUNTS.COLLECTIONS.BLACKLIST;
  return {
    verify: async (token) => {
      const doc = await store$(collection).findOne({ _id: token });
      return !!doc;
    },
    revoke: async (token) => {
      let { exp, _id, iat } = jwt.decode(token);
      if (!exp) {
        exp = (new Date(iat)).setMilliseconds(JWT.DEFAULT_EXP_TIME_MS);
      } else {
        exp = exp instanceof Date ? exp : new Date(exp * 1000);
      }
      await store$(collection).insertOne({ user_id: _id, _id: token, exp });
    }
  }
})();

module.exports = {
  store$,
  blacklist,
  map$
}