const InstituicaoFacade = require("../../../facade/InstituicaoFacade")();
const log = require("../../../log");
const appEvent = require("../../appEvent");

/**
 *
 * @param {UsuarioModel} entidade
 */
module.exports = async (entidade, retry = 0) => {
  log.info("tentando adicionar admistrador via evento id: {} ", entidade._id);
  try {
    const instituicao = await InstituicaoFacade.obterPorId(
      entidade.instituicoes.instituicao_id
    );
    await InstituicaoFacade.removerAdmistrador(entidade._id, instituicao);

    log.sucess(
      `Adm email {} ${entidade.email.slice(0, 3)}****${
        entidade.email.split("@")[1]
      } REMOVIDO com sucesso`
    );
  } catch (error) {
    log.error(
      `[EVENTO] Falha ao tentar remover um admistrador, detalhes: `,
      error.message || message
    );
    if (error.status && error.status != 409) {
      const ACTION = "removerAdmistrador";
      return appEvent.emit(
        "usuario",
        `REPETIR-${ACTION}-${+retry + 1}`,
        entidade._id
      );
    }
    if (error.status == 409)
      return console.log("[STATUS] Admistrador já removido");
    console.error(error);
  }
};
