const ColaboradorUsecase = require("../../../usecases/InstituicaoColaboradoresUsecase")
const InstituicaoFacade = require("../../../facade/InstituicaoFacade")()
const appEvent = require("../../../events/appEvent")
const log = require("../../../log")
/**
 * 
 * @param {UsuarioModel} entidade 
 */
module.exports = async(entidade, retry = 0) => {
    log.info("tentando adicionar colaborador via evento id: {} ", entidade._id)
    try {
       const instituicao = await InstituicaoFacade
        .obterPorId(entidade.instituicoes.instituicao_id)

        await ColaboradorUsecase.criar(instituicao, {
            _id : entidade._id,
            usuario_id: entidade._id
        })

        log.sucess(`Colaborador email {} ${entidade.email.slice(0,3)}****${entidade.email.split("@")[1]} adicionado com sucesso`)
    } catch (error) {
        log.error(`[EVENTO] Falha ao tentar adiconar um colaborador, detalhes: `, error.message || message)
        if (error.status && error.status != 409) {
            const ACTION = 'adicionarColaborador'
            return appEvent.emit("usuario", `REPETIR-${ACTION}-${+retry + 1}`, entidade)
        }
        if (error.status==409) return console.log("[STATUS] Colaborador já adicionado")
        console.error(error)
    }
}