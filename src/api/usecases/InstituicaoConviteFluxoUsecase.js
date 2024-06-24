const ConviteService = require("../services/ConviteService")()
const ServiceError = require("../err/ServiceError")
const AppEvent = require("../events/appEvent")



/**
 * 
 * @param {ConviteService} conviteService conviteService para o convite
 * @returns 
 */
module.exports = (conviteService = ConviteService) => {
    class ConviteUseCase {
        /**
         * 
         * @param {Model} entidade instance of model
         * @param {Jwt} jwt json web token
         * @param {EventEmitter?} event 
         * @returns 
         */

        static async criar(entidade, jwt) {
            try {
                return await conviteService.criar(jwt, "INSTITUICAO", "ADMIN", entidade)

            } catch (error) {
                if (error instanceof ServiceError) throw error
                throw new ServiceError(error.message || error, 500, "Ocorreu um erro. 2")
            }

        }

        /**
         * 
         * @param {Model} entidade instance of model
         * @param {Function}  callback
         * @param {EventEmitter?} event 
         * @returns 
         */
        static async resgatar(entidade, criar, EventEmitter = AppEvent) {
            const { codigo, token, email } = entidade

            entidade.status = "ATIVO"

            try {
                const instituicaoId = await conviteService.validarCodigo(token, codigo, email)

                const instituicao = await criar(entidade, instituicaoId)

                await conviteService.sucesso(instituicaoId)

                return instituicao
            } catch (error) {
                if (error instanceof ServiceError) throw error
                throw new ServiceError(error.message || error, 500, "Ocorreu um erro.")
            }
        }

    }
    return ConviteUseCase
}