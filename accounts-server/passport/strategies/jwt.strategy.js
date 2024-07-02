const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const _ = require('lodash');
const { db } = require('../../db');
const config$api = require('../../config/api.config');
const CONFIG = require('../../config');
const { AppError } = require('../../responses');
const tag = __filename;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  /*
  secretOrKeyProvider: (req, token, done) => {
    try {
      jwt.verify(token, CONFIG.JWT.SECRET, CONFIG.JWT.OPTIONS.VERIFY);
      done(null, CONFIG.JWT.SECRET);
    } catch (error) {
      const e = new AppError(error.message, 401);
      req.error = e;
      done(e);
    }
  },
  */

  secretOrKey: CONFIG.JWT.SECRET,
  jsonWebTokenOptions: CONFIG.JWT.OPTIONS.VERIFY,
  failWithError: true
};


const queryOpts = {
  jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
  /*
  secretOrKeyProvider: (req, token, done) => {
    try {
      jwt.verify(token, CONFIG.JWT.SECRET, CONFIG.JWT.OPTIONS.VERIFY);
      done(null, CONFIG.JWT.SECRET);
    } catch (error) {
      const e = new AppError(error.message, 401);
      req.error = e;
      done(e);
    }
  },
  */

  secretOrKey: CONFIG.JWT.SECRET,
  jsonWebTokenOptions: CONFIG.JWT.OPTIONS.VERIFY,
  failWithError: true
};

const getStrategy = (opts) => {
  const strategy = new JwtStrategy(opts, async function (payload, done) {
    console.log(`jwt payload`, payload, payload.token);
    const collection = db.db$.collection(config$api.MONGO_COLLECTION_CONFIG.USERS.collection);
    let user = false;
    let error = null;
    try {
      const data = await collection.findOne({ _id: payload._id }, {
        projection: config$api.AUTHENTICATION.JWT_USER_PROPS.reduce((r, e) => ({ ...r, [e]: 1 }), {})
      });
      user = data || false;
    } catch (err) {
      error = new AppError(err);
    }
    _.set(user, '__exp', payload.exp);
    return done(error, user);
  });
  return strategy;
}

module.exports = {
  strategy$jwt: getStrategy(opts),
  strategy$jwt_query: getStrategy(queryOpts)
};