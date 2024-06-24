const InstituicaoLiderancasController = require("../controllers/colecoes/InstituicaoLiderancasController");
const ServiceError = require("../err/ServiceError");
const log = require("../log");
const usuarioDadosPrivacidadeConfig = require("../../config/usuarioDadosPrivacidadeConfig");

module.exports = (model, EventEmitter) => {
  const mongoose = require("mongoose");

  const eventEmitter = EventEmitter || require("../events/appEvent");

  // antenticacao
  const roles = require("../../config/privilegios/usuario_assinatura");
  const jwt = require("../modules/JwtModulo").Builder("CRIAR", { roles });

  // CRUD
  const Model = model || require("../models/UsuariosModel");
  const LoginCrud = require("../services/utils/Crud").LoginCrud;
  const crud = new LoginCrud("usuario");

  // regras
  const usuarioUsecase = require("../usecases/UsuarioCriarUsecase");
  const conviteUsecase = require("../usecases/UsuarioConviteFluxoUsecase")();

  // cliente
  const externalApi = require("../../infra/externalApiClient");

  /**
   *
   * @param {usuario} usuario
   * @param {*} complete dados completos , disponivel somente para a IDOOK ou o proprio usuario
   * @returns usuario
   */
  const usuarioDto = (usuario, complete = false) => {
    if (!usuario) throw "Ocorreu um erro";

    /**
     * Cria um setup para poder fazer a serialização dos dados
     */
    usuario = clearObject(usuario);

    const id = usuario._id;

    if (!usuario.dados_sensiveis) usuario.dados_sensiveis = {};

    if (!usuario.dados_sensiveis.dados) usuario.dados_sensiveis.dados = {};

    usuarioResponse = {
      ...usuario,
      ...usuario.dados_sensiveis,
      ...usuario.dados_sensiveis.dados,
    };

    delete usuarioResponse.dados_sensiveis;
    delete usuarioResponse.dados;

    usuarioResponse._id = id;

    /**
     * {bolean} -> caso seja true retorna todos os dados do usuario
     */

    if (complete) return usuarioResponse;

    /**
     * Interable -> deleta todos os dados presentes na raiz do arquivo, no momento não há suporte para nesteds
     * sugestão para o futuro -> trabalhar com mascaras  ex:  cpf : 1**.456.**9-00
     */

    for (const key of usuarioDadosPrivacidadeConfig) {
      if (usuarioResponse[key]) delete usuarioResponse[key];
    }

    return usuarioResponse;
  };

  const emptyObject = (o = {}) => {
    if (o === null) {
      return true;
    }
    Object.keys(o).length === 0;
  };

  const emptyValue = (v = "") => v.toString().trim() === "";

  const clearObject = (o = {}) => JSON.parse(JSON.stringify(o));

  const isNullOrFalse = (v) => {
    if (!v) return false;
    return emptyValue(v);
  };

  const isNotNullOrFalse = (v) => (v ? true : false);

  /**
   * @description função que mapea os dados externos do usuario
   */
  const mapExternalData = async (usr) => {
    const { dados_sensiveis: { api = {} } = {} } = usr;

    if (emptyObject(api)) return; // apenas ignora

    if (api) {
      const { url, headers = {} } = api;

      // console.log(api);

      try {
        /* const dados = await externalApi({
          method: "GET",
          url,
          headers,
        });

        usr.dados_sensiveis.dados = dados.data;

        return usr; */
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  };

  return {
    async criar(entidade, _id = new mongoose.Types.ObjectId()) {
      const { comApi } = entidade;
      const dados_sensiveis = { comApi };

      if (comApi === true) {
        dados_sensiveis.api = entidade.api_dados;
      }

      if (comApi === false) {
        dados_sensiveis.dados = entidade;
      }

      if (typeof comApi != "boolean") {
        throw new ServiceError("comApi is null", 400, "Verifique os dados");
      }

      entidade.dados_sensiveis = dados_sensiveis;

      return await crud.criar(
        Model,
        usuarioUsecase.criar(entidade),
        eventEmitter,
        _id
      );
    },

    async entrar(email, senha) {
      return await crud.entrar(Model, jwt, email, senha);
    },

    async obterPorId(id, dto) {
      const usuario = await crud.obterPorId(Model, id);
      const comDto = (usr) => (dto ? usuarioDto(usr) : usr);
      try {
        const usuarioComApi = await mapExternalData(usuario);

        if (usuarioComApi) return comDto(usuario);
      } catch (error) {
        log.error(error.message);
      }

      return comDto(usuario);
    },

    async obterPorDto(usuario, acesso = "") {
      if (acesso.includes("USUARIO") || acesso.includes("IDOOK"))
        return usuarioDto(usuario, true);
      if (acesso.includes("INSTITUICAO")) return usuarioDto(usuario, false);

      throw new ServiceError(
        "acesso: " + acesso,
        500,
        "O servidor está indisponivel no momento"
      );
    },

    async obterPorEmail(email) {
      return await crud.obterPorEmail(Model, email);
    },

    async obterPorCpf(cpf) {
      return await crud.obterPorCpf(Model, cpf);
    },

    async todos(filtro) {
      const { busca, instituicaoId } = filtro;

      const usuarios = await crud.todos(Model, { busca });

      const findInData = (dados) => {
        //console.log(dados);
        const { cpf: savedCpf = "", nome: savedName = "" } = dados;
        //console.log(dados.nome);
        if (emptyValue(savedName)) return; // apenas ignora
        return savedCpf === busca || new RegExp(busca, "i").test(savedName);
      };

      const findByProtectData = (usr = {}, index) => {
        if (!usr || emptyObject(usr.dados_sensiveis)) return;

        const { dados_sensiveis: { dados = {} } = {} } = usr;

        if (emptyObject(dados)) return; // apenas ignora

        if (dados) {
          //console.log(dados);
          return findInData(dados);
        }
      };

      const hasIdook = () => true;

      const usuariosInstituicao = usuarios.filter(
        (usr) => usr.instituicoes.instituicao_id == instituicaoId
      );

      const dadosSensiveisExternos = await Promise.all(
        usuariosInstituicao.map(mapExternalData)
      );

      const mapToDto = (usr) => {
        return usuarioDto(usr, false);
      };

      if (!busca) return usuariosInstituicao.map(mapToDto);

      const findByEmail = (usr) => {
        return usr.email === busca;
      };

      const usuariosFiltrados = usuariosInstituicao
        .filter((usr) => !usr.dados_sensiveis.comApi)
        .concat(clearObject(dadosSensiveisExternos).filter(isNotNullOrFalse))
        .filter(busca.includes("@") ? findByEmail : findByProtectData)
        .map(mapToDto);

      if (usuariosFiltrados.length == 0) {
        throw new ServiceError(
          "Nenhum resultado encontrado",
          400,
          "Nenhum resultado encontrado para a busca"
        );
      }

      return usuariosFiltrados;
    },

    async atualizar(atualizacaoRequisitada, usuario, acesso) {
      console.log(atualizacaoRequisitada);
      const { comApi } = atualizacaoRequisitada;

      const dados_sensiveis = { comApi };

      if (comApi === true) {
        dados_sensiveis.api = atualizacaoRequisitada.api_dados;
      }

      if (comApi === false) {
        const keys = [
          "cpf",
          "genero",
          "nome",
          "apelido",
          "nascimento",
          "telefone",
          "whatsapp",
          "foto",
          "matricula",
          "empresa",
          "instituicao",
        ];

        dados_sensiveis.dados = {};

        keys.forEach((key) => {
          // atualiza manual ( BUG NO ORM)

          dados_sensiveis.dados[key] =
            atualizacaoRequisitada[key] ||
            usuario.dados_sensiveis.dados[key] ||
            null;

          // bug fix - O CODIGO ESTÁ MAGICO - ele ta salvando os dados da api junto
        });
      }

      if (typeof comApi != "boolean") {
        throw new ServiceError("comApi is null", 400, "Verifique os dados");
      }

      // Caso for alterar dados sensivies, fazer a lógica de alteração manual.
      atualizacaoRequisitada.dados_sensiveis = {
        comApi,
        endereco: atualizacaoRequisitada.endereco || usuario.endereco,
        api: dados_sensiveis.api || null,
        dados: dados_sensiveis.dados || null,
      };

      const usuarioAtualizado = await crud.atualizar(
        Model,
        atualizacaoRequisitada,
        usuario,
        eventEmitter
      );

      return usuarioAtualizado;
    },

    async deletar(entidade) {
      return await crud.deletar(Model, entidade, eventEmitter);
    },

    async convite(entidade) {
      return await conviteUsecase.criar(entidade, jwt);
    },

    async deletarConvite(entidade) {
      return await conviteUsecase.deletar(entidade, jwt);
    },

    async validarConvite(codigoParams) {
      return await conviteUsecase.validar(codigoParams);
    },

    async criarComConvite(entidade) {
      return await conviteUsecase.resgatar(entidade, this.criar, jwt);
    },
  };
};
