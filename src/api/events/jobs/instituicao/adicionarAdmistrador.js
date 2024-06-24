const InstuicaoFacade = require("../../../facade/InstituicaoFacade")();
const log = require("../../../log");
const appEvent = require("../../../events/appEvent");
/**
 *
 * @param {UsuarioModel} entidade
 */
module.exports = async (entidade) => {
  log.info("tentando adicionar admistrador via evento id: {} ", entidade._id);
  try {
    const admin = await InstuicaoFacade.adicionarAdmistrador(entidade);
    log.sucess(
      `Admistrador email {} ${admin.email.slice(0, 3)}****${
        admin.email.split("@")[1]
      } adicionado com sucesso`
    );
  } catch (error) {
    log.error(
      `[EVENTO] Falha ao tentar adiconar um admistrador, detalhes: `,
      error.message || message
    );
    if (error.status && error.status != 409) {
      const ACTION = "adicionarAdmistrador";
      return appEvent.emit(
        "usuario",
        `REPETIR-${ACTION}-${+retry + 1}`,
        entidade
      );
    }
    if (error.status == 409)
      return console.log("[STATUS] Admistrador já adicionado");
    console.error(error);
  }
};
