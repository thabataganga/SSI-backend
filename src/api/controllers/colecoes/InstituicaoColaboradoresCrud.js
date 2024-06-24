const usecase = require('../../usecases/InstituicaoColaboradoresUsecase')

module.exports = {
    interceptor: async (req, res, next, colaborador_id) => {
        const {
            entidade: instituicao,
            client
        } = req.locals

        try {

            const colaborador = await usecase.obterPorId(instituicao, colaborador_id)
            req.locals.colaborador = colaborador
            
            return next()

        } catch (error) {
            next(error);
        }
    },

    inserirUm: async (req, res, next) => {
        const {
            entidade: instituicao,
            client
        } = req.locals

        const colaboradorRequest = Object.assign(
            req.body,
            { autor_id: client.id }
        )

        try {
            const novoCriado = await usecase.criar(instituicao, colaboradorRequest);
            return res.status(200).json(novoCriado)
        } catch (error) {
            next(error);
        }
    },

    atualizarUm: async (req, res, next) => {
        const {
            entidade: instituicao,
            client
        } = req.locals

        const { colaborador_id } = req.params

        const colaboradorRequest = Object.assign(
            req.body,
            { autor_id: client.id }
        )
        
        try {

            const atualizado = await usecase.atualizar(instituicao, colaborador_id, colaboradorRequest);
            return res.status(200).json(atualizado)

        } catch (error) {
            next(error);
        }
    },

    deletarUm: async (req, res, next) => {
        const {
            entidade: instituicao,
            client
        } = req.locals

        const { colaborador_id } = req.params

        try {

            await usecase.deletar(instituicao, colaborador_id);
            return res.status(204).json(null)

        } catch (error) {
            next(error);
        }
    },

    deletarTodos: async (req, res, next) => {
        const {
            entidade: instituicao,
            client
        } = req.locals

        try {

            await usecase.deletarTodos(instituicao);
            return res.status(204).json(null)

        } catch (error) {
            next(error);
        }
    },

    obterPorId: async (req, res, next) => {
        const {
            entidade: instituicao,
            client,
            colaborador
        } = req.locals
        
        res.status(200).json(colaborador)
    },



    obterTodos: async (req, res, next) => {
        const {
            entidade: instituicao,
            client
        } = req.locals

        try {
            const todos = await usecase.todos(instituicao, req.query)

            return res.status(200).json(todos)

        } catch (error) {
            next(error);
        }
    }
}