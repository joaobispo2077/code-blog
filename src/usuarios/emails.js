const nodemailer = require('nodemailer');

async function configurateProductionAccount() {
  return {
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    secure: true
  };
}
async function configurateTestAccount() {
  const accountTest = await nodemailer.createTestAccount();
  return {
    host: 'smtp.ethereal.email',
    auth: accountTest
  };
}

async function generateEmailConfig() {
  const emailConfigs = {
    dev: await configurateTestAccount(),
    production: await configurateProductionAccount()
  }

  const emailConfig = emailConfigs[process.env.NODE_ENV] === 'production' ? emailConfigs[process.env.NODE_ENV] : emailConfigs['dev'];

  return emailConfig;
}
class Email {
  async sendEmail() {
    const emailConfig = await generateEmailConfig();
    const transporter = nodemailer.createTransport(emailConfig);
    const info = await transporter.sendMail(this);

    if (!process.env.NODE_ENV !== 'production')
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