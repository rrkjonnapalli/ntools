const _ = require('lodash');
const { Strategy: LocalStrategy } = require('passport-local');
const { db } = require('../../db');
const config$api = require('../../config/api.config');
const MESSAGES = require('../../responses');
const hasher = require('../../hasher');

const { username, password } = config$api.AUTHENTICATION.PASSPORT.LOCAL_STRATEGY.props;
const strategy$local = new LocalStrategy({
  usernameField: username,
  passwordField: password
},
  async function (email, password, cb) {
    //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
    // const { email, password } = data;
    const collection = db.db$.collection(config$api.MONGO_COLLECTION_CONFIG.USERS.collection);
    const user = await collection.findOne({ email });
    if (!user) {
      return cb(MESSAGES.ERROR.NOT_FOUND(`user`));
    }
    if (!user.password) {
      return cb(MESSAGES.ERROR.INVALID_CREDENTIALS());
    }
    if (!hasher.compare(password, user.password)) {
      return cb(MESSAGES.ERROR.INVALID_CREDENTIALS());
    }
    const payload = _.pick(user, config$api.AUTHENTICATION.JWT_USER_PROPS);
    return cb(null, payload);
    // req.login(payload, { session: false });
    // const token = jwt.sign(payload, CONFIG.JWT_SECRET);
    // return { token };
    // return UserModel.findOne({ email, password })
    //   .then(user => {
    //     if (!user) {
    //       return cb(null, false, { message: 'Incorrect email or password.' });
    //     }
    //     return cb(null, user, { message: 'Logged In Successfully' });
    //   })
    //   .catch(err => cb(err));
  }
);

module.exports = strategy$local;