const postsControlador = require('./posts-controlador');
const passport = require('passport');
const { middlearesAUTH } = require('../usuarios');
const authorization = require('../middlewares/authorization');
module.exports = app => {
  app
    .route('/post')
    .get(postsControlador.lista)
    .post(
      middlearesAUTH.bearer,
      postsControlador.adiciona
    );

  app.route('/post/:id')
    .get(
      middlearesAUTH.bearer,
      postsControlador.obterDetalhes
    )
    .delete(
      middlearesAUTH.bearer,
      postsControlador.remover
    )
};
