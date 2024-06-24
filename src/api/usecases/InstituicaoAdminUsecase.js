const {
  NestedCollection: { obterPorId, adicionar },
} = require("../services/utils/Crud");

const { BaseCrud } = require("../services/utils/Crud");

const COLLECTION = "admistradores";
const crud = new BaseCrud("instituicao");

const ServiceError = require("../err/ServiceError");

/**
 *
 * @param {Service} usuarioService
 * @param {Model} instituicaoModel
 * @returns
 */
module.exports = (usuarioService, instituicaoModel) => {
  /**
   * usar flap map para consultas cacheadas
   */
  return class {
    static async encontrarUsuarioAdmin(usuarioId, instituicaoId) {
      const usuario = await usuarioService.obterPorId(usuarioId);
      if (usuario.instituicoes.instituicao_id != instituicaoId)
        throw "O usuario não é da mesma instituicao";

      const instituicao = await instituicaoModel
        .findById(instituicaoId)
        .populate(COLLECTION);

      if (!instituicao) throw "O usuario não possui uma instituicao";

      try {
        obterPorId(instituicao, COLLECTION, usuarioId);
        return usuario;
      } catch (error) {
        throw "O usuario não é um admin";
      }
    }

    static async remover(usuarioId, instituicao) {
      try {
        const adms = crud.populate.remover(instituicao, COLLECTION, usuarioId);

        instituicao[COLLECTION] = adms;

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

    static async encontrarUsuarioAdminPorEmail(email, instituicaoId) {
      const usuario = await usuarioService.obterPorEmail(email);
      if (usuario.instituicoes.instituicao_id != instituicaoId)
        throw "O usuario não é da mesma instituicao";

      const instituicao = await instituicaoModel
        .findById(instituicaoId)
        .populate(COLLECTION);

      if (!instituicao) throw "O usuario não possui uma instituicao";

      try {
        obterPorId(instituicao, COLLECTION, usuario._id);
        return usuario;
      } catch (error) {
        throw "O usuario não é um admin";
      }
    }

    static async criar(usuarioRequest, instituicaoService) {
      try {
        const instituicao = await instituicaoService.obterPorId(
          usuarioRequest.instituicoes.instituicao_id,
          COLLECTION
        );

        const camposUnicos = ["_id"];
        const admistradoresAtualizados = adicionar(
          instituicao,
          COLLECTION,
          usuarioRequest,
          ...camposUnicos
        );

        instituicao.admistradores = admistradoresAtualizados;
        await instituicao.save();

        return usuarioRequest;
      } catch (error) {
        console.error(error);
        if (error instanceof ServiceError) throw error;
        throw new ServiceError(
          error.message || error,
          500,
          "Ocorreu um erro. 2"
        );
      }
    }
  };
};
