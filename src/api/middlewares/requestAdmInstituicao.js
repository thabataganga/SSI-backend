const usuarioDto = require("../controllers/utils/filterResponse")

const ServiceError = require("../err/ServiceError")
const log = require("../log")

module.exports = async (req, res, next) => {
    const { client, roles, entidade } = req.locals

    log.info("processando regras da requisicao")
    if (entidade.instituicoes.instituicao_id == client.instituicaoId) {
        req.body = Object.assign(req.body, usuarioDto(req.body, ["nome", "cpf", "email", "tipo_de_usuario", "status"]))
        if (req.body.dados_sensiveis) req.body.dados_sensiveis = Object
        .assign(req.body, usuarioDto(req.body.dados_sensiveis, ["whatsapp", "endereco", "genero"]))
 
        return next()
    }

    next(new ServiceError("O usuario não é da mesma instituicao", 400, "O usuario não pertence a sua instituicao"))
}