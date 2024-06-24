const { NestedCollection, BaseCrud } = require("../services/utils/Crud");
const ServiceError = require("../err/ServiceError");
const crud = new BaseCrud("instituicao");
const POPULATE = "alertas";
module.exports = class InstituicaoAlertas {
  /**
   *
   * @param {entidade} instituicao instituicao já encontrada pelo id
   * @param {Request} alerta
   * @returns
   */
  static async criar(instituicao, alerta) {
    try {
      const alertas = crud.populate.adicionar(instituicao, POPULATE, alerta);

      instituicao.alertas = alertas;

      await instituicao.save();

      return alerta;
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
   * @param {ObjectId} alertaId
   * @param {Request} alerta
   * @returns
   */
  static async atualizar(instituicao, alertaId, alerta) {
    try {
      alerta._id = alertaId;

      const alertas = crud.populate.atualizar(
        instituicao,
        POPULATE,
        alertaId,
        alerta
      );

      instituicao[POPULATE] = alertas;

      await instituicao.save();

      return crud.populate.obterPorId(instituicao, POPULATE, alertaId);
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
   * @param {*} alertaId
   * @returns
   */
  static async deletar(instituicao, alertaId) {
    try {
      const alertas = crud.populate.remover(instituicao, POPULATE, alertaId);

      instituicao[POPULATE] = alertas;

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
   * @param {*} alertaId
   * @returns
   */
  static async obterPorId(instituicao, alertaId) {
    try {
      return crud.populate.obterPorId(instituicao, POPULATE, alertaId);
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

      const alertas = crud.populate.collection(instituicao, POPULATE);

      if (alertas.slice(inicio, inicio + limite).length == 0) {
        throw new ServiceError(
          "nenhum resultado encotrado para a requisicao. " +
            "Total de alertas: " +
            alertas.length,
          "204",
          "Nenhum resultado encontrado para a pagina"
        );
      }

      const alertasFiltrados = Comando.consultar(alertas, consultaRequest);
      const totalFiltrado = alertasFiltrados.length;

      if (totalFiltrado == 0) {
        throw new ServiceError(
          "Nenhum resutlado encontrado para a query",
          "404",
          "Nenhum resultado encontrado para a busca"
        );
      }

      const alertaPaginado = alertasFiltrados.slice(inicio, inicio + limite);

      return {
        /* exibindo: `${inicio + alertaPaginado.length} de ${totalFiltrado}`,
        total_de_paginas: Math.ceil(totalFiltrado / limite),
        total_de_alertas: alertaPaginado.length,
        paginaAtual: pagina, */
        total_de_alertas: totalFiltrado,
        alertas: alertasFiltrados,
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

  static consultar(alertas, queryRequest) {
    const propertys = new CommandQuery(queryRequest);

    for (const property in propertys) {
      const [value, regex] = propertys[property];
      if (value) {
        alertas = query(alertas, property, value, regex);
      }
    }
    return alertas;
  }
}
class CommandQuery {
  /**
   *
   * @param {QueryParams} queryParams
   */
  constructor({
    tipo_de_usuario = null,
    uf = null,
    localidade = null,
    bairro = null,
    area_de_atuacao = null,
    local_de_trabalho = null,
    cargo = null,
    genero = null,
    doacao = null,
    texto = null,
    autor_id = null,
    criado_em = null,
  }) {
    this.texto = Comando.buildQuery(texto, true);
    this.autor_id = Comando.buildQuery(autor_id, false);
    this.updatedAt = Comando.buildQuery(criado_em, false);
    this.tipo_de_usuario = Comando.buildQuery(tipo_de_usuario, false);
    this.uf = Comando.buildQuery(uf, false);
    this.localidade = Comando.buildQuery(localidade, true);
    this.bairro = Comando.buildQuery(bairro, true);
    this.area_de_atuacao = Comando.buildQuery(area_de_atuacao, true);
    this.local_de_trabalho = Comando.buildQuery(local_de_trabalho, true);
    this.cargo = Comando.buildQuery(cargo, true);
    this.genero = Comando.buildQuery(genero, false);
    this.doacao = Comando.buildQuery(doacao, false);
  }
}

const query = (arr, property, value, regex) => {
  if (regex) {
    return arr.filter((object) => {
      const { destinatario: valueObject } = object;
      const savedValue = valueObject[property];
      if (savedValue) {
        return new RegExp(value, "i").test(savedValue);
      }
      return new RegExp(value, "i").test(object[property]);
    });
  }

  return arr.filter((object) => {
    const { destinatario: valueObject } = object;
    const savedValue = valueObject[property];
    if (savedValue) return savedValue.toString() == value;
    else return object[property] == value;
  });
};
