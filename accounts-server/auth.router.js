const express = require('express');
const config$api = require('./config/api.config');
const router = express.Router({ mergeParams: true });
const controller$auth = require('./controllers/auth.controller');
const { createRoute } = require('./utils/api.utils');

for (let routeConfig of config$api.ROUTES.AUTH) {
  const { route, action: actionName, method, ...opts } = routeConfig;
  const action = controller$auth[actionName];
  createRoute(router)(method, route, action, opts);
}

module.exports = router;