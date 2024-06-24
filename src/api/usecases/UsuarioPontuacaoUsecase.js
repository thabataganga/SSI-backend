const { NestedCollection, BaseCrud } = require("../services/utils/Crud");
const ServiceError = require("../err/ServiceError");
const crud = new BaseCrud("usuario");
const POPULATE = "pontuacao";

module.exports = class UsuarioPontuacaoUsecase {
  /**
   *
   * @param {entidade} usuario usuario já encontrada pelo id
   * @param {Request} pontuacao
   * @returns
   */
  static async criar(usuario, pontuacao) {
    try {
      const pontuacoes = crud.populate.adicionar(usuario, POPULATE, pontuacao);

      usuario.pontuacoes = pontuacoes;

      await usuario.save();

      return pontuacao;
    } catch (error) {
      if (error instanceof ServiceError) throw error;

      throw new ServiceError(
        error.message || error,
        400,
        "Não foi possivel salvar"
      );
    }
  }

  /**
   *
   * @param {entidade} usuario usuario já encontrada pelo id
   * @param {ObjectId} pontuacaoId
   * @param {Request} pontuacao
   * @returns
   */
  static async atualizar(usuario, pontuacaoId, pontuacao) {
    try {
      pontuacao._id = pontuacaoId;

      const pontuacoes = crud.populate.atualizar(
        usuario,
        POPULATE,
        pontuacaoId,
        pontuacao
      );

      usuario[POPULATE] = pontuacoes;

      await usuario.save();

      return crud.populate.obterPorId(usuario, POPULATE, pontuacaoId);
    } catch (error) {
      throw new ServiceError(
        error.message || error,
        400,
        "Não foi possivel atualizar..."
      );
    }
  }
  /**
   *
   * @param {entidade} usuario usuario já encontrado pelo id
   * @param {*} pontuacaoId
   * @returns
   */
  static async deletar(usuario, pontuacaoId) {
    try {
      const pontuacoes = crud.populate.remover(usuario, POPULATE, pontuacaoId);

      usuario[POPULATE] = pontuacoes;

      await usuario.save();

      return null;
    } catch (error) {
      throw new ServiceError(
        error.message || error,
        400,
        "Não foi possivel deletar..."
      );
    }
  }

  static async deletarTodos(usuario) {
    try {
      usuario[POPULATE] = [];

      await usuario.save();

      return null;
    } catch (error) {
      throw new ServiceError(
        error.message || error,
        400,
        "Não foi possivel deletar..."
      );
    }
  }
  /**
   *
   * @param {entidade} usuario usuario já encontrada pelo id
   * @param {*} pontuacaoId
   * @returns
   */
  static async obterPorId(usuario, pontuacaoId) {
    try {
      return crud.populate.obterPorId(usuario, POPULATE, pontuacaoId);
    } catch (error) {
      throw new ServiceError(
        error.message || error,
        404,
        "Alerta não encontrado."
      );
    }
  }

  /**
   *
   * @param {entidade} usuario usuario já encontrada pelo id
   * @param {QueryParams} consultaRequest
   * @param {number} limite
   * @param {number} pagina
   * @returns
   */
  static async todos(usuario, consultaRequest) {
    try {
      let { limite = 10, pagina = 1 } = consultaRequest;
      limite = +limite;
      pagina = +pagina;

      const inicio = (pagina - 1) * limite;

      const pontuacoes = crud.populate.collection(usuario, POPULATE);

      /* if (pontuacoes.slice(inicio, inicio + limite).length == 0) {
        throw new ServiceError(
          "nenhum resultado encotrado para a requisicao. " +
            "Total de pontuacoes: " +
            pontuacoes.length,
          "400",
          "Nenhum resultado encontrado para a pagina"
        );
      } */

      const pontuacoesFiltrados = Comando.consultar(
        pontuacoes,
        consultaRequest
      );
      const totalFiltrado = pontuacoesFiltrados.length;

      /*  if (totalFiltrado == 0) {
        throw new ServiceError(
          "Nenhum resutlado encontrado para a query",
          "404",
          "Nenhum resultado encontrado para a busca"
        );
      } */

      const pontuacaoPaginado = pontuacoesFiltrados.slice(
        inicio,
        inicio + limite
      );

      return {
        total_de_pontuacoes: pontuacoesFiltrados.length,
        pontuacoes: pontuacoesFiltrados,
        /*  exibindo: `${inicio + pontuacaoPaginado.length} de ${totalFiltrado}`,
        total_de_paginas: Math.ceil(totalFiltrado / limite),
        total_de_pontuacoes: pontuacaoPaginado.length,
        paginaAtual: pagina,
        pontuacoes: pontuacaoPaginado, */
      };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        error.message || error,
        500,
        "O servidor está indisponivel no momento"
      );
    }
  }
};

class Comando {
  /**
   *
   * @param {string} value
   * @param {Boolean} regex
   * @returns
   */
  static buildQuery(value, regex) {
    return [value, regex];
  }

  static consultar(pontuacoes, queryRequest) {
    const propertys = new CommandQuery(queryRequest);

    for (const property in propertys) {
      const [value, regex] = propertys[property];
      if (value) {
        pontuacoes = query(pontuacoes, property, value, regex);
      }
    }
    return pontuacoes;
  }
}

class CommandQuery {
  /**
   *
   * @param {QueryParams} queryParams
   */
  constructor({
    valor = null,
    atividade = null,
    IPv4 = null,
    autor_id = null,
  }) {
    this.valor = Comando.buildQuery(valor, true);
    this.atividade = Comando.buildQuery(atividade, true);
    this.IPv4 = Comando.buildQuery(IPv4, true);
    this.autor_id = Comando.buildQuery(autor_id, false);
  }
}

const query = (arr, property, value, regex) => {
  if (regex) {
    return arr.filter((object) =>
      new RegExp(value, "i").test(object[property])
    );
  }
  return arr.filter((object) => object[property] == value);
};
