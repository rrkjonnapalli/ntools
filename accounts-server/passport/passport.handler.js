const CONFIG = require('../config');
const MESSAGES = require('../responses');
const passport = require('./passport');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const tag = __dirname;

const handler$passport = (strategy, opts) => {
  const middleware = async (req, res, next) => {
    const $process = new Promise((resolve, reject) => {
      return passport.authenticate(strategy, opts || {}, (err, user) => {
        console.log(`[${tag}] [strategy - ${strategy}] authenticated data for `, err, user);
        if (err) { return reject(new MESSAGES.AppError(err, 401)); }
        if (!user) {
          const _error = _.get(req.query, 'error');
          const error = _error ? new MESSAGES.AppError(_error, 401) : MESSAGES.ERROR.NOT_FOUND(`user`);
          return reject(error);
        }
        req.login(user, { ...opts }, async (_err) => {
          if (_err) return reject(new MESSAGES.AppError(_err));
          const token = jwt.sign(user, CONFIG.JWT.SECRET, CONFIG.JWT.OPTIONS.SIGN);
          return resolve({ token });
        });
      })(req, res, next);
    });
    if (!next) return $process;
    return $process.then(() => next()).catch((e) => next(e));
  };
  return middleware;
}

module.exports = {
  handler$passport
};