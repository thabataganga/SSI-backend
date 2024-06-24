const usecase = require('../../usecases/InstituicaoLiderancasCrud')

module.exports = {
    interceptor: async (req, res, next, lideranca_id) => {
        const {
            entidade: instituicao,
            client
        } = req.locals

        try {
            const lideranca = await usecase.obterPorId(instituicao, lideranca_id)
            req.locals.lideranca = lideranca
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

        const liderancaRequest = Object.assign(
            req.body,
            { autor_id: client.id }
        )

        try {
            const novoCriado = await usecase.criar(instituicao, liderancaRequest);
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

        const { lideranca_id } = req.params

        const liderancaRequest = Object.assign(
            req.body,
            { autor_id: client.id }
        )
        
        try {

            const atualizado = await usecase.atualizar(instituicao, lideranca_id, liderancaRequest);
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

        const { lideranca_id } = req.params

        try {

            await usecase.deletar(instituicao, lideranca_id);
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
            lideranca
        } = req.locals
        
        res.status(200).json(lideranca)
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