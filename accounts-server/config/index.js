const secrets$google = require('../secrets/google.json');
const secrets$microsoft = require('../secrets/microsoft.json');
const CONFIG = {
  SERVER: {
    PORT: process.env.PORT || 4298,
    HOST: process.env.HOST || '0.0.0.0',
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'iamnothereyouarenowhere',
    OPTIONS: {
      SIGN: { expiresIn: '1h' },
      VERIFY: {}
    },
    DEFAULT_EXP_TIME_MS: 60 * 60 * 1000
  },
  AUTH: {
    GOOGLE: {
      CONFIG: {
        CLIENT_ID: secrets$google.CLIENT_ID,
        CLIENT_SECRET: secrets$google.CLIENT_SECRET,
        CALLBACK_URL: secrets$google.REDIRECT_URL,
        ACCESS_TYPE: 'offline'
      },
      SCOPES: [
        'email',
        'openid',
        'profile',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/tasks'
      ]
    },
    MICROSOFT: {
      CONFIG: {
        CLIENT_ID: secrets$microsoft.CLIENT_ID,
        CLIENT_SECRET: secrets$microsoft.CLIENT_SECRET,
        CALLBACK_URL: secrets$microsoft.REDIRECT_URL,
        ACCESS_TYPE: 'offline'
      },
      SCOPES: [
        'user.read',
        'openid',
        'email',
        'profile',
        'offline_access',
        'Calendars.ReadWrite',
        'Calendars.ReadWrite.Shared',
        'Notes.ReadWrite.All',
        'Tasks.ReadWrite',
        'Tasks.ReadWrite.Shared'
      ]
    }
  },
  MONGO: {
    URL: 'mongodb://localhost:27017/my_accounts'
  }
}

module.exports = CONFIG;