const { NestedCollection, BaseCrud } = require("../services/utils/Crud");
const ServiceError = require("../err/ServiceError");
const crud = new BaseCrud("instituicao");
const POPULATE = "noticias";
module.exports = class InstituicaoNoticiasUsecase {
  /**
   *
   * @param {entidade} instituicao instituicao já encontrada pelo id
   * @param {Request} noticia
   * @returns
   */
  static async criar(instituicao, noticia) {
    try {
      const noticias = crud.populate.adicionar(instituicao, POPULATE, noticia);

      instituicao.noticias = noticias;

      await instituicao.save();

      return noticia;
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
   * @param {ObjectId} noticiaId
   * @param {Request} noticia
   * @returns
   */
  static async atualizar(instituicao, noticiaId, noticia) {
    try {
      noticia._id = noticiaId;

      const noticias = crud.populate.atualizar(
        instituicao,
        POPULATE,
        noticiaId,
        noticia
      );

      instituicao[POPULATE] = noticias;

      await instituicao.save();

      return crud.populate.obterPorId(instituicao, POPULATE, noticiaId);
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
   * @param {*} noticiaId
   * @returns
   */
  static async deletar(instituicao, noticiaId) {
    try {
      const noticias = crud.populate.remover(instituicao, POPULATE, noticiaId);

      instituicao[POPULATE] = noticias;

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
   * @param {*} noticiaId
   * @returns
   */
  static async obterPorId(instituicao, noticiaId) {
    try {
      return crud.populate.obterPorId(instituicao, POPULATE, noticiaId);
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

      const noticias = crud.populate.collection(instituicao, POPULATE);

      if (noticias.slice(inicio, inicio + limite).length == 0) {
        throw new ServiceError(
          "nenhum resultado encotrado para a requisicao. " +
            "Total de noticias: " +
            noticias.length,
          "204",
          "Nenhum resultado encontrado para a pagina"
        );
      }

      const noticiasFiltrados = Comando.consultar(noticias, consultaRequest);
      const totalFiltrado = noticiasFiltrados.length;

      if (totalFiltrado == 0) {
        throw new ServiceError(
          "Nenhum resutlado encontrado para a query",
          "404",
          "Nenhum resultado encontrado para a busca"
        );
      }

      const noticiaPaginado = noticiasFiltrados.slice(inicio, inicio + limite);

      return {
        exibindo: `${inicio + noticiaPaginado.length} de ${totalFiltrado}`,
        total_de_paginas: Math.ceil(totalFiltrado / limite),
        total_de_noticias: noticiaPaginado.length,
        paginaAtual: pagina,
        noticias: noticiaPaginado,
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

  static consultar(noticias, queryRequest) {
    const propertys = new CommandQuery(queryRequest);

    for (const property in propertys) {
      const [value, regex] = propertys[property];
      if (value) {
        noticias = query(noticias, property, value, regex);
      }
    }
    return noticias;
  }
}
class CommandQuery {
  /**
   *
   * @param {QueryParams} queryParams
   */
  constructor({
    nome = null,
    titulo = null,
    subtitulo = null,
    texto = null,
    status = null,
    autor_id = null,
  }) {
    this.nome = Comando.buildQuery(nome, true);
    this.titulo = Comando.buildQuery(titulo, true);
    this.subtitulo = Comando.buildQuery(subtitulo, true);
    this.texto = Comando.buildQuery(texto, true);
    this.status = Comando.buildQuery(status, true);
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
