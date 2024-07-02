const express = require('express');
const { db } = require("./db");
const config$api = require('./config/api.config');
const _ = require('lodash');
const { createRoute } = require('./utils/api.utils');
const router = express.Router({ mergeParams: true });
const tag = __filename;
const isExcluded = (list, e) => (list || []).find(opt => opt.includes(e));

const isCursorResult = (method) => {
  return [
    config$api.BASE_METHODS.readMany.mongo,
    config$api.BASE_METHODS.aggregate.mongo
  ].includes(method);
}

const isAggregate = method => config$api.BASE_METHODS.aggregate.mongo === method;

const createCollectionAPI = ({ collection: collectionName, skip, routePath, multiRoutePath, exclude }) => {
  if (skip) { return; }
  for (let method of config$api.MONGO_METHOD_ORDER) {
    if (isExcluded(exclude, method)) continue;
    const mongo$method = config$api.BASE_METHODS[method].mongo;
    const handler = async (req) => {
      const collection = db.db$.collection(collectionName);
      const body = _.get(req, 'body', []);
      console.debug(`[${tag}] input params - `, JSON.stringify(body));
      const runner = collection[mongo$method](...(Array.isArray(body) ? body : [body]));
      const data = await (isCursorResult(mongo$method) ? runner.toArray() : runner);
      return data;
    };
    const handleOne = async (req) => {
      const collection = db.db$.collection(collectionName);
      const _id = req.params.id;
      const body = _.get(req, 'body', []);
      const query = { _id };
      const data = await collection[mongo$method](query, ...body);
      return data;
    }
    if (method === config$api.BASE_METHODS.readMany.key) {
      createRoute(router)('get', `${multiRoutePath}`, handler);
    } else if (
      [
        config$api.BASE_METHODS.createMany.key,
        config$api.BASE_METHODS.createOne.key
      ].includes(method)
    ) {
      createRoute(router)('post', multiRoutePath, handler);
    } else if (method === config$api.BASE_METHODS.readOne.key) {
      createRoute(router)('get', `${routePath}/:id`, handleOne);
    } else if (method === config$api.BASE_METHODS.updateOne.key) {
      createRoute(router)('patch', `${routePath}/:id`, handleOne);
    } else if (method === config$api.BASE_METHODS.replaceOne.key) {
      createRoute(router)('put', `${routePath}/:id`, handleOne);
    } else if (method === config$api.BASE_METHODS.deleteOne.key) {
      createRoute(router)('delete', `${routePath}/:id`, handleOne);
    }
    createRoute(router)('post', `${routePath}/${method}`, handler);
  }
};

for (let key in config$api.MONGO_COLLECTION_CONFIG) {
  const cfg = config$api.MONGO_COLLECTION_CONFIG[key];
  createCollectionAPI(cfg);
}

module.exports = router;