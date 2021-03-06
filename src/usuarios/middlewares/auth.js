const passport = require('passport');
const Usuario = require('../usuarios-modelo');
const { InvalidArgumentError } = require('../../erros');
const allowlistRefreshToken = require('../../../redis/allowlist-refresh-tokens');
const tokens = require('../tokens');

async function verifyRefreshToken(refreshToken) {
  if (!refreshToken) throw new InvalidArgumentError('Refresh token is required');

  const id = await allowlistRefreshToken.getValueByKey(refreshToken);
  if (!id) throw new InvalidArgumentError('Invalid refresh token');

  return id;
}

async function invalidateRefreshToken(refreshToken) {
  await allowlistRefreshToken.deleteByKey(refreshToken);
}

module.exports = {
  local: (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err && err.name === "InvalidArgumentError")
        return res.status(401).json({ error: err.message });

      if (err) return res.status(500).json({ error: err.messaage });

      if (!user) return res.status(401).json();

      req.user = user;
      return next();
    })(req, res, next)
  },
  bearer: (req, res, next) => {
    passport.authenticate(
      'bearer',
      { session: false },
      (err, user, info) => {
        if (err && err.name === 'JsonWebTokenError')
          return res.status(401).json({ error: err.message });

        if (err && err.name === 'TokenExpiredError')
          return res.status(401).json({ error: err.message, expiredAt: err.expiredAt });

        if (err) return res.status(500).json({ error: err.message });

        if (!user) return res.status(401).json();

        req.user = user;
        req.token = info.token;
        return next();
      }
    )(req, res, next)
  },
  refresh: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const id = await tokens.refresh.verify(refreshToken);
      await invalidateRefreshToken(refreshToken);
      req.user = await Usuario.buscaPorId(id);
      return next();
    }
    catch (err) {
      if (err.name === 'InvalidArgumentError')
        return res.status(401).json({ error: err.message });

      return res.status(500).json({ error: err.message });
    }
  }

}