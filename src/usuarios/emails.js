const nodemailer = require('nodemailer');

class Email {
  async sendEmail() {
    const accountTest = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      auth: accountTest
    });
    const info = await transporter.sendMail(this);

    console.log('URL:' + nodemailer.getTestMessageUrl(info));
  }
}

class EmailVerifier extends Email {
  constructor(user, url) {
    super();
    this.from = '"Blog do Código"<noreply@blogdocodigo.com.br>';
    this.to = user.email;
    this.from = 'Verificação de E-mail';
    this.text = `Olá! Verifique o seu e-mail aqui: ${url}`
    this.html = `<h1>Olá!</h1> <p> Verifique o seu e-mail aqui: <a href=${url}>${url}</a></p>`
  }
}
module.exports = { EmailVerifier };

// {
//   from: '"Blog do Código"<noreply@blogdocodigo.com.br>',
//   to: user.email,
//   subject: 'Teste de e-mail',
//   text: 'Olá! Este é um e-mail de teste!',
//   html: '<h1>Olá!</h1> <p> Este é um e-mail de teste!</p>'
// }