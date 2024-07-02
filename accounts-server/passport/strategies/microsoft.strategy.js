const { Strategy: MicrosoftStrategy } = require("passport-microsoft");
const CONFIG = require("../../config");
const _ = require('lodash');
const service$auth = require("../../core/auth.service");
const config$api = require('../../config/api.config');

const strategy$microsoft = new MicrosoftStrategy({
  clientID: CONFIG.AUTH.MICROSOFT.CONFIG.CLIENT_ID,
  clientSecret: CONFIG.AUTH.MICROSOFT.CONFIG.CLIENT_SECRET,
  callbackURL: CONFIG.AUTH.MICROSOFT.CONFIG.CALLBACK_URL,
  // skipUserProfile: true,
  // scope: ['user.read', 'profile', 'openid'],
  
  // Optional, uses 'common' as the default
  // tenant: 'common',

  // Optional, whether or not to include the User Principal Name into the emails field in the user profile
  // addUPNAsEmail: false,

  // Optional, set this when you use a regional Microsoft Graph endpoint. Defaults to 'https://graph.microsoft.com'
  // apiEntryPoint: 'https://graph.microsoft.com',

  scope: CONFIG.AUTH.MICROSOFT.SCOPES,
}, async (access_token, refresh_token, profile, done) => {
  
  const email = _.get(profile, 'emails[0].value');
  if (!email) {
    return done(new AppError('invalid microsoft login'));
  }
  const _account = profile._json;
  const user = await service$auth.microsoft.createOrGetUser(_account, { access_token, refresh_token });
  const payload = _.pick(user, config$api.AUTHENTICATION.JWT_USER_PROPS);
  
  // console.log(`{accessToken, refreshToken, profile}`, JSON.stringify({ accessToken, refreshToken, profile }));
  return done(null, payload);
});

module.exports = strategy$microsoft;