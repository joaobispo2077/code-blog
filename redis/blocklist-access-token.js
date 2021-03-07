const redis = require('redis');
const handleList = require('./handle-list');

const jwt = require('jsonwebtoken');
const blacklist = redis.createClient({ prefix: 'blacklist-acces-token:' });
const handleBlacklist = handleList(blacklist);

const { createHash } = require('crypto');

const _generateHashToken = (token) => {
  return createHash('sha256').update(token).digest('hex');
}

module.exports = {
  addToken: async token => {
    const expiresDate = jwt.decode(token).exp;
    const tokenHash = _generateHashToken(token);
    await handleBlacklist.addKey(tokenHash, '', expiresDate);
  },
  verifyToken: async token => {
    const tokenHash = _generateHashToken(token);
    return await handleBlacklist.verifyKey(tokenHash);
  }
}