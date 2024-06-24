const { NestedCollection, BaseCrud } = require("../services/utils/Crud");
const ServiceError = require("../err/ServiceError");
const crud = new BaseCrud("instituicao");
const POPULATE = "denuncias";

module.exports = class InstituicaoDenunciasUsecase {
  /**
   *
   * @param {entidade} instituicao instituicao já encontrada pelo id
   * @param {Request} denuncia
   * @returns
   */
  static async criar(instituicao, denuncia) {
    try {
      const denuncias = crud.populate.adicionar(
        instituicao,
        POPULATE,
        denuncia
      );

      instituicao.denuncias = denuncias;

      await instituicao.save();

      return denuncia;
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
   * @param {ObjectId} denunciaId
   * @param {Request} denuncia
   * @returns
   */
  static async atualizar(instituicao, denunciaId, denuncia) {
    try {
      denuncia._id = denunciaId;

      const denuncias = crud.populate.atualizar(
        instituicao,
        POPULATE,
        denunciaId,
        denuncia
      );

      instituicao[POPULATE] = denuncias;

      await instituicao.save();

      return crud.populate.obterPorId(instituicao, POPULATE, denunciaId);
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
   * @param {*} denunciaId
   * @returns
   */
  static async deletar(instituicao, denunciaId) {
    try {
      const denuncias = crud.populate.remover(
        instituicao,
        POPULATE,
        denunciaId
      );

      instituicao[POPULATE] = denuncias;

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
   * @param {*} denunciaId
   * @returns
   */
  static async obterPorId(instituicao, denunciaId) {
    try {
      return crud.populate.obterPorId(instituicao, POPULATE, denunciaId);
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

      const denuncias = crud.populate.collection(instituicao, POPULATE);

      if (denuncias.slice(inicio, inicio + limite).length == 0) {
        throw new ServiceError(
          "nenhum resultado encotrado para a requisicao. " +
            "Total de denuncias: " +
            denuncias.length,
          "204",
          "Nenhum resultado encontrado para a pagina"
        );
      }

      const denunciasFiltrados = Comando.consultar(denuncias, consultaRequest);
      const totalFiltrado = denunciasFiltrados.length;

      if (totalFiltrado == 0) {
        throw new ServiceError(
          "Nenhum resutlado encontrado para a query",
          "404",
          "Nenhum resultado encontrado para a busca"
        );
      }

      const denunciaPaginado = denunciasFiltrados.slice(
        inicio,
        inicio + limite
      );

      return {
        /*  exibindo: `${inicio + denunciaPaginado.length} de ${totalFiltrado}`,
        total_de_paginas: Math.ceil(totalFiltrado / limite),
        total_de_denuncias: denunciaPaginado.length,
        paginaAtual: pagina, */
        total_de_denuncias: totalFiltrado,
        denuncias: denunciasFiltrados,
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

  static consultar(denuncias, queryRequest) {
    const propertys = new CommandQuery(queryRequest);

    for (const property in propertys) {
      const [value, regex] = propertys[property];
      if (value) {
        denuncias = query(denuncias, property, value, regex);
      }
    }
    return denuncias;
  }
}

class CommandQuery {
  /**
   *
   * @param {QueryParams} queryParams
   */
  constructor({
    titulo = null,
    status = null,
    texto = null,
    imagem = null,
    autor_id = null,
  }) {
    this.titulo = Comando.buildQuery(titulo, true);
    this.status = Comando.buildQuery(status, true);
    this.texto = Comando.buildQuery(texto, true);
    this.imagem = Comando.buildQuery(imagem, true);
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
