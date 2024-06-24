
const ServiceError = require("../err/ServiceError")
const roles = require("../../config/privilegios/admin_assinatura")
const jwt = require("../modules/JwtModulo").Builder("CRIAR", { roles })
const Model = require("../models/IdookModel")
const LoginCrud = require("./utils/Crud").LoginCrud
const crud = new LoginCrud("idook")

module.exports = (model = Model) => {
   return  {
        async entrar(email, senha) {
            return await crud.entrar(model, jwt, email, senha)
        },
        
        async obterPorId(id) {
            return await crud.obterPorId(model, id)
        },
    
        async criar(entidade) {
            return await crud.criar(model, entidade)
        },

        async todos(filtro) {
            return await crud.todos(model, filtro)
        },
    
        async atualizar(entidade) {
            return await crud.atualizar(model, entidade)
        },
        
        async deletar(entidade) {
            return await crud.deletar(model, entidade)
        }
    }
}