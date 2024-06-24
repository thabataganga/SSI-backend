const mongoose = require("mongoose");
const ServiceError = require("../../err/ServiceError");
const bcrypt = require("bcrypt");
const log = require("../../log");
const appEvent = require("../../events/appEvent");

/**
 * @class classe abstrata para realizar ações de CRUD repetitivas em objetos nested de coleção de dados
 */

const clearObject = (o = {}) => JSON.parse(JSON.stringify(o));
class NestedCollection {
  static collection(model, populate) {
    const collection = model[populate];
    if (!collection) throw "colletion não encontrada";
    if (!Array.isArray(collection)) throw "O elemento não é uma lista";

    collection.add = function (e) {
      this.push(e);
      return clearObject(this);
    };

    return collection;
  }

  /**
   *
   * @param {import("mongoose").Model} model a propria coleção em si: ex: "instituicoes"
   * @param {import("mongoose").Collection} populate referencia da coleção ex: "associados"
   * @param {Function} fn callback  para método find
   * @returns
   */
  static obterPorFiltro(
    model,
    populate,
    fn,
    valor = " - parametro não informado"
  ) {
    const MENSAGEM_DE_ERRO = `Nenhum resultado encontrado para "${populate}" com o valor ${valor}`;
    try {
      const collection = NestedCollection.collection(model, populate);
      const resource = collection.find(fn);
      if (!resource) throw MENSAGEM_DE_ERRO;
      return clearObject(resource);
    } catch (error) {
      throw new ServiceError(error.message || error, 400, MENSAGEM_DE_ERRO);
    }
  }
  /**
   *
   * @param {import("mongoose").Model} model a propria coleção em si: ex: "instituicoes"
   * @param {import("mongoose").Collection} populate referencia da coleção ex: "associados"
   * @param {Object} nestedId
   */
  static obterPorId(model, populate, nestedId) {
    return NestedCollection.obterPorFiltro(
      model,
      populate,
      (e) => e._id == nestedId.toString(),
      nestedId
    );
  }

  /**
   *
   * @param {import("mongoose").Model} model a propria coleção em si: ex: "instituicoes"
   * @param {import("mongoose").Collection} populate referencia da coleção ex: "associados"
   * @param {Object} nestedId
   * @param {Object} request
   */
  static atualizar(model, populate, nestedId, request) {
    const collection = NestedCollection.collection(model, populate);
    NestedCollection.obterPorId(model, populate, nestedId);

    return collection.map((resource) => {
      if (resource._id != nestedId) return resource;
      Object.keys(request).forEach((property) => {
        if (property != "_id") {
          resource[property] = request[property] || resource[property];
        } else resource[property] = resource[property];
      });
      return resource;
    });
  }

  /**
   *
   * @param {import("mongoose").Model} model a propria coleção em si: ex: "instituicoes"
   * @param {import("mongoose").Collection} populate referencia da coleção ex: "associados"
   * @param {Object} nestedId
   */
  static remover(model, populate, nestedId) {
    const collection = NestedCollection.collection(model, populate);
    NestedCollection.obterPorId(model, populate, nestedId);
    const indice = collection.findIndex((e) => e._id == nestedId);
    collection.splice(indice, 1);
    return JSON.parse(JSON.stringify(collection));
  }

  /**
   *
   * @param {import("mongoose").Model} model a propria coleção em si: ex: "instituicoes"
   * @param {import("mongoose").Collection} populate referencia da coleção ex: "associados"
   * @param {Object} request
   * @param {Args} uniques
   */
  static adicionar(model, populate, request, ...uniques) {
    if (!model || !populate || !request) throw "os parametros sao exigidos";
    const collection = NestedCollection.collection(model, populate);
    const duplicateError = new ServiceError(
      "O objeto solicitado já existe",
      409,
      "Já existe um objeto com esses parametros"
    );

    try {
      if (
        NestedCollection.obterPorFiltro(
          model,
          populate,
          (R) => R._id == request._id
        )
      ) {
        throw "DUPLICADO";
      }
    } catch (error) {
      if (error === "DUPLICADO") throw duplicateError;
    }

    if (uniques.length === 0 || collection.length === 0) {
      return collection.add(request);
    }

    uniques.forEach((property) => {
      try {
        if (
          NestedCollection.obterPorFiltro(model, populate, (R) => {
            for (const currentProperty of Object.keys(request)) {
              if (R[currentProperty] == request[property]) return true;
            }

            return false;
          })
        )
          throw "DUPLICATE";
      } catch (error) {
        if (error == "DUPLICATE") {
          throw duplicateError;
        }
      }
    });

    return collection.add(request);
  }

