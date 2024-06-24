const { NestedCollection, BaseCrud } = require("../services/utils/Crud");
const ServiceError = require("../err/ServiceError");
const crud = new BaseCrud("instituicao");
const POPULATE = "sugestoes";

module.exports = class InstituicaoSugestoesUsecase {
  /**
   *
   * @param {entidade} instituicao instituicao já encontrada pelo id
   * @param {Request} sugestao
   * @returns
   */
  static async criar(instituicao, sugestao) {
    try {
      const sugestoes = crud.populate.adicionar(
        instituicao,
        POPULATE,
        sugestao
      );

      instituicao.sugestoes = sugestoes;

      await instituicao.save();

      return sugestao;
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
   * @param {entidade} instituicao instituicao já encontrada pelo id
   * @param {ObjectId} sugestaoId
   * @param {Request} sugestao
   * @returns
   */
  static async atualizar(instituicao, sugestaoId, sugestao) {
    try {
      sugestao._id = sugestaoId;

      const sugestoes = crud.populate.atualizar(
        instituicao,
        POPULATE,
        sugestaoId,
        sugestao
      );

      instituicao[POPULATE] = sugestoes;

      await instituicao.save();

      return crud.populate.obterPorId(instituicao, POPULATE, sugestaoId);
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
   * @param {entidade} instituicao instituicao já encontrada pelo id
   * @param {*} sugestaoId
   * @returns
   */
  static async deletar(instituicao, sugestaoId) {
    try {
      const sugestoes = crud.populate.remover(
        instituicao,
        POPULATE,
        sugestaoId
      );

      instituicao[POPULATE] = sugestoes;

      await instituicao.save();

      return null;
    } catch (error) {
      throw new ServiceError(
        error.message || error,
        400,
        "Não foi possivel deletar..."
      );
    }
  }

  static async deletarTodos(instituicao) {
    try {
      instituicao[POPULATE] = [];

      await instituicao.save();

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
   * @param {entidade} instituicao instituicao já encontrada pelo id
   * @param {*} sugestaoId
   * @returns
   */
  static async obterPorId(instituicao, sugestaoId) {
    try {
      return crud.populate.obterPorId(instituicao, POPULATE, sugestaoId);
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
   * @param {entidade} instituicao instituicao já encontrada pelo id
   * @param {QueryParams} consultaRequest
   * @param {number} limite
   * @param {number} pagina
   * @returns
   */
  static async todos(instituicao, consultaRequest) {
    try {
      let { limite = 10, pagina = 1 } = consultaRequest;
      limite = +limite;
      pagina = +pagina;

      const inicio = (pagina - 1) * limite;

      const sugestoes = crud.populate.collection(instituicao, POPULATE);

      if (sugestoes.slice(inicio, inicio + limite).length == 0) {
        throw new ServiceError(
          "nenhum resultado encotrado para a requisicao. " +
            "Total de sugestoes: " +
            sugestoes.length,
          "204",
          "Nenhum resultado encontrado para a pagina"
        );
      }

      const sugestoesFiltrados = Comando.consultar(sugestoes, consultaRequest);
      const totalFiltrado = sugestoesFiltrados.length;

      if (totalFiltrado == 0) {
        throw new ServiceError(
          "Nenhum resutlado encontrado para a query",
          "404",
          "Nenhum resultado encontrado para a busca"
        );
      }

      const sugestaoPaginado = sugestoesFiltrados.slice(
        inicio,
        inicio + limite
      );

      return {
        /*   exibindo: `${inicio + sugestaoPaginado.length} de ${totalFiltrado}`,
                total_de_paginas: Math.ceil(totalFiltrado / limite),
                total_de_sugestoes: sugestaoPaginado.length,
                paginaAtual: pagina, */
        total_de_sugestoes: totalFiltrado,
        sugestoes: sugestoesFiltrados,
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

  static consultar(sugestoes, queryRequest) {
    const propertys = new CommandQuery(queryRequest);

    for (const property in propertys) {
      const [value, regex] = propertys[property];
      if (value) {
        sugestoes = query(sugestoes, property, value, regex);
      }
    }
    return sugestoes;
  }
}

class CommandQuery {
  /**
   *
   * @param {QueryParams} queryParams
   */
  constructor({
    titulo = null,
    tipo_de_sugestao = null,
    status = null,
    texto = null,
    autor_id = null,
  }) {
    this.titulo = Comando.buildQuery(titulo, true);
    this.tipo_de_sugestao = Comando.buildQuery(tipo_de_sugestao, true);
    this.status = Comando.buildQuery(status, true);
    this.texto = Comando.buildQuery(texto, true);
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
