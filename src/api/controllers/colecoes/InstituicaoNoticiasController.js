const usecase = require("../../usecases/InstituicaoNoticiasCrudUsecase");

module.exports = {
  interceptor: async (req, res, next, noticia_id) => {
    const { entidade: instituicao, client } = req.locals;

    try {
      const noticia = await usecase.obterPorId(instituicao, noticia_id);
      req.locals.noticia = noticia;
      return next();
    } catch (error) {
      next(error);
    }
  },

  inserirUm: async (req, res, next) => {
    const { entidade: instituicao, client } = req.locals;

    const noticiaRequest = Object.assign(req.body, { autor_id: client.id });

    try {
      const novoCriado = await usecase.criar(instituicao, noticiaRequest);
      return res.status(200).json(novoCriado);
    } catch (error) {
      next(error);
    }
  },

  atualizarUm: async (req, res, next) => {
    const { entidade: instituicao, client } = req.locals;

    const { noticia_id } = req.params;

    const noticiaRequest = Object.assign(req.body, { autor_id: client.id });

    try {
      const atualizado = await usecase.atualizar(
        instituicao,
        noticia_id,
        noticiaRequest
      );
      return res.status(200).json(atualizado);
    } catch (error) {
      next(error);
    }
  },

  deletarUm: async (req, res, next) => {
    const { entidade: instituicao, client } = req.locals;

    const { noticia_id } = req.params;

    try {
      await usecase.deletar(instituicao, noticia_id);
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
    const { entidade: instituicao, client, noticia } = req.locals;

    res.status(200).json(noticia);
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
