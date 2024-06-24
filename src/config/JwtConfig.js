const Jwt = require('../api/modules/JwtModulo')
const ServiceError = require("../api/err/ServiceError")
const log = require('../api/log')

module.exports = function(req, res, next)  {
   const token  = req.get("authorization")
   try {
         const [role, payload ] = Jwt.Builder("VERIFICAR", { token })
         req.locals.client = payload.data
         req.locals.roles = role
         log.info(`Client id ${payload.data.id} autenticado!`)
         next()

   } catch (error) {
    throw new ServiceError(error.message, 401, "Não autorizado, caso isso seja um erro, por favor contate o admistrador")
   }
}