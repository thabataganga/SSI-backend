const { NestedCollection, BaseCrud } = require("../services/utils/Crud");
const ServiceError = require("../err/ServiceError");
const crud = new BaseCrud("instituicao");
const POPULATE = "recuperarSenha";
const event = require("../events/appEvent");

module.exports = class {
  /**
   *
   * @param {entidade} instituicao instituicao já encontrada pelo id
   * @param {Request} recuperarSenha
   * @param {EventEmitter?} event
   * @returns
   */

  static async recuperarSenha(instituicao, recuperar) {
    console.log(recuperar);
    console.log(instituicao.email);
    try {
      const recuperarSenha = crud.populate.adicionar(
        instituicao,
        POPULATE,
        recuperar
      );

      instituicao.recuperarSenha = recuperarSenha;
      await instituicao.save();

      event.emit(
        "recuperarSenha",
        {
          email: instituicao.email,
          codigo: recuperar.codigo,
        },
        "https://adm.idook.com.br"
      );

      return recuperarSenha;
    } catch (error) {
      if (error instanceof ServiceError) throw error;

      throw new ServiceError(
        error.message || error,
        400,
        "Não foi possivel salvar"
      );
    }
  }
};
