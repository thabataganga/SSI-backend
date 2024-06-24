const usecase = require('../../usecases/InstituicaoMembrosUsecase')

module.exports = {
    interceptor: async (req, res, next, membro_id) => {
        const {
            entidade: instituicao,
            client
        } = req.locals

        try {
            const membro = await usecase.obterPorId(instituicao, membro_id)
            req.locals.membro = membro
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

        const membroRequest = Object.assign(
            req.body,
            { autor_id: client.id }
        )

        try {
            const novoCriado = await usecase.criar(instituicao, membroRequest);
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

        const { membro_id } = req.params

        const membroRequest = Object.assign(
            req.body,
            { autor_id: client.id }
        )
        
        try {
            const atualizado = await usecase.atualizar(instituicao, membro_id, membroRequest);
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

        const { membro_id } = req.params

        try {

            await usecase.deletar(instituicao, membro_id);
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
            membro
        } = req.locals
        
        res.status(200).json(membro)
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