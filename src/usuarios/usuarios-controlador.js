const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const tokens = require('./tokens');
const { EmailVerifier } = require('./emails');

const _getAddress = (route, token) => {
  const baseURL = process.env.BASE_URL;
  return `${baseURL}/${route}/${token}`;
}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        verified_email: false
      });

      await usuario.addPassword(senha);
      await usuario.adiciona();

      const token = tokens.verifyEmail.create(usuario.id);
      const URL = _getAddress('usuario/verify-email', token);

      const emails = new EmailVerifier(usuario, URL);
      emails.sendEmail().catch(console.log);
      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },
  login: async (req, res) => {
    const accessToken = tokens.access.create(req.user.id);
    const refreshToken = await tokens.refresh.create(req.user.id);
    res.set('Authorization', accessToken);
    res.status(200).json({ refreshToken });
  },
  logout: async (req, res) => {
    try {
      const token = req.token;
      await tokens.access.invalidate(token);
      return res.status(204).send();

    }
    catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  verifyEmail: async (req, res) => {
    try {
      const usuario = req.user;
      await usuario.verifyEmail();
      res.status(200).json({});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  }
};
