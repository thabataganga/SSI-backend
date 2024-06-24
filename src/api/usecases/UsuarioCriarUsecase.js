const ServiceError = require("../err/ServiceError")
const { buildInstituicao,  buildTipoConvite, buildTipo} = require("./UsuarioBuildTypes")

module.exports = class {
    /**
     * 
     * @param {Usuario} requestUsuario request body
     * @param {Function} save  callback de salvar
     * @returns 
     */
    static criar(requestUsuario) {
        try {

            requestUsuario.instituicoes = buildInstituicao(
                requestUsuario.instituicoes.instituicao_id,
                requestUsuario.instituicoes.instituicao_tipo,
                requestUsuario.instituicoes.vinculo
            )


            requestUsuario.tipo_de_usuario = buildTipo(
                requestUsuario.tipo_de_usuario,
                requestUsuario.instituicoes.instituicao_tipo,
            )


            return requestUsuario
        } catch (error) {
            console.error(error)
            if (error.code && error.code == 11000) {
                throw new ServiceError(error.message, 409, `Campos já existentes`)
            }
            throw new ServiceError(error.message || error, 400, "Por favor, verifique os dados",)
        }

    }
}