const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const moment = require('moment');

const allowlistRefreshToken = require('../../redis/allowlist-refresh-tokens');
const blocklistAccessToken = require('../../redis/blocklist-access-token');
const { InvalidArgumentError } = require('../erros');

const _verifyBlocklist = async (token, blocklist, tokenName) => {
  const tokenExistsInBlacklist = await blocklist.verifyToken(token);
  if (tokenExistsInBlacklist)
    throw new jwt.JsonWebTokenError(`Invalid ${tokenName} By Logout`);
}

const _generateTokenJWT = (id, [expirationTime,
  expirationUnit]) => {
  const payload = { id };

  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, {
    expiresIn: expirationTime + expirationUnit
  });
  return token;
}

const _verifyJWToken = async (token, blocklist, tokenName) => {
  await _verifyBlocklist(token, blocklist, tokenName);
  const payload = jwt.verify(token, process.env.SECRET_KEY_JWT);
  return payload.id;
}

const generateOpaqueToken = async (
  id,
  [expirationTime,
    expirationUnit],
  list
) => {
  const opaqueToken = crypto.randomBytes(24).toString('hex');
  const expireDate = moment().add(expirationTime, expirationUnit).unix();
  await list.addKey(opaqueToken, id, expireDate);
  return opaqueToken;
}

const _verifyOpaqueToken = async (token, allowlist, tokenName) => {
  hasToken(token, tokenName);
  const id = await allowlist.getValueByKey(token);
  isValidToken(id, tokenName);
  return id;
}

function isValidToken(id, tokenName) {
  if (!id)
    throw new InvalidArgumentError(`Invalid ${tokenName}`);
}

function hasToken(token, tokenName) {
  if (!token)
    throw new InvalidArgumentErrorentError(`${tokenName} token is required`);
}


module.exports = {
  access: {
    name: 'access token',
    list: blocklistAccessToken,
    expiration: [15, 'm'],
    create(id) {
      return _generateTokenJWT(id, this.expiration);
    },
    verify(token) {
      return _verifyJWToken(token, this.list, this.name);
    }
  },
  refresh: {
    name: 'refresh token',
    list: allowlistRefreshToken,
    expiration: [5, 'd'],
    create(id) {
      return generateOpaqueToken(id, this.expiration, this.list);
    },
    verify(token) {
      return _verifyOpaqueToken(token, this.list, this.name);
    }
  }
}