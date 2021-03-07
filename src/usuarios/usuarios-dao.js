const db = require('../../database')
const { InternalServerError } = require('../erros')

const { promisify } = require('util')
const dbRun = promisify(db.run).bind(db)
const dbGet = promisify(db.get).bind(db)
const dbAll = promisify(db.all).bind(db)

module.exports = {
  async adiciona(usuario) {
    try {
      await dbRun(
        `INSERT INTO usuarios (nome, email, hashPassword, verified_email) 
        VALUES (?, ?, ?, ?)`,
        [
          usuario.nome,
          usuario.email,
          usuario.hashPassword,
          usuario.emailVerificado
        ]
      )
    } catch (erro) {
      console.log(erro);
      throw new InternalServerError('Erro ao adicionar o usuário!')
    }
  },

  async buscaPorId(id) {
    try {
      return await dbGet('SELECT * FROM usuarios WHERE id = ?', [id])
    } catch (erro) {
      throw new InternalServerError('Não foi possível encontrar o usuário!')
    }
  },

  async buscaPorEmail(email) {
    try {
      return await dbGet('SELECT * FROM usuarios WHERE email = ?', [email])
    } catch (erro) {
      throw new InternalServerError('Não foi possível encontrar o usuário!')
    }
  },

  async lista() {
    try {
      return await dbAll('SELECT * FROM usuarios')
    } catch (erro) {
      throw new InternalServerError('Erro ao listar usuários!')
    }
  },

  async verifyEmail(verified_email, id) {
    try {
      await dbRun('UPDATE usuarios SET verified_email = ? WHERE id = ?', [
        verified_email, id
      ])
    } catch (erro) {
      throw new InternalServerError('Erro ao modificar a verficação de e-mail!')
    }
  },

  async deleta(usuario) {
    try {
      await dbRun('DELETE FROM usuarios WHERE id = ?', [usuario.id])
    } catch (erro) {
      throw new InternalServerError('Erro ao deletar o usuário')
    }
  }
}
