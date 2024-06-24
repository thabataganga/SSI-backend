const adicionarAdmistrador = require("./jobs/instituicao/adicionarAdmistrador")
const adicionarColaborador = require("./jobs/instituicao/adicionarColaborador")
const adicionarMembro = require("./jobs/instituicao/adicionarMembro")
const removerColaborador = require("./jobs/instituicao/removerColaborador")
const removerAdmistrador = require("./jobs/instituicao/removerAdmistrador")
const removerMembro = require("./jobs/instituicao/removerMembro")

const log = require('../log/index')


module.exports = (event) => {
    event.on("usuario", (operacao, usuarioDados) => {
        log.info("[EVENTO] | [USUARIO]", "operacao: ", operacao)

        if (operacao.includes('REPETIR')) {
            const [_, comando, tentativas] = operacao.split("-")
            if (+tentativas < 3) {
                return setTimeout(() => actions.handle(comando, usuarioDados, tentativas), (60 * +tentativas) * 1000)
            }

            return log.info(`[EVENTO][ERROR] Não foi possivel adicionar o colaborador, detalhes: maximo de tentativas feitas, id: ${usuarioDados.id}`)
        }

        actions.handle(operacao, usuarioDados)

    })

}


const criar = async entidade => {
    if (entidade.tipo_de_usuario == "COLABORADOR") {
        await adicionarColaborador(entidade)
        await adicionarAdmistrador(entidade)
    }
    if (entidade.tipo_de_usuario == "ASSOCIADO" || entidade.tipo_de_usuario == "FILIADO") {
        await adicionarMembro(entidade)
    }
}

const atualizar = async (entidade) => {
    /**
     * aqui definimos um historico, para evitar repetições desnecessárias
     * poupando assim recurso do servidor
     * esse histórico não tem nada haver com histórico de alteração
     */
    const { historico = {} } = entidade

    delete entidade.historico


    if (entidade.tipo_de_usuario == "COLABORADOR") {
        await adicionarColaborador(entidade)
        await adicionarAdmistrador(entidade)
    }

    if (entidade.tipo_de_usuario == "ASSOCIADO" || entidade.tipo_de_usuario == "FILIADO") {
        await adicionarMembro(entidade)
    }

    if (historico.tipo_de_usuario == "ASSOCIADO") {
        await removerMembro(entidade)
    }

    if (historico.tipo_de_usuario == "COLABORADOR") {
        await removerAdmistrador(entidade)
        await removerColaborador(entidade)
    }

}


const actions = {

    CRIAR: criar,
    ATUALIZAR: atualizar,

    /** retry */
    adicionarAdmistrador,
    adicionarColaborador,
    adicionarMembro,
    removerColaborador,
    removerAdmistrador,
    removerMembro,

    handle(operacao, entidade, tentativas) {
        if (this[operacao]) return this[operacao](entidade, tentativas)
        console.error("[EVENTO][ERROR] Não foi possivel adicionar - evento: ", operacao)
    }
}