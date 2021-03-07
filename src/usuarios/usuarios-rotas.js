const usuariosControlador = require('./usuarios-controlador');
const passport = require('passport');
const middlearesAUTH = require('./middlewares/auth');

module.exports = app => {
  app
    .route('/usuario/refresh-token')
    .post(
      middlearesAUTH.refresh,
      usuariosControlador.login
    );

  app
    .route('/usuario/login')
    .post(
      middlearesAUTH.local,
      usuariosControlador.login
    )

  app
    .route('/usuario/verify-email/:token')
    .get(middlearesAUTH.verifyEmail, usuariosControlador.verifyEmail);
  app
    .route('/usuario/logout')
    .post([middlearesAUTH.refresh, middlearesAUTH.bearer], usuariosControlador.logout)
  app
    .route('/usuario')
    .post(
      usuariosControlador.adiciona
    )
    .get(usuariosControlador.lista);

  app
    .route('/usuario/:id')
    .delete(passport
      .authenticate('bearer', { session: false }),
      usuariosControlador.deleta
    );
};
