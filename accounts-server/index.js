const express = require('express');
const http = require('http');
const { createMongoConnection, db } = require('./db');
const router$auth = require('./auth.router');
const router$core = require('./core.router');
const router$base = require('./base.router');
const CONFIG = require('./config');
const MESSAGES = require('./responses');
const { handler$passport, passport } = require('./passport');


const app = express();

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(require('morgan')('dev'));

app.use(
  '/api/core',
  handler$passport('jwt', {session: false}),
  // passport.authenticate('jwt-verify', { session: false }),
  router$core
);
app.use('/api/auth', router$auth);
app.use('/api', router$base);


function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  console.error(`error while handling ${req.url}`, err);
  res.status(err.status).send({ ok: false, message: err.message || 'server error' });
}

app.all('*', (req, res, next) => {
  next(MESSAGES.ERROR.NOT_FOUND(`${req.url}`));
})

app.use(errorHandler);

/*
  server
 */

const server = http.createServer(app);
const port = CONFIG.SERVER.PORT;
const host = CONFIG.SERVER.HOST;

// server listeners
process.on('uncaughtException', (e) => onServerError(e, 'uncaughtException'));
process.on('unhandledRejection', (e) => onServerError(e, 'unhandledRejection'));
const onServerListening = () => {
  console.log(`server listening on port - ${port}`);
};

const onServerError = (error, type = 'Server') => {
  console.log(`[${type}] error occured`, error);
};

const startServer = () => {
  const listener = server.listen({ port, host });
  listener.on('listening', onServerListening);
  listener.on('error', onServerError);
};


async function init() {
  await createMongoConnection(CONFIG.MONGO);
  await startServer();
}

init().catch((e) => {
  console.log(`Error`, e);
});