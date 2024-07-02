// const handler$passport = require("../controllers/strategies/passport.handler");

const { mw$ } = require("../middlewares");
const { handler$passport } = require("../passport");
const RESPONSE = require("../responses");
const _ = require('lodash');


const handler$request = (f) => {
  return async (req, res, next) => {
    console.log(`triggered from handler$request`);
    try {
      const data = await f(req, res, next);
      let response = data;
      if (!(data instanceof RESPONSE.AppResponse)) {
        response = new RESPONSE.AppResponse(data);
      }
      const { status, ...output } = response;
      res.status(response.status).send(output);
    } catch (error) {
      console.log(`request handling error - ${req.url}`, error);
      if (error instanceof RESPONSE.AppError) {
        return next(error);
      }
      next(RESPONSE.ERROR.INTERNAL_SERVER_ERROR());
    }
  }
};

const createRoute = (router) => {
  return (method, path, handler, opts) => {
    console.log(`registering route --- ${method.toUpperCase()}: /api/${path} ${!opts ? '' : 'with options - ' + JSON.stringify(opts)}`,);
    let middlewares = [];
    const mws = _.get(opts, 'middlewares', []);
    for (let middleware of mws) {
      if (middleware.includes('passport')) {
        const [_base, strategy] = middleware.split('$');
        middlewares.push(handler$passport(strategy, { session: false }));
      } else {
        middlewares.push(mw$(middleware));
      }
    }
    // const middlewares = _.get(opts, 'middlewares', []).map(e => )
    const pathname = path.startsWith('/') ? path : `/${path}`;
    router[method](pathname, middlewares, _.get(opts, 'skipHandler') ? handler : handler$request(handler));
  }
};

module.exports = {
  createRoute
};