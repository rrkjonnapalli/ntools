const { ulid } = require('ulid');
const config$api = require('../config/api.config');
const config$mongo = require('../config/mongo.config');
const { store$, map$ } = require('../utils');
const _ = require('lodash');

const generateHandlers = (opts) => {
  const cn$users = config$mongo.MY_ACCOUNTS.COLLECTIONS.USERS;
  const cn$accounts = config$mongo.MY_ACCOUNTS.COLLECTIONS.ACCOUNTS;
  const cn$tokens = config$mongo.MY_ACCOUNTS.COLLECTIONS.TOKENS;
  const mapper$user = config$api.AUTHENTICATION[opts.type].MAPPER;

  const createUser = async (_account) => {
    const user = await store$(cn$users).findOne({ email: _account.email });
    if (user) { return { userId: user._id, user }; }
    const newUser = {
      ...map$(_account, mapper$user),
      _id: ulid(),
      created_at: new Date()
    };
    const { insertedId: userId } = await store$(cn$users).insertOne(newUser);
    return { userId, user: newUser };
  };

  const upsertAccount = async (_account, parent_id) => {
    const newAccount = { ..._account, _id: ulid(), created_at: new Date() };
    const updatedAccount = await store$(cn$accounts).findOneAndUpdate({ email: _account.email }, {
      $set: { parent_id, updated_at: new Date() },
      $setOnInsert: newAccount
    }, { upsert: true, returnDocument: 'after' });
    return { accountId: updatedAccount._id, account: updatedAccount };
  };

  const updateTokens = async (account_id, data) => {
    const token = { _id: ulid(), account_id, ...data, created_at: new Date() };
    return store$(cn$tokens).insertOne(token);
  };

  const createOrGetUser = async (_account, info = {}) => {
    const account = await store$(cn$accounts).findOne({ email: _account.email });
    if (account) {
      // has account, find or create user;
      const _user = await store$(cn$users).findOne({ _id: account.parent_id });
      if (_user) {
        await updateTokens(account._id, { ...info, user_id: _user._id });
        return _user;
      }
      // user removed, need to validate why, but create user for current login and update account
      console.error(`invalid parent ID in account - ${account.parent_id}`);
    }
    // no account, create new user and account
    const { userId, user } = await createUser(_account);
    const { accountId } = await upsertAccount(_account, userId);
    await updateTokens(accountId, { ...info, user_id: userId });
    return user;
  }

  return {
    createUser,
    upsertAccount,
    updateTokens,
    createOrGetUser
  };
}



module.exports = {
  google: generateHandlers({ type: 'GOOGLE' }),
  microsoft: generateHandlers({ type: 'MICROSOFT' }),
};