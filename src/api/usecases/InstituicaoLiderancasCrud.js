const { NestedCollection, BaseCrud } = require("../services/utils/Crud");
const ServiceError = require("../err/ServiceError");
const crud = new BaseCrud("instituicao");
const POPULATE = "liderancas";
module.exports = class InstituicaoColaboradoresUsecase {
  /**
   *
   * @param {entidade} instituicao instituicao já encontrada pelo id
   * @param {Request} lideranca
   * @returns
   */
  static async criar(instituicao, lideranca) {
    try {
      const liderancas = crud.populate.adicionar(
        instituicao,
        POPULATE,
        lideranca
      );

      instituicao.liderancas = liderancas;

      await instituicao.save();

      return lideranca;
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
   * @param {ObjectId} liderancaId
   * @param {Request} lideranca
   * @returns
   */
  static async atualizar(instituicao, liderancaId, lideranca) {
    try {
      lideranca._id = liderancaId;

      const liderancas = crud.populate.atualizar(
        instituicao,
        POPULATE,
        liderancaId,
        lideranca
      );

      instituicao[POPULATE] = liderancas;

      await instituicao.save();

      return crud.populate.obterPorId(instituicao, POPULATE, liderancaId);
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
   * @param {*} liderancaId
   * @returns
   */
  static async deletar(instituicao, liderancaId) {
    try {
      const liderancas = crud.populate.remover(
        instituicao,
        POPULATE,
        liderancaId
      );

      instituicao[POPULATE] = liderancas;

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
   * @param {*} liderancaId
   * @returns
   */
  static async obterPorId(instituicao, liderancaId) {
    try {
      return crud.populate.obterPorId(instituicao, POPULATE, liderancaId);
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

      const liderancas = crud.populate.collection(instituicao, POPULATE);

      if (liderancas.slice(inicio, inicio + limite).length == 0) {
        throw new ServiceError(
          "nenhum resultado encotrado para a requisicao. " +
            "Total de liderancas: " +
            liderancas.length,
          "204",
          "Nenhum resultado encontrado para a pagina"
        );
      }

      const liderancasFiltrados = Comando.consultar(
        liderancas,
        consultaRequest
      );
      const totalFiltrado = liderancasFiltrados.length;

      if (totalFiltrado == 0) {
        throw new ServiceError(
          "Nenhum resutlado encontrado para a query",
          "404",
          "Nenhum resultado encontrado para a busca"
        );
      }

      const liderancaPaginado = liderancasFiltrados.slice(
        inicio,
        inicio + limite
      );

      return {
        exibindo: `${inicio + liderancaPaginado.length} de ${totalFiltrado}`,
        total_de_paginas: Math.ceil(totalFiltrado / limite),
        total_de_liderancas: liderancaPaginado.length,
        paginaAtual: pagina,
        liderancas: liderancaPaginado,
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

  static consultar(liderancas, queryRequest) {
    const propertys = new CommandQuery(queryRequest);

    for (const property in propertys) {
      const [value, regex] = propertys[property];
      if (value) {
        liderancas = query(liderancas, property, value, regex);
      }
    }
    return liderancas;
  }
}
class CommandQuery {
  /**
   *
   * @param {QueryParams} queryParams
   */
  constructor({ nome = null, titulo = null, autor_id = null }) {
    (this.nome = Comando.buildQuery(nome, true)),
      (this.titulo = Comando.buildQuery(titulo, false));
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
