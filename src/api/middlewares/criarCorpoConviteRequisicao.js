module.exports = (InstituicaoFacade, UsuarioFacade, AdminService) => {
    const Facade = require("../facade")
    const { adminAssinatura: admin, instituicaoAssinatura: instituicaoAssinatura } = require("../../config/privilegios")
    const ServiceError = require("../err/ServiceError")
    const log = require("../log")

    const instituicaoFacade = InstituicaoFacade || Facade.InstituicaoFacade
    const usuarioFacade = UsuarioFacade || Facade.UsuarioFacade
    const adminService = AdminService || require("../services").AdminService

    const middleware = async (req, res, next) => {
        const { client, roles } = req.locals

        log.info("processando convite email como idook admin")
        if (roles.assinatura == admin.assinatura) {
            try {
                const idook = await adminService.obterPorId(client.id)
                req.body.geradoPor = idook.email
                return next()
            } catch (error) {
                if (error instanceof ServiceError) return next(error)
                next(new ServiceError(error.message, 500, "Ocorreu um erro. Tente novamente mais tarde."))
            }
        }

        log.info("iniciando o processamento de convite email como instituicao ")
        if (roles.assinatura == instituicaoAssinatura.assinatura) {
            try {
                const instituicao = await instituicaoFacade.obterPorId(client.instituicaoId)

                log.info("processando convite email como instituicao master")
                // duas possibilidades, o master ou o admin
                if (client.id == instituicao._id) {
                    req.body.geradoPor = instituicao.email
                    req.body.instituicaoId = client.id
                    return next()
                }

                log.info("processando convite email como instituicao admin")
                if (client.instituicaoId == instituicao._id) {

                    const adminUsuario = await usuarioFacade.obterPorId(client.id)
                    if (!adminUsuario.email) throw "o usuario não possui um email"

                    req.body.geradoPor = adminUsuario.email
                    req.body.instituicaoId = client.instituicaoId
                    return next()
                }

                next(new ServiceError("O usuario não possui permissao para essa ação", 401, "Não autorizado."))

            } catch (error) {
                if (error instanceof ServiceError) return next(error)
                next(new ServiceError(error.message, 500, "Ocorreu um erro. Tente novamente mais tarde."))
            }
        }
    }
    return middleware
}