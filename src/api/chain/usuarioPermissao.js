const usuarioAssinatura =
  require("../../config/privilegios/usuario_assinatura").assinatura;
const log = require("../log");

module.exports = (req, res, next) => {
  if (req.locals.access) return next();

  const { roles, client } = req.locals;
  const { method } = req;

  const isConvite = req.params.codigo;

  log.info("Processando autorização em modo usuario");
  if (roles.assinatura == usuarioAssinatura) {
    if (isConvite && method == "POST") {
      req.locals.access = "CONVITE_INTITUICAO";
      return next();
    }

    if (client.id == req.params.usuario_id) {
      req.locals.access = "USUARIO";
      return next();
    }

    if (client.instituicaoId == req.params.instituicao_id) {
      req.locals.access = "USUARIO";
      return next();
    }
  }

  next();
};
