module.exports = (instituicaoFacade) => {
  const usuarioAssinatura = require("../../config/privilegios/usuario_assinatura").assinatura;
  const instituicaoAssinatura = require("../../config/privilegios/instituicao_assinatura").assinatura;
  const InstituicaoFacade = instituicaoFacade || require("../facade/InstituicaoFacade")()
  const log = require("../log");

  const handle = async (req, res, next) => {

    if (req.locals.access) return next();

    const { roles, client } = req.locals
    const instituicaoId = req.params.id

    if (roles.assinatura == instituicaoAssinatura) {

      log.info("Processando autorização em modo instituicao...master")
      if (client.id == instituicaoId || client.instituicaoId == client.id) {
        req.locals.access = "INSTITUICAO"
        return next()
      }
      if (client.instituicaoId) {
        log.info("Processando autorização em modo instituicao...admin")
        try {
          const usuarioAdmin = await InstituicaoFacade
            .obterUsuarioAdmin(client.id, client.instituicaoId)

          req.locals.access = "INSTITUICAO_ADMIN"
          return next()
        } catch (error) {
          console.error(error)
        }
      }

      return next()
    }

    next();
  };

  return handle
}