  /**
   *
   * @param {import("mongoose").Model} model a propria coleção em si: ex: "instituicoes"
   * @param {import("mongoose").Collection} populate referencia da coleção ex: "associados"
   * @param {Array} consulta
   * @returns
   */
  static consulta(model, populate, ...consulta) {
    if (!model || !populate || !request) throw "os parametros sao exigidos";
    const collection = NestedCollection.collection(model, populate);

    if (consulta.length === 0 || collection.length === 0) {
      return collection.add(request);
    }

    const filtro = consulta.filter((property) => {
      try {
        if (
          NestedCollection.obterPorFiltro(model, populate, (R) => {
            for (const currentProperty of Object.keys(request)) {
              if (R[currentProperty] == request[property]) return true;
            }
            return false;
          })
        )
          return true;
      } catch (error) {
        throw error;
      }
    });

    if (filtro.length == 0) throw "nenhum resultado encontrado para a busca";

    return filtro;
  }
}

class BaseCrud {
  async todos(db, filter) {
    console.log(filter);
    const todosEncontrados = await db.find(filter);

    // console.log(todosEncontrados);

    if (todosEncontrados.length == 0) {
      throw new ServiceError(
        "not found",
        204,
        "Nenhum resultado encontrado para essa pesquisa"
      );
    }

    return todosEncontrados;
  }

  async obterPorId(db, id, opcoes = {}) {
    try {
      const encontrar = await db.findById(id, opcoes);
      if (!encontrar || !encontrar._id) {
        throw {
          message: `not found _id("${id}")`,
        };
      }
      return encontrar;
    } catch (error) {
      throw new ServiceError(
        error.message,
        400,
        `Nenhum resultado encontrado para o id ${id}`
      );
    }
  }

  /**
   *
   * @param {Model} db
   * @param {string} email
   * @returns
   */
  async obterPorEmail(db, email) {
    try {
      const encontrar = await db.findOne({ email });
      if (!encontrar) throw `${this.referencia} não encontrado`;
      return encontrar;
    } catch (error) {
      throw new ServiceError(
        error.message,
        400,
        `Nenhum resultado encontrado para o email ${email}`
      );
    }
  }

  async obterPorCpf(db, cpf) {
    try {
      const encontrar = await db.findOne({ cpf: cpf });
      if (!encontrar) throw `${this.referencia} não encontrado`;
      return encontrar;
    } catch (error) {
      throw new ServiceError(
        error.message,
        400,
        `Nenhum resultado encontrado para o cpf ${cpf}`
      );
    }
  }

  /**
   *
   * @param {Model} db
   * @param {string} email
   * @returns
   */
  async obterComPopulate(db, id, populate) {
    try {
      const encontrar = await db.findById(id).populate(populate);
      if (!encontrar) throw `${this.referencia} não encontrado`;
      return encontrar;
    } catch (error) {
      throw new ServiceError(
        error.message,
        400,
        `Nenhum resultado encontrado para o email ${email}`
      );
    }
  }

  async obterPorFiltro(db, filtro) {
    try {
      const encontrar = await db.findOne(filtro);
      if (!encontrar) throw `${this.referencia} não encontrado`;
      return encontrar;
    } catch (error) {
      throw new ServiceError(
        error.message,
        400,
        `Nenhum resultado encontrado para os parametros`
      );
    }
  }

  /**
   *
   * @param {Model} db
   * @param {Model} entidade instance of Model
   * @param {_id} ObjectId id for model
   * @param {eventEmitter} eventEmitter
   * @returns
   */
  async criar(
    db,
    entidade,
    eventEmitter = appEvent,
    _id = new mongoose.Types.ObjectId()
  ) {
    const model = new db(Object.assign(entidade, { _id }));
    try {
      const salvo = await model.save();

      eventEmitter.emit(this.referencia, "CRIAR", clearObject(model));

      return salvo;
    } catch (error) {
      if (error.code && error.code == 11000) {
        throw new ServiceError(error.message, 409, `Campos já existentes`);
      }
      throw new ServiceError(
        error.message,
        400,
        "Por favor, verifique os dados"
      );
    }
  }

  /**
   *
   * @param {Model} db moogose model
   * @param {Object} dados request changes
   * @param {Model} entidade instance of for model
   * @returns
   */
  async atualizar(db, dados, entidade, eventEmitter = appEvent) {
    try {
      console.log("atualizar");
      delete dados.id;
      delete dados._id;

      entidade.historico = clearObject(entidade);

      await db.findByIdAndUpdate(entidade._id, dados);

      const atualizado = await db.findById(entidade._id);

      //eventEmitter.emit(this.referencia, "ATUALIZAR", clearObject(atualizado));

      return atualizado;
    } catch (error) {
      throw new ServiceError(
        error.message || error,
        400,
        `Não foi possivel atualizar`
      );
    }
  }

  /**
   *
   * @param {Model} db moogose model para
   * @param {Model} entidade instance of for model
   * @returns
   */
  async deletar(db, entidade, eventEmitter = appEvent) {
    try {
      entidade.historico = clearObject(entidade);

      const obj = this.referencia;

      await entidade.delete();

      eventEmitter.emit(this.referencia, "DELETAR", clearObject(entidade));

      return {
        message: `registro ${obj} deletado com sucesso!`,
      };
    } catch (error) {
      throw new ServiceError(error.message, 400, `Nenhum resultado encontrado`);
    }
  }
  /**
   *
   * @param {Model} db model injetada
   * @param {string} referencia nome da base de dados
   */

  constructor(referencia) {
    this.referencia = referencia;
    this.populate = NestedCollection;
  }
}

class LoginCrud extends BaseCrud {
  /**
   *
   * @param {Model} db
   * @param {Jwt} jwt
   * @param {string} email
   * @param {string} senha
   * @returns
   */
  async entrar(db, jwt, email, senha, instituicaoId = null) {
    try {
      const encontrado = await db.findOne({ email });
      if (!encontrado) throw "Usuario não encontrado!";
      const senhaValida = await bcrypt.compare(senha, encontrado.senha);
      if (!senhaValida) throw "senha invalida";

      instituicaoId = instituicaoId || encontrado.instituicoes.instituicao_id;

      if (!instituicaoId) throw "instituicao id é requirida";

      const token = jwt.generate({
        id: encontrado._id,
        instituicaoId,
      });

      const {
        payload: { exp },
        header: { typ: type },
      } = jwt.decode("Jwt " + token);

      const expiresAt = exp;

      const cutEmail = (email) =>
        `${email.slice(0, parseInt(email.split("@")[0].length / 3))}****@${
          email.split("@")[1]
        }`;
      const logMessage = (email) =>
        log.sucess(
          `[LOGIN] loggin as ${new Date().toISOString()} email: ${cutEmail(
            email
          )}`
        );

      logMessage(email);

      return {
        token,
        token_prefix: `Baerer`,
        type,
        acessType: this.referencia,
        expiresAt,
        generate: new Date().toISOString(),
      };
    } catch (error) {
      throw new ServiceError(
        error.message || error,
        404,
        "Usuario ou senha invalida"
      );
    }
  }
  constructor(referencia) {
    super(referencia);
    this.referencia = referencia;
  }
}

module.exports = {
  BaseCrud,
  LoginCrud,
  NestedCollection,
};
