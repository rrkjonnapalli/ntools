const CONFIG = {
  MONGO_METHOD_ORDER: [
    'createMany',
    'readMany',
    'updateMany',
    'deleteMany',
    'aggregate',
    'createOne',
    'readOne',
    'updateOne',
    'replaceOne',
    'deleteOne',
  ],
  BASE_METHODS: {
    createOne: 'insertOne',
    createMany: 'insertMany',
    readOne: 'findOne',
    readMany: 'find',
    replaceOne: 'replaceOne',
    updateOne: 'updateOne',
    updateMany: 'updateMany',
    deleteOne: 'deleteOne',
    deleteMany: 'deleteMany',
    aggregate: 'aggregate'
  },
  AUTHENTICATION: {
    JWT_USER_PROPS: ['_id', 'email'],
    GOOGLE: {
      MAPPER: {
        email: 'email',
        fullname: 'name'
      }
    },
    MICROSOFT: {
      MAPPER: {
        email: 'email',
        fullname: 'displayName'
      }
    },
    PASSPORT: {
      LOCAL_STRATEGY: {
        props: {
          username: 'email',
          password: 'password'
        }
      }
    }
  },
  MONGO_COLLECTION_CONFIG: {
    USERS: {
      collection: 'users',
      routePath: 'user',
      multiRoutePath: 'users',
      exclude: ['delete', 'replace']
    },
    ACCOUNTS: {
      collection: 'accounts',
      routePath: 'account',
      multiRoutePath: 'accounts'
    },
    TOKENS: {
      collection: 'tokens',
      skip: true
    },
    BLACKLIST: {
      collection: 'blacklist',
      skip: true
    },
    VERIFICATIONS: {
      collection: 'verifications',
      routePath: 'verification',
      multiRoutePath: 'verifications',
      exclude: ['delete', 'update', 'replace', 'read']
    }
  },
  ROUTES: {
    AUTH: [
      { route: 'signin', method: 'post', action: 'signin' },
      { route: 'signup', action: 'signup', method: 'post' },
      { route: 'signout', method: 'get', middlewares: ['token', 'passport$jwt'], action: 'signout' },
      { route: 'forgot_password', method: 'post', action: 'forgotPassword' },
      { route: 'reset_password', method: 'post', action: 'resetPassword' },
      { route: 'google', method: 'get', skipHandler: true, action: 'signin$google' },
      { route: 'link_google', method: 'get', middlewares: ['passport$jwt_query'], skipHandler: true, action: 'link$google' },
      { route: 'google/callback', method: 'get', skipHandler: false, action: 'callback$google' },
      { route: 'microsoft', method: 'get', skipHandler: true, action: 'signin$microsoft' },
      { route: 'link_microsoft', method: 'get', middlewares: ['passport$jwt_query'], skipHandler: true, action: 'link$microsoft' },
      { route: 'microsoft/callback', method: 'get', skipHandler: false, action: 'callback$microsoft' }
    ],
    CORE: {
      changePassword: { route: 'user/changePassword', action: 'changePassword' },
      accounts: { route: 'user/accounts', action: 'accounts' }
    }
  }
};

for (let key in CONFIG.BASE_METHODS) {
  const value = CONFIG.BASE_METHODS[key];
  CONFIG.BASE_METHODS[key] = { key, mongo: value };
}

module.exports = CONFIG;