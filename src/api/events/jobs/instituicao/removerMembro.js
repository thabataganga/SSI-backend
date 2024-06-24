const MembroUsecase = require("../../../usecases/InstituicaoMembrosUsecase")
const InstituicaoFacade = require("../../../facade/InstituicaoFacade")()
const appEvent = require("../../appEvent")
const log = require("../../../log")
/**
 * 
 * @param {UsuarioModel} entidade 
 */
module.exports = async(entidade, retry = 0) => {
    log.info("tentando remover membro via evento id: {} ", entidade._id)
    try {
       const instituicao = await InstituicaoFacade
        .obterPorId(entidade.instituicoes.instituicao_id)

        await MembroUsecase.deletar(instituicao, entidade._id)

        log.sucess(`Membro email {} ${entidade.email.slice(0,3)}****${entidade.email.split("@")[1]} REMOVIDO com sucesso`)
    } catch (error) {
        log.error(`[EVENTO] Falha ao tentar remover um membro, detalhes: `, error.message || message)
        if (error.status && error.status != 409) {
            const ACTION = 'removerMembro'
            return appEvent.emit("usuario", `REPETIR-${ACTION}-${+retry + 1}`, entidade)
        }
        if (error.status==409) return console.log("[STATUS] Membro já deletado!")
        console.error(error)
    }
}