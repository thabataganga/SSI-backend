const log = require("../log")

const Crud = require("../services/utils/Crud").LoginCrud
const ServiceError = require("../err/ServiceError")
const crud = new Crud("instituicao")

/**
 * 
 * @param {Model} instituicaoModel model for instituicaoModel
 * @param {Model} usuarioModel model for user model
 * @param {JwtConstructor} jwt instance jwt
 * @returns 
 */
module.exports = (instituicaoModel, usuarioModel, jwt) => {
    const hasAdmin = async (email) => {
    
        const usuario = await usuarioModel.findOne({ email })
        if (!usuario) throw "Usuario não existe"

        const instituicao = await instituicaoModel
            .findById(usuario.instituicoes.instituicao_id)
            .populate("admistradores")

        if (!instituicao) throw "O usuario não possui uma instituicao"

        if (!instituicao
            .admistradores
            .find(async admin => admin._id == usuario._id)) throw "O usuario não é um admin"

        return usuario.instituicoes.instituicao_id
    }

    const hasMaster = async(email) => {
        const instituicao = await instituicaoModel.findOne({ email })
        if (!instituicao) throw "Instituicao não existe com o email"
        else return instituicao._id
    }
    


    return class  {
        static async auth(email, senha, entrar) {

            const STACK = []

            log.info("[LOGIN][PROCESSAMENTO...] Instituicao master")
            try {
               const instituicaoId =  await hasMaster(email)
                return await crud.entrar(instituicaoModel,  jwt, email, senha, instituicaoId)
    
            } catch (error) {
                STACK.push(["master", error.message || error])
            }

            log.info("[LOGIN][PROCESSAMENTO...] Instituicao admin")
            try {
               const instituicaoId =  await hasAdmin(email)
               return await crud.entrar(usuarioModel,  jwt, email, senha, instituicaoId)
      
            } catch (error) {
                STACK.push(["admin", error.message || error])
            }

            log.error(STACK)

            throw new ServiceError(STACK, 400, "Usuario ou senha invalida")
        }
    }
}