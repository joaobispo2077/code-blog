const postsControlador = require('./posts-controlador');
const passport = require('passport');
const { middlearesAUTH } = require('../usuarios');
module.exports = app => {
  app
    .route('/post')
    .get(postsControlador.lista)
    .post(
      middlearesAUTH.bearer,
      postsControlador.adiciona
    );
};
