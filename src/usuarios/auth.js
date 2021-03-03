const passport = require('passport');
const LocalStrategy = require('passport-local');
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