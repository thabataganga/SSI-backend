const ConviteService = require("../services/ConviteService")();
const ServiceError = require("../err/ServiceError");
const {
  buildInstituicao,
  buildTipoConvite,
  buildTipo,
} = require("./UsuarioBuildTypes");
const AppEvent = require("../events/appEvent");
const mongoose = require("mongoose");

/**
 *
 * @param {ConviteService} conviteService conviteService para o convite
 * @returns
 */
module.exports = (conviteService = ConviteService) => {
  class ConviteUseCase {
    /**
     *
     * @param {Model} conviteRequisicao instance of model
     * @param {Jwt} jwt json web token
     * @param {EventEmitter?} event
     * @returns
     */
    static async criar(conviteRequisicao, event = AppEvent) {
      /*  console.log("teste");
      console.log(conviteRequisicao); */
      try {
        const {
          tipo,
          cpf,
          datanasc,
          tipo_de_usuario = "MEMBRO",
          conviteUri,
        } = conviteRequisicao;
        console.log(datanasc);
        const conviteUsuarioTipo = buildTipoConvite(tipo_de_usuario);
        const LINK_BASE = `${
          process.env.FRONT_URL || "localhost:3000"
        }/convite`;

        if (!cpf && tipo === "EMAIL") {
          throw new ServiceError(
            '"cpf" is required',
            400,
            "O cpf é obrigatório para o registro do usuario"
          );
        }

        if (!datanasc && tipo === "EMAIL") {
          throw new ServiceError(
            '"datanasc" is required',
            400,
            "A datanasc é obrigatório para o registro do usuario"
          );
        }

        /*  console.log(conviteUsuarioTipo);
        console.log(conviteRequisicao); */
        const novoConvite = await conviteService.criar(
          conviteUsuarioTipo,
          conviteRequisicao
        );

        // console.log(novoConvite);

        if (tipo === "EMAIL" || (tipo == "LINK" && conviteUri)) {
          return novoConvite;
        }

        throw new ServiceError(
          "conviteUri - null",
          400,
          "É requirido o uri do convite"
        );
      } catch (error) {
        if (error instanceof ServiceError) throw error;
        throw new ServiceError(error.message || error, 500, "Ocorreu um erro.");
      }
    }

    /**
     *
     * @param {Model} entidade instance of model
     * @param {Function}  callback
     * @param {EventEmitter?} event
     * @param {Object} jsonwebtoken
     * @returns
     */
    static async resgatar(entidade, criar, jwt, event = AppEvent) {
      const { codigo, email } = entidade;
      try {
        const {
          _id: conviteUsuarioId,
          instituicaoId,
          usuarioTipo,
          instituicaoTipo,
          tipo: conviteTipo,
        } = await conviteService.validarCodigo(codigo, email);

        entidade.tipo_de_usuario = buildTipo(usuarioTipo, instituicaoTipo);

        entidade.instituicoes = buildInstituicao(
          instituicaoId,
          instituicaoTipo,
          entidade.tipo_de_usuario
        );

        entidade.status = "ATIVO";

        // por padrao o ID do usuario é o mesmo do convite, mas para convites do TIPO link é necessário gerar um novo ID
        const usuarioId =
          conviteTipo === "LINK" ? mongoose.Types.ObjectId() : conviteUsuarioId;

        const usuarioSalvo = await criar(entidade, usuarioId);

        await conviteService.sucesso(conviteUsuarioId, conviteTipo);

        const baererToken = jwt.generate({
          id: usuarioId,
          instituicaoId: instituicaoId,
        });

        return Object.assign(JSON.parse(JSON.stringify(usuarioSalvo)), {
          baererToken,
        });
      } catch (error) {
        if (error instanceof ServiceError) throw error;
        throw new ServiceError(error.message || error, 500, "Ocorreu um erro.");
      }
    }
    static async validar(codigoParams) {
      console.log("fff");
      const {
        _id: conviteId,
        geradoPor,
        tipo,
        status,
        instituicaoId,
        url,
        email,
        conviteUri,
        codigo,
        cpf,
        datanasc,
      } = await conviteService.validarCodigo(codigoParams, null, false);

      //  console.log(codigoParams);
      //console.log(conviteUri);

      let valida = false;

      if (codigoParams === codigo) {
        valida = true;
      }

      if (codigoParams === conviteUri) {
        valida = true;
      }

      // console.log(`Codigo: ${valida}`);

      if (!valida) {
        throw new ServiceError(
          `Não é igual, recebido: ${codigoParams} | salvo ${codigo}`,
          400,
          "O código inserido é invalido"
        );
      }

      return {
        conviteId,
        /* geradoPor, */
        tipo,
        status,
        instituicaoId,
        /* url, */
        email,
        /* conviteUri, */
        /* codigo, */
        cpf,
        datanasc,
      };
    }

    static async todosOsConvites(instituicaoId) {
      return await conviteService.todos(instituicaoId);
    }
  }
  return ConviteUseCase;
};
