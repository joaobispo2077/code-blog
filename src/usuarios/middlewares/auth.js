const passport = require('passport');

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
  }

}