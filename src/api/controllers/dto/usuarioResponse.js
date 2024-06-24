const ServiceError = require("../../err/ServiceError")

const getByUser = entity => entity

const getByAdmin = entity => {
    const {
        nome, tipo_de_usuario, email, status, privacidade,
        dados_sensiveis: {
            whatsapp, genero, endereco
        }
    } = entity
    return {
        nome, tipo_de_usuario, email, status, privacidade,
        dados_sensiveis: {
            whatsapp, genero, endereco
        }
    }
}

const getByIdook = entity => entity

/**
 * 
 * @param {string} requestId id da token de requisicao
 * @param {Object} entity entidade 
 * @param {ENUM} USER_TYPE tipo de usuario
 * @returns 
 */
module.exports = (requestId, entity, USER_TYPE) => {
    if (USER_TYPE == "IDOOK") return getByIdook(entity)
    if (USER_TYPE == "ADMIN") return getByAdmin(entity)
    if (USER_TYPE == "USUARIO" && requestId == entity._id) return getByUser(entity)
    throw new ServiceError(
        "Nenhum tipo de usuario valido",
        401,
        "O usurio não possui permissão para acessar o recurso"
    )
}
