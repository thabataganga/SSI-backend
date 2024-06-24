const usecase = require("../../usecases/UsuarioPontuacaoUsecase");

module.exports = {
  interceptor: async (req, res, next, pontuacao_id) => {
    const { entidade: usuario, client } = req.locals;

    try {
      const pontuacao = await usecase.obterPorId(usuario, pontuacao_id);
      req.locals.pontuacao = pontuacao;
      return next();
    } catch (error) {
      next(error);
    }
  },
  inserirUm: async (req, res, next) => {
    const { entidade: usuario, client } = req.locals;

    const pontuacaoRequest = Object.assign(req.body);

    try {
      const novoCriado = await usecase.criar(usuario, pontuacaoRequest);
      return res.status(200).json(novoCriado);
    } catch (error) {
      next(error);
    }
  },

  loginDiario: async (req, res, next) => {
    const { entidade: usuario, client } = req.locals;
    const pontuacaoRequest = Object.assign(req.body);

    //Busca pontos
    const todos = await usecase.todos(usuario, req.query);
    const pontuacoes = todos.pontuacoes;
    const loginDiario = [];
    let prazo = true;
    let tentativa = "23:59";

    pontuacoes.forEach((pontuacao) => {
      if (pontuacao.atividade === "login_diario") {
        loginDiario.push(pontuacao);
      }
    });

    loginDiario.forEach((pontuacao) => {
      var hoje = new Date();
      var diffMs = hoje - pontuacao.createdAt;
      var diffDays = Math.floor(diffMs / 86400000);
      var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
      var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
      var umDia = 1000 * 60 * 60 * 24;
      var diff = (hoje.getTime() - pontuacao.createdAt.getTime()) / umDia;

      let hora = 23 - diffHrs;
      let minuto = 59 - diffMins;

      if (hora < 10) {
        hora = `0${hora}`;
      }

      if (minuto < 10) {
        minuto = `0${minuto}`;
      }

      tentativa = `${hora}:${minuto}`;

      if (diff < 1) {
        prazo = false;
      }
    });

    if (prazo) {
      try {
        const novoCriado = await usecase.criar(usuario, pontuacaoRequest);
        return res.status(200).json(novoCriado);
      } catch (error) {
        next(error);
      }
    } else {
      return res
        .status(202)
        .json({ msg: "Já resgatado", novaTentativa: tentativa });
    }
  },

  atualizarUm: async (req, res, next) => {
    const { entidade: usuario, client } = req.locals;

    const { pontuacao_id } = req.params;

    const pontuacaoRequest = Object.assign(req.body, { autor_id: client.id });

    try {
      const atualizado = await usecase.atualizar(
        usuario,
        pontuacao_id,
        pontuacaoRequest
      );
      return res.status(200).json(atualizado);
    } catch (error) {
      next(error);
    }
  },

  deletarUm: async (req, res, next) => {
    const { entidade: usuario, client } = req.locals;

    const { pontuacao_id } = req.params;

    try {
      await usecase.deletar(usuario, pontuacao_id);
      return res.status(204).json(null);
    } catch (error) {
      next(error);
    }
  },

  deletarTodos: async (req, res, next) => {
    const { entidade: usuario, client } = req.locals;

    try {
      await usecase.deletarTodos(usuario);
      return res.status(204).json(null);
    } catch (error) {
      next(error);
    }
  },

  obterPorId: async (req, res, next) => {
    const { entidade: usuario, client, noticia: pontuacao } = req.locals;

    res.status(200).json(pontuacao);
  },

  obterTodos: async (req, res, next) => {
    const { entidade: usuario, client } = req.locals;

    try {
      const todos = await usecase.todos(usuario, req.query);
      const pontuacoes = todos.pontuacoes;

      const ordenar = pontuacoes.sort(function (a, b) {
        if (a.valor < b.valor) {
          return 1;
        } else if (a.valor > b.valor) {
          return -1;
        }
        return 0;
      });
      let pontosAcu = 0;
      pontuacoes.forEach((ponto) => {
        pontosAcu = pontosAcu + ponto.valor;
      });
      console.log(pontosAcu);

      const retorna = {
        total_de_pontuacoes: pontosAcu,
        pontuacoes: ordenar,
      };

      return res.status(200).json(retorna);
    } catch (error) {
      next(error);
    }
  },
};
