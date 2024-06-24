const { NestedCollection, BaseCrud } = require("../services/utils/Crud");
const ServiceError = require("../err/ServiceError");
const crud = new BaseCrud("usuario");
const POPULATE = "recuperarSenha";
const event = require("../events/appEvent");

module.exports = class {
  /**
   *
   * @param {entidade} usuario instituicao já encontrada pelo id
   * @param {Request} recuperarSenha
   * @param {EventEmitter?} event
   * @returns
   */

  static async recuperarSenha(usuario, recuperar) {
    console.log(recuperar);
    console.log(usuario.email);
    try {
      const recuperarSenha = crud.populate.adicionar(
        usuario,
        POPULATE,
        recuperar
      );

      usuario.recuperarSenha = recuperarSenha;
      await usuario.save();

      event.emit(
        "recuperarSenha",
        {
          email: usuario.email,
          codigo: recuperar.codigo,
        },
        "https://app.idook.com.br"
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
