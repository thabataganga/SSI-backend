const jwtMiddleware = require("../../config/JwtConfig")
const ServiceError = require("../err/ServiceError")
const log = require("../log")
const admin = require("./admistradorPermissao")

class AuthorizationHandler extends Array {


    /**
     * 
     * @returns retorna um middleware express com nivel de segurança admistrador,
     * para liberar o acesso a mais entidades, é necessario utilizar o metodo liberar
     */
    builder() {
        this.push(forbidden)
        return this
    }

    constructor() {
        super(jwtMiddleware, admin)
    }
    /**
     * 
     * @param {handler} tiposDeAcessos controle de autorizacao para nivel de acesso
     * @returns AuthorizationHandler
     */
    liberar(...args) {
        this.push(args)
        return this
    }

    public() {
        /**
         * sobrescreve a autorização padrao retornando num novo elemento
         */
        this.splice(0, 1, publicJwt)

        return this
    }
}

const publicJwt = (req, res, next) => {
    
    if (!req.get("authorization") && req.method == "GET") {
        req.locals.access = "PUBLIC"
        return next()
    }

    return jwtMiddleware(req, res, next)
}

const forbidden = (req, res, next) => {
    if (req.locals.access) return next(log.sucess(`Autorizado como: ${req.locals.access}`))
    log.error("Esgotada as tentativas de autorizacao")
    next(new ServiceError(
        "Sem permissão para acessar o recurso, contate o admistrador.",
        401,
        "Não autorizado, caso isso seja um erro, por favor contate o admistrador."))
}

module.exports = AuthorizationHandler