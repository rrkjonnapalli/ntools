const { ExtractJwt } = require("passport-jwt");
const { blacklist } = require("../utils");
const { AppError } = require("../responses");

module.exports = async (req, _res, next) => {
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  const isBlacklisted = await blacklist.verify(token);
  console.log(`isBlacklisted - ${isBlacklisted}`);
  if (isBlacklisted) {
    return next(new AppError('token revoked', 401));
  }
  return next();
};