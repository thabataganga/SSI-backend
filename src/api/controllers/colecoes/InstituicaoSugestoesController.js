const usecase = require("../../usecases/InstituicaoSugestoesCrudUsecase");

module.exports = {
  interceptor: async (req, res, next, sugestao_id) => {
    const { entidade: instituicao, client } = req.locals;

    try {
      const sugestao = await usecase.obterPorId(instituicao, sugestao_id);
      req.locals.sugestao = sugestao;
      return next();
    } catch (error) {
      next(error);
    }
  },

  inserirUm: async (req, res, next) => {
    const { entidade: instituicao, client } = req.locals;

    const sugestaoRequest = Object.assign(req.body, { autor_id: client.id });

    try {
      const novoCriado = await usecase.criar(instituicao, sugestaoRequest);
      return res.status(200).json(novoCriado);
    } catch (error) {
      next(error);
    }
  },

  atualizarUm: async (req, res, next) => {
    const { entidade: instituicao, client } = req.locals;

    const { sugestao_id } = req.params;

    const sugestaoRequest = Object.assign(req.body);

    try {
      const atualizado = await usecase.atualizar(
        instituicao,
        sugestao_id,
        sugestaoRequest
      );
      return res.status(200).json(atualizado);
    } catch (error) {
      next(error);
    }
  },

  deletarUm: async (req, res, next) => {
    const { entidade: instituicao, client } = req.locals;

    const { sugestao_id } = req.params;

    try {
      await usecase.deletar(instituicao, sugestao_id);
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
    const { entidade: instituicao, client, sugestao } = req.locals;

    res.status(200).json(sugestao);
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
