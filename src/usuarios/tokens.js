const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const moment = require('moment');

const allowlistRefreshToken = require('../../redis/allowlist-refresh-tokens');

const _generateTokenJWT = (id, [expirationTime,
  expirationUnit]) => {
  const payload = { id };

  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, {
    expiresIn: expirationTime + expirationUnit
  });
  return token;
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

module.exports = {
  access: {
    expiration: [15, 'm'],
    create(id) {
      return _generateTokenJWT(id, this.expiration);
    }
  },
  refresh: {
    list: allowlistRefreshToken,
    expiration: [5, 'd'],
    create(id) {
      return generateOpaqueToken(id, this.expiration, this.list);
    }
  }
}