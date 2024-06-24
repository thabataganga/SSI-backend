const conviteDb = require("../models/conviteModels");
const conviteService = {};
const ServiceError = require("../err/ServiceError");
const conviteModel = require("../models/conviteModels");
const instituicaoDb = require("../models/InstituicoesModel");
const event = require("../events/appEvent");

const log = require("../log/index");

// CRUD
const Model = require("../models/conviteModels");
const Crud = require("./utils/Crud").BaseCrud;
const crud = new Crud("convite");

module.exports = (model = Model) => {
  return {
    /**
     * @param {Tipo} usuarioType tipo de usuario
     * @param {Jwt} jsonwebtoken token de acesso
     * @param {Request} entidade requisicao com os dados do convite
     * @returns {Promise<Result>}
     */
    async criar(usuarioTipo, conviteRequisicao) {
      const {
        email,
        instituicaoId,
        criadorId,
        geradoPor,
        tipo,
        conviteUri,
        cpf,
        datanasc,
      } = conviteRequisicao;

      const instituicao = await instituicaoDb.findById(instituicaoId);
      if (!instituicao) throw "O usuario não possui uma instituicao";
      conviteRequisicao.instituicaoTipo = instituicao.tipo;

      const emailStatus = "ATIVACAO_PENDENTE";
      const linkStatus = "HABILITADO";
      const conviteStatus = tipo === "LINK" ? linkStatus : emailStatus;

      const convite = new conviteModel({
        tipo,
        usuarioTipo,
        email,
        instituicaoId,
        geradoPor,
        instituicaoTipo: conviteRequisicao.instituicaoTipo,
        status: conviteStatus,
        conviteUri,
        cpf,
        datanasc,
      });

      convite.url = getLinkUrl(
        (tipo === "LINK" && conviteUri) || convite.codigo
      );

      log.info(`Criando convite... type: ${convite.tipo}`);

      try {
        const conviteSalvo = await convite.save();

        log.info("convite gerado com sucesso"); // criar envento para o convite

        if (email) {
          event.emit("convite", {
            instituicaoNome: instituicao.nome_fantasia,
            email,
            url: convite.url,
            codigo: convite.codigo,
          });
        }

        console.log(`Codigo: ${convite.codigo}`);

        return conviteSalvo;
      } catch (error) {
        console.error(`Falha ao gerar o convite, detalhes: ${error.message}`);
        throw new ServiceError(
          error.message,
          400,
          "Ocorreu um erro ao salvar, verifique os dados e tente novamente."
        );
      }
    },

    async deletar(conviteId) {
      const convite = await crud.obterPorId(Model, conviteId);
      return await crud.deletar(Model, convite);
    },

    async obterPorId(conviteId) {
      const convite = await crud.obterPorId(Model, conviteId);
      return convite;
    },

    /**
     *
     * @param {ObjectId} id id referencia mongoose
     * @deprecated talves essa função tenha deixado de fazer sentido
     */
    async sucesso(id, conviteTipo) {
      const convite = await crud.obterPorId(model, id);

      if (conviteTipo == "EMAIL") {
        convite.status = "UTILIZADO";
      }

      await convite.save();
    },

    /**
     *
     * @param {Baerer Token} token token salva no banco de dados
     * @param {String} codigo Codigo de 6 Destinatario ou a uri do convite
     * @param {String} email do usuario
     */
    async validarCodigo(codigo, email, regras = true) {
      try {
        let convite = await conviteDb.findOne({
          $or: [{ codigo }, { conviteUri: codigo, status: "HABILITADO" }],
        });

        // console.log(codigo);
        //  console.log(convite);
        if (convite === null) {
          convite = await conviteDb.findOne({ conviteUri: codigo });
          // console.log("teste", convite);
        }

        if (tipoNaoValido(convite)) throw "O convite não é valido";

        if (regras) conviteRegras(convite, email); // execulta as regras de negocio com base no tipo de convite

        return convite;
      } catch (error) {
        if (error instanceof ServiceError) throw error;
        throw new ServiceError(
          error.message,
          500,
          "Ocorreu um erro inesperado ao validar o convite."
        );
      }
    },

    /**
     * @deprecated atualmente não existe filtro por queryParams
     * @param {string} instituicaoId
     * @returns
     */
    async todos(instituicaoId, consultaRequest = {}) {
      let { limite = 10, pagina = 1 } = consultaRequest;
      limite = +limite;
      pagina = +pagina;

      const inicio = (pagina - 1) * limite;

      const convites = await crud.todos(model, { instituicaoId });

      if (convites.slice(inicio, inicio + limite).length == 0) {
        throw new ServiceError(
          "nenhum resultado encotrado para a requisicao. " +
            "Total de convites: " +
            convites.length,
          "400",
          "Nenhum resultado encontrado para a pagina"
        );
      }

      const convitesFiltrados = JSON.parse(JSON.stringify(convites));
      const totalFiltrado = convitesFiltrados.length;

      if (totalFiltrado == 0) {
        throw new ServiceError(
          "Nenhum resutlado encontrado para a query",
          "404",
          "Nenhum resultado encontrado para a busca"
        );
      }

      const convitesPaginados = convitesFiltrados.slice(
        inicio,
        inicio + limite
      );

      return {
        exibindo: `${inicio + convitesPaginados.length} de ${totalFiltrado}`,
        total_de_paginas: Math.ceil(totalFiltrado / limite),
        total_de_convites: convitesPaginados.length,
        paginaAtual: pagina,
        convites: convitesPaginados,
      };
    },
  };
};

const tipoNaoValido = (convite) => !conviteRegrasTipo[convite.tipo];

const conviteRegrasTipo = {
  EMAIL: (convite, email) => {
    const message =
      "O usuario não possui permissão para acessar esse recurso, " +
      "caso o erro persista contate o admistrador";

    if (convite.email != email) {
      throw new ServiceError("Email invalido", 401, message);
    }

    if (convite.status == "ATIVO") {
      throw new ServiceError(
        "Código já utilizado",
        401,
        "Esse código de recuperação já foi utilizado."
      );
    }
  },

  LINK: (convite) => {
    if (convite.status == "EXPIRADO") {
      throw new ServiceError(
        "Código já utilizado",
        400,
        "Esse código de recuperação já foi utilizado."
      );
    }
  },
};

const conviteRegras = (convite, email = null) =>
  conviteRegrasTipo[convite.tipo](convite, email);

const getLinkUrl = (param) => {
  const defaulDomain = process.env.FRONT_URL || "http://localhost:3000";
  const defaultPath = process.env.FRONT_CONVITE_PATH || "convite";
  return `${defaulDomain}/${defaultPath}/${param}`;
};
exports.conviteRegras = conviteRegras;
