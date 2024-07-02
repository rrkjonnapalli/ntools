class AppError extends Error {
  status = 400;
  constructor(message, status) {
    let msg = message instanceof Error ? message.message : message;
    super(msg);
    if (status) { this.status = status; }
  }
}

class AppResponse {
  status = 200;
  ok = true;
  constructor(data, { status, message, meta, ok } = {}) {
    if (data) { this.data = data; }
    if (status) { this.status = status; }
    if (message) { this.message = message; }
    if (meta) { this.meta = meta; }
    if (typeof ok === 'boolean') { this.ok = ok; }
  }
}

/*
  errors
 */
const INVALID_CREDENTIALS = () => {
  return new AppError('invalid credentials', 401);
};
const NOT_FOUND = (entity) => {
  return new AppError(`${entity || ''} not found`.trim(), 404);
};
const VERIFICATION_FAILED = () => {
  return new AppError('verification failed', 422);
};
const BAD_INPUT = (property) => {
  return new AppError(`bad ${property || 'input'}`.trim(), 400);
};
const ALREADY_REGISTERD = (property) => {
  return new AppError(`${property || 'user'} already registered`, 401);
};

const INTERNAL_SERVER_ERROR = () => {
  return new AppError('something broken', 500);
}


/*
  info
 */
const USER_SIGNUP = () => {
  return new AppResponse(null, { message: `user has been created successfully`, status: 201 });
};
const VERIFICATION_SENT = () => {
  return new AppResponse(null, { message: `verifcation has been sent`, status: 200 });
};
const PASSWORD_CHANGED = () => {
  return new AppResponse(null, { message: `password changed successfully`, status: 200 });
};

const MESSAGES = {
  ERROR: {
    INVALID_CREDENTIALS,
    NOT_FOUND,
    VERIFICATION_FAILED,
    ALREADY_REGISTERD,
    BAD_INPUT,
    INTERNAL_SERVER_ERROR
  },
  SUCCESS: {
    USER_SIGNUP,
    VERIFICATION_SENT,
    PASSWORD_CHANGED
  },
  AppError,
  AppResponse
};

module.exports = MESSAGES;