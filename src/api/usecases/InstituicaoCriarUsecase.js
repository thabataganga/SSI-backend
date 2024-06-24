const mongoose = require("mongoose");

module.exports = class {
  /**
   *
   * @param {Usuario} entidade request body
   * @param {Function} save  callback de salvar
   * @returns
   */

  static criar(requestInstituicao, id = new mongoose.Types.ObjectId()) {
    try {
      const {
        nome_fantasia,
        tipo,
        privacidade,
        email,
        senha,
        slug,
        endereco,
        identidade_visual,
        redes_sociais,
        status = "ATIVACAO_PENDENTE",
      } = requestInstituicao;

      return {
        _id: id,
        nome_fantasia,
        tipo,
        privacidade,
        email,
        senha,
        slug,
        endereco,
        identidade_visual,
        redes_sociais,
        status,
      };
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
};
