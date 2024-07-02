// https://developers.google.com/identity/protocols/oauth2/scopes?authuser=7
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const config$api = require('../../config/api.config');
const CONFIG = require('../../config');
const { AppError } = require('../../responses');
const _ = require('lodash');
const service$auth = require('../../core/auth.service');
const tag = __filename;

// const GOOGLE_CLIENT_ID = config$google.web.client_id;
// const GOOGLE_CLIENT_SECRET = config$google.web.client_secret;
// const CALLBACK_URL = config$google.web.redirect_uris[0] // 'http://localhost:3000/auth/google/callback'; // Replace with your callback URL



// Configure Passport to use Google OAuth2.0
const strategy$google = new GoogleStrategy({
  clientID: CONFIG.AUTH.GOOGLE.CONFIG.CLIENT_ID,
  clientSecret: CONFIG.AUTH.GOOGLE.CONFIG.CLIENT_SECRET,
  callbackURL: CONFIG.AUTH.GOOGLE.CONFIG.CALLBACK_URL
}, async (access_token, refresh_token, profile, done) => {
  // This function is called when user authorizes Google OAuth2
  // `profile` contains user profile information from Google
  const email = _.get(profile, 'emails[0].value');
  if (!email) {
    return done(new AppError('invalid google login'));
  }
  const _account = profile._json;
  const user = await service$auth.google.createOrGetUser(_account, { access_token, refresh_token });
  const payload = _.pick(user, config$api.AUTHENTICATION.JWT_USER_PROPS);
  return done(null, payload);
});

module.exports = strategy$google;