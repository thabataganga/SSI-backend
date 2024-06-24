const usecase = require("../../usecases/InstituicaoEventosCrudUsecase");

module.exports = {
  interceptor: async (req, res, next, evento_id) => {
    const { entidade: instituicao, client } = req.locals;

    try {
      const evento = await usecase.obterPorId(instituicao, evento_id);
      req.locals.evento = evento;
      return next();
    } catch (error) {
      next(error);
    }
  },

  inserirUm: async (req, res, next) => {
    const { entidade: instituicao, client } = req.locals;

    const eventoRequest = Object.assign(req.body, { autor_id: client.id });

    try {
      const novoCriado = await usecase.criar(instituicao, eventoRequest);
      return res.status(200).json(novoCriado);
    } catch (error) {
      next(error);
    }
  },

  atualizarUm: async (req, res, next) => {
    const { entidade: instituicao, client } = req.locals;

    const { evento_id } = req.params;

    const eventoRequest = Object.assign(req.body, { autor_id: client.id });

    try {
      const atualizado = await usecase.atualizar(
        instituicao,
        evento_id,
        eventoRequest
      );
      return res.status(200).json(atualizado);
    } catch (error) {
      next(error);
    }
  },

  deletarUm: async (req, res, next) => {
    const { entidade: instituicao, client } = req.locals;

    const { evento_id } = req.params;

    try {
      await usecase.deletar(instituicao, evento_id);
      return res.status(204).json(null);
    } catch (error) {
      next(error);
    }
  },

  deletarTodos: async (req, res, next) => {
    const { entidade: instituicao, client } = req.locals;

    try {
      await usecase.deletarTodos(instituicao);
      return res.status(204).json(null);
    } catch (error) {
      next(error);
    }
  },

  obterPorId: async (req, res, next) => {
    const { entidade: instituicao, client, evento } = req.locals;

    res.status(200).json(evento);
  },

  obterTodos: async (req, res, next) => {
    const { entidade: instituicao, client } = req.locals;

    try {
      const todos = await usecase.todos(instituicao, req.query);

      return res.status(200).json(todos);
    } catch (error) {
      next(error);
    }
  },
};
