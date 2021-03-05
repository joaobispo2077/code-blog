const jwt = require('jsonwebtoken');
const blacklist = require('./blacklist');


const { promisify } = require('util');
const existsAsync = promisify(blacklist.exists).bind(blacklist);
const setAsync = promisify(blacklist.set).bind(blacklist);

const { createHash } = require('crypto');

const _generateHashToken = (token) => {
  return createHash('sha256').update(token).digest('hex');
}

module.exports = {
  addToken: async token => {
    const expiresDate = jwt.decode(token).exp;
    const tokenHash = _generateHashToken(token);
    await setAsync(tokenHash, '');
    blacklist.expireat(tokenHash, expiresDate);
  },
  verifyToken: async token => {
    const tokenHash = _generateHashToken(token);
    const result = await existsAsync(tokenHash); // if exist return 1, if not return 0
    return result === 1;
  }
}