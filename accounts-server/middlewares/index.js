const { AppError } = require("../responses");
const mw$proxytoken = require("./proxytoken.middleware");
const mw$token = require("./token.middleware");

const middlewares = {
  mw$token,
  mw$proxytoken
};

const mw$ = (mw) => {
  const key = `mw$${mw}`;
  console.log(`getting middleware - ${key}`);
  const middleware = middlewares[key];
  if (middleware) { return middleware; }
  throw new AppError(`middleware not found`);
  // return (_req, _res, next) => next();
};

module.exports = {
  ...middlewares,
  mw$
};