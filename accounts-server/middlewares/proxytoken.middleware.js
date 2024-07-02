const { ExtractJwt } = require("passport-jwt");
const { AppError } = require("../responses");

module.exports = async (req, _res, next) => {
  const token = ExtractJwt.fromUrlQueryParameter('token');
  if (!token) {
    return next(new AppError('invalid token'));
  }
  // const isBlacklisted = await blacklist.verify(token);
  // console.log(`isBlacklisted - ${isBlacklisted}`);
  // if (isBlacklisted) {
  //   return next(new AppError('token revoked', 401));
  // }
  req.headers.authorization = `Bearer ${token}`;
  return next();
};