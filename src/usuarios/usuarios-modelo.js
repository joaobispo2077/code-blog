const usuariosDao = require('./usuarios-dao');
const { InvalidArgumentError } = require('../erros');
const validacoes = require('../validacoes-comuns');

const bcrypt = require('bcrypt');

class Usuario {
  constructor(usuario) {
    this.id = usuario.id;
    this.nome = usuario.nome;
    this.email = usuario.email;
    this.hashPassword = usuario.hashPassword;
    this.verified_email = usuario.verified_email;

    this.valida();
  }

  async adiciona() {
    if (await Usuario.buscaPorEmail(this.email)) {
      throw new InvalidArgumentError('O usuário já existe!');
    }

    await usuariosDao.adiciona(this);
    const { id } = await usuariosDao.buscaPorEmail(this.email);
    this.id = id;
  }

  async addPassword(password) {
    validacoes.campoStringNaoNulo(password, 'senha');
    validacoes.campoTamanhoMinimo(password, 'senha', 8);
    validacoes.campoTamanhoMaximo(password, 'senha', 64);
    this.hashPassword = await Usuario.generatehashPasswordByPassword(password);
  }

  valida() {
    validacoes.campoStringNaoNulo(this.nome, 'nome');
    validacoes.campoStringNaoNulo(this.email, 'email');
  }

  async verifyEmail(email) {
    this.verified_email = true;
    await usuariosDao.verifyEmail(this.verified_email, this.id);
  }


  async deleta() {
    return usuariosDao.deleta(this);
  }

  static async buscaPorId(id) {
    const usuario = await usuariosDao.buscaPorId(id);
    if (!usuario) {
      return null;
    }

    return new Usuario(usuario);
  }

  static async buscaPorEmail(email) {
    const usuario = await usuariosDao.buscaPorEmail(email);
    if (!usuario) {
      return null;
    }

    return new Usuario(usuario);
  }

  static lista() {
    return usuariosDao.lista();
  }

  static generatehashPasswordByPassword(password) {
    const cost = 12; // 2 elevate to 12
    return bcrypt.hash(password, cost);
  }
}

module.exports = Usuario;
