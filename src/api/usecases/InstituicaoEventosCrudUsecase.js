const { NestedCollection, BaseCrud } = require("../services/utils/Crud");
const ServiceError = require("../err/ServiceError");
const crud = new BaseCrud("instituicao");
const POPULATE = "eventos";

module.exports = class InstituicaoEventosUsecase {
  /**
   *
   * @param {entidade} instituicao instituicao já encontrada pelo id
   * @param {Request} evento
   * @returns
   */
  static async criar(instituicao, evento) {
    try {
      const eventos = crud.populate.adicionar(instituicao, POPULATE, evento);

      instituicao.eventos = eventos;

      await instituicao.save();

      return evento;
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
   * @param {ObjectId} eventoId
   * @param {Request} evento
   * @returns
   */
  static async atualizar(instituicao, eventoId, evento) {
    try {
      evento._id = eventoId;

      const eventos = crud.populate.atualizar(
        instituicao,
        POPULATE,
        eventoId,
        evento
      );

      instituicao[POPULATE] = eventos;

      await instituicao.save();

      return crud.populate.obterPorId(instituicao, POPULATE, eventoId);
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
   * @param {*} eventoId
   * @returns
   */
  static async deletar(instituicao, eventoId) {
    try {
      const eventos = crud.populate.remover(instituicao, POPULATE, eventoId);

      instituicao[POPULATE] = eventos;

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
   * @param {*} eventoId
   * @returns
   */
  static async obterPorId(instituicao, eventoId) {
    try {
      return crud.populate.obterPorId(instituicao, POPULATE, eventoId);
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

      const eventos = crud.populate.collection(instituicao, POPULATE);

      if (eventos.slice(inicio, inicio + limite).length == 0) {
        throw new ServiceError(
          "nenhum resultado encotrado para a requisicao. " +
            "Total de eventos: " +
            eventos.length,
          "204",
          "Nenhum resultado encontrado para a pagina"
        );
      }

      const eventosFiltrados = Comando.consultar(eventos, consultaRequest);
      const totalFiltrado = eventosFiltrados.length;

      if (totalFiltrado == 0) {
        throw new ServiceError(
          "Nenhum resutlado encontrado para a query",
          "404",
          "Nenhum resultado encontrado para a busca"
        );
      }

      const eventoPaginado = eventosFiltrados.slice(inicio, inicio + limite);

      return {
        exibindo: `${inicio + eventoPaginado.length} de ${totalFiltrado}`,
        total_de_paginas: Math.ceil(totalFiltrado / limite),
        total_de_eventos: eventoPaginado.length,
        paginaAtual: pagina,
        eventos: eventoPaginado,
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

  static consultar(eventos, queryRequest) {
    const propertys = new CommandQuery(queryRequest);

    for (const property in propertys) {
      const [value, regex] = propertys[property];
      if (value) {
        eventos = query(eventos, property, value, regex);
      }
    }
    return eventos;
  }
}

class CommandQuery {
  /**
   *
   * @param {QueryParams} queryParams
   */
  constructor({
    titulo = null,
    link = null,
    imagem = null,
    texto = null,
    status = null,
    data = null,
    autor_id = null,
  }) {
    this.titulo = Comando.buildQuery(titulo, true);
    this.link = Comando.buildQuery(link, true);
    this.imagem = Comando.buildQuery(imagem, true);
    this.texto = Comando.buildQuery(texto, true);
    this.status = Comando.buildQuery(status, true);
    this.data = Comando.buildQuery(data, true);
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
