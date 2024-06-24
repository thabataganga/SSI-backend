const log = require("../log/index");

const SMTPtrasport = require("../../config/nodemailerConfig");
const emailTemplate = require("../templates/email/basico");
const conviteEmailTemplate = require("../templates/email/convite");
const bemVindoEmailTemplate = require("../templates/email/bemVindo");
const recuperarEmailTemplate = require("../templates/email/recuperarSenha");
const createEmailTransport = async (destinatario, assunto, message) => {
  // Create a SMTP transporter object
  log.info(`solicitação de envio de email -- destinatario ${destinatario}`);
  try {
    let info = await SMTPtrasport.sendMail(
      emailTemplate({
        destinatario: destinatario,
        assunto: `Sindpd Digital | ${assunto}`,
        text: "mensagem de teste as " + new Date(),
        html: `
                <div>
                    <p>${message}</p>
                </div>
            `,
      })
    );
    log.sucess(
      `Email enviado com sucesso via <${process.env.EMAIL_USER}> com o  host: ${process.env.SMTP_HOST} `
    );
    log.sucess(info.response);
  } catch (error) {
    log.error(error.message);
  }
};

module.exports = {
  send: createEmailTransport,
};
module.exports = (event) => {
  event.on("usuario", (operacao, { email }) => {
    const url = `https://sindpd.idook.com.br/`;
    if (operacao == "CRIAR")
      createEmailTransport(
        email,
        "Sua conta está pronta!",
        bemVindoEmailTemplate(url)
      );
  });
  event.on("recuperarSenha", (usuario, link) => {
    const url = `${link}/recuperar/codigo/${usuario.codigo}`;
    console.log(usuario.email);
    console.log(usuario.codigo);
    createEmailTransport(
      usuario.email,
      "Recuperar Senha",
      recuperarEmailTemplate(usuario.codigo, url, usuario.email)
      //`Código para recuperar senha: ${usuario.codigo}`
    );
  });
  event.on("convite", (convite) => {
    try {
      const destinatario = convite.email;
      const instituicaoNome = convite.instituicaoNome;
      const cadastroUrl = convite.url;
      const codigoConvite = convite.codigo;

      if (!destinatario) throw "É requirido um destinatario";
      if (!instituicaoNome) throw "É requirido o nome da instituicao";
      if (!cadastroUrl) throw "É requirido o cadastro da url";
      if (!codigoConvite) throw "É requirido o código do convite";

      createEmailTransport(
        destinatario,
        "Sua ID Digital está pronta!",
        conviteEmailTemplate(cadastroUrl, instituicaoNome, codigoConvite)
      );
    } catch (error) {
      console.error(error);
      log.error("[CONVITE] " + error);
    }
  });
};
