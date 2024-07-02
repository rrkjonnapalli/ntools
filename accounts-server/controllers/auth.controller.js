const { ulid } = require("ulid");
const { ExtractJwt } = require("passport-jwt");
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config$api = require("../config/api.config");
const { db } = require("../db");
const MESSAGES = require("../responses");
const hasher = require("../hasher");
const crypto = require('node:crypto');

const CONFIG = require("../config");
// const passport = require('./strategies/passport');
// const handler$passport = require("./strategies/passport.handler");
const { blacklist } = require("../utils");
const { handler$passport, passport } = require("../passport");



const signin = async (req, res) => {
  /**
   * todo: validation
   */
  return handler$passport('local', { session: false })(req, res);
}

const signup = async (req) => {
  const data = req.body;
  /**
   * todo: validation
   */
  const { email, fullname, password } = data;
  const collection = db.db$.collection(config$api.MONGO_COLLECTION_CONFIG.USERS.collection);
  const user = await collection.findOne({ email });
  if (user) {
    throw MESSAGES.ERROR.ALREADY_REGISTERD(`email`);
  }
  const response = await collection.insertOne({
    _id: ulid(),
    email,
    fullname,
    password: hasher.hash(password)
  });
  return MESSAGES.SUCCESS.USER_SIGNUP();
}

const forgotPassword = (req) => {
}

const resetPassword = (req) => {
}

const signin$google = (req, res, next) => {
  console.log(`signin$google`);
  return passport.authenticate('google', { scope: CONFIG.AUTH.GOOGLE.SCOPES })(req, res, next);
};

const link$google = (req, res, next) => {
  console.log(`link google`);
  const user = req.user;
  return passport.authenticate('google', { scope: CONFIG.AUTH.GOOGLE.SCOPES, accessType: CONFIG.AUTH.GOOGLE.CONFIG.ACCESS_TYPE, state: JSON.stringify(user) })(req, res, next);
};

const callback$google = (req, res) => {
  console.log(`callback$google`, req.query);
  return handler$passport('google', { session: false })(req, res);
};

const ms$utils = {
  generateCodeVerifier: () => {
    return ms$utils.base64URLEncode(crypto.randomBytes(32));
  },
  computeCodeChallenge: (verifier) => {
    return ms$utils.base64URLEncode(crypto.createHash('sha256').update(verifier).digest());
  },
  base64URLEncode: (str) => {
    return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
};


const codeVerifier = ms$utils.generateCodeVerifier();
const codeChallenge = ms$utils.computeCodeChallenge(codeVerifier);

const signin$microsoft = (req, res, next) => {
  console.log(`signin$microsoft`);
  const ms$authOptions = {
    session: false,
    scope: CONFIG.AUTH.MICROSOFT.SCOPES,
    // state: true,
    // prompt: 'consent',
    // code_challenge_method: 'S256',
    // code_challenge: codeChallenge,
  };
  return passport.authenticate('microsoft', ms$authOptions)(req, res, next);
};

const link$microsoft = (req, res, next) => {
  console.log(`link microsoft`);
  const user = req.user;
  return passport.authenticate('microsoft', { session: false, scope: CONFIG.AUTH.MICROSOFT.SCOPES, state: JSON.stringify(user) })(req, res, next);
};

const callback$microsoft = (req, res, next) => {
  console.log(`callback$microsoft`, req.query);
  return handler$passport('microsoft', { session: false, scope: CONFIG.AUTH.MICROSOFT.SCOPES })(req, res);
};


const signout = (req) => {
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  return blacklist.revoke(token);
};

module.exports = {
  signin,
  signup,
  signout,
  forgotPassword,
  resetPassword,
  signin$google,
  callback$google,
  link$google,
  signin$microsoft,
  link$microsoft,
  callback$microsoft
};