const instituicaoDadosPrivacidadeConfig = require("../../config/instituicaoDadosPrivacidadeConfig");

module.exports = (model, EventEmitter, usuarioModel) => {
  const mongoose = require("mongoose");
  const ServiceError = require("../err/ServiceError");

  // services
  const usuarioService = require("./UsuariosFacade")(usuarioModel);
  const eventEmitter = EventEmitter || require("../events/appEvent");

  // CRUD
  const UsuarioModel = usuarioModel || require("../models/UsuariosModel");
  const Model = model || require("../models/InstituicoesModel");
  const LoginCrud = require("../services/utils/Crud").LoginCrud;
  const crud = new LoginCrud("instituicao");

  // autenticacao
  const roles = require("../../config/privilegios/instituicao_assinatura");
  const jwt = require("../modules/JwtModulo").Builder("CRIAR", { roles });
  const InstituicaoLoginFluxo = require("../usecases/InstituicaoLoginFluxo")(
    Model,
    UsuarioModel,
    jwt
  );

  // regras
  const conviteService = require("../services/ConviteService")();
  const InstituicaoCriarUsecase =
    require("../usecases/InstituicaoCriarUsecase").criar;
  const AdminUsecase = require("../usecases/InstituicaoAdminUsecase")(
    usuarioService,
    Model
  );
  const InstituicaoAlertaUsecase = require("../usecases/InstituicaoAlertaCrudUsecase");

  const getAcesso = (acesso) => {
    if (acesso.includes("INSTITUICAO") || acesso == "IDOOK") return true;
  };
  return class InstituicaoFacade {
    /** auth */
    static async entrar(email, senha) {
      return await InstituicaoLoginFluxo.auth(email, senha, crud.entrar);
    }

    /** crud operações **/
    static async criar(
      requestInstituicao,
      _id = new mongoose.Types.ObjectId()
    ) {
      return await crud.criar(
        Model,
        InstituicaoCriarUsecase(requestInstituicao),
        eventEmitter,
        _id
      );
    }

    /**s
     *
     * @param {UsuarioModel} usuarioId id de referecia do usuario
     */
    static async adicionarAdmistrador(usuarioModel) {
      return await AdminUsecase.criar(usuarioModel, this);
    }
    static async removerAdmistrador(usuarioId, instituicao) {
      return await AdminUsecase.remover(usuarioId, instituicao);
    }

    static async obterUsuarioAdmin(usuarioId, instituicaoId) {
      return await AdminUsecase.encontrarUsuarioAdmin(usuarioId, instituicaoId);
    }

    static async obterUsuarioAdminPorEmail(email, instituicaoId) {
      return await AdminUsecase.encontrarUsuarioAdminPorEmail(
        email,
        instituicaoId
      );
    }

    static async obterComPopulate(id, populate, acesso = "") {
      try {
        if (!id) throw "id da instituicao requirido";

        const instituicao = await Model.findOne(
          { _id: id },
          instituicaoDadosPrivacidadeConfig.exclude
        ).populate(populate);

        if (!instituicao) throw "instituicao não encontrada";
        return instituicaoDto(instituicao, getAcesso(acesso));
      } catch (error) {
        if (error instanceof String) {
          throw new ServiceError(error, 400, "Instituicao não encontrada");
        }
        throw new ServiceError(
          error.message,
          500,
          "O servidor se encontra indisponivel no momento"
        );
      }
    }

    static async obterPorId(id, opcoes) {
      return await crud.obterPorId(Model, id, opcoes);
    }

    static async obterPorEmail(email) {
      return await crud.obterPorEmail(Model, email);
    }

    static async todos(filtro) {
      return await crud.todos(Model, filtro);
    }

    static async atualizar(dadosRequisitado, entidade) {
      return await crud.atualizar(
        Model,
        dadosRequisitado,
        entidade,
        eventEmitter
      );
    }

    static async deletar(entidade) {
      return await crud.deletar(Model, entidade, eventEmitter);
    }

    /** convites */
    static async todosOsConvites(instituicaoId, queryParams) {
      return await conviteService.todos(instituicaoId, queryParams);
    }
  };
};

const instituicaoDto = (instituicao, complete) => {
  if (complete) return instituicao;

  instituicao = JSON.parse(JSON.stringify(instituicao));

  for (const key of instituicaoDadosPrivacidadeConfig) {
    if (instituicao[key]) delete instituicao[key];
  }

  return instituicao;
};
