const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local');
const BearerStrategy = require('passport-http-bearer');

const bcrypt = require('bcrypt');

const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError } = require('../erros');

const userAlreadyExists = (user) => {
  if (!user) throw new InvalidArgumentError("Usuário inexistente.");
}

const verifyPassword = async (password, hashPassword) => {
  const isValidPassword = await bcrypt.compare(password, hashPassword);
  if (!isValidPassword) throw new InvalidArgumentError("E-mail ou senha inválidos");
}

passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'senha',
    session: false,
  },
  async (email, senha, done) => {
    try {
      const usuario = await Usuario.buscaPorEmail(email);
      userAlreadyExists(usuario);

      await verifyPassword(senha, usuario.hashPassword);

      done(null, usuario);
    }
    catch (err) {
      done(err);
    }
  })
)

passport.use(
  new BearerStrategy(
    async (token, done) => {
      try {
        const payload = jwt.verify(token, process.env.SECRET_KEY_JWT);
        const user = await Usuario.buscaPorId(payload.id);
        done(null, user);

      }
      catch(err) {
        done(err);
      }
    }
  )
)