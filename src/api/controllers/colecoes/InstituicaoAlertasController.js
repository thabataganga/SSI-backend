const usecase = require('../../usecases/InstituicaoAlertaCrudUsecase')
const filterResponse = require('../utils/filterResponse')

module.exports = {
    interceptor: async (req, res, next, alerta_id) => {
        const {
            entidade: instituicao,
            client
        } = req.locals

        try {
            const alerta = await usecase.obterPorId(instituicao, alerta_id)
            req.locals.alerta = alerta
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

        const alertaRequest = Object.assign(
            req.body,
            { autor_id: client.id }
        )

        try {
            const novoCriado = await usecase.criar(instituicao, alertaRequest);
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

        const { alerta_id } = req.params

        const alertaRequest = Object.assign(
            req.body,
            { autor_id: client.id }
        )

        try {

            const atualizado = await usecase.atualizar(instituicao, alerta_id, alertaRequest);
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

        const { alerta_id } = req.params

        try {

            await usecase.deletar(instituicao, alerta_id);
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
            alerta
        } = req.locals

       res.status(200).json(alerta)
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