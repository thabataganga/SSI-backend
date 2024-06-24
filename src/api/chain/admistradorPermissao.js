const adminAssinatura = require("../../config/privilegios/admin_assinatura").assinatura
const log = require("../log")

module.exports = (req, res, next) => {
    if (req.locals.access) return next()

    log.info("Processando autorização em modo admistrador")

    const { roles, client } = req.locals
    const { method } = req
    
    if (roles.assinatura==adminAssinatura) {
        req.locals.access = "IDOOK"
    }

    next()
}
