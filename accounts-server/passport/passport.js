const passport = require('passport');

const { strategy$jwt, strategy$jwt_query } = require('./strategies/jwt.strategy');
const strategy$local = require('./strategies/local.strategy');
const strategy$google = require('./strategies/google.strategy');
const strategy$microsoft = require('./strategies/microsoft.strategy');

passport.use(strategy$local);
passport.use(strategy$jwt);
passport.use('jwt_query', strategy$jwt_query);
passport.use(strategy$google);
passport.use(strategy$microsoft);


module.exports = passport;
