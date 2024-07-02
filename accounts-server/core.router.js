const express = require('express');
const { db } = require("./db");
const config$api = require('./config/api.config');
const _ = require('lodash');
const router = express.Router({ mergeParams: true });
const tag = __filename;
router.get('/hi', (req, res) => {
  console.log(`[${tag}] core req.user`, req.user);
  res.send({ ok: true });
});

module.exports = router;