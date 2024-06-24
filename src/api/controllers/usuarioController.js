const facade = require("../facade/UsuariosFacade")();
const filterResponse = require("./utils/filterResponse");
const ServiceError = require("../err/ServiceError");
const MultiplosConvitesUseCase = require("../usecases/ConviteParaMultiplosUsuariosUsecase");
const InstituicaoMembrosUsecase = require("../usecases/InstituicaoMembrosUsecase");
const InstituicaoColaboradoresUsecase = require("../usecases/InstituicaoColaboradoresUsecase");
const UsuarioRecuperarSenhaUsecase = require("../usecases/UsuarioRecuperarSenhaUseCase");
const InstituicaoFacade = require("../facade/InstituicaoFacade")();
const conviteService = require("../services/ConviteService")();
const CodigoGerador = require("..//models/utils/conviteCodigoGerador");
const adicionarAdmistrador = require("../events/jobs/instituicao/adicionarAdmistrador");
const removerAdmistrador = require("../events/jobs/instituicao/removerAdmistrador");

const usuarioDto = (entidade) => {
  const response = filterResponse(entidade, [
    "nome",
    "cpf",
    "email",
    "tipo_de_usuario",
    "status",
    "_id",
  ]);
  if (entidade.dados_sensiveis)
    response.dados_sensiveis = Object.assign(
      response,
      filterResponse(response.dados_sensiveis, [
        "whatsapp",
        "endereco",
        "genero",
      ])
    );
  return response;
};

module.exports = {
  interceptor: async (req, res, next, usuario_id) => {
    try {
      const entidade = await facade.obterPorId(usuario_id);
      req.locals.entidade = entidade;
      next();
    } catch (error) {
      return next(error);
    }
  },

  listarTodos: async (req, res, next) => {
    try {
      const instituicaoId = req.locals.client.instituicaoId;
      req.query.instituicaoId = instituicaoId;
      console.log(req.query);
      const todos = await facade.todos(req.query);

      return res.status(200).json({ size: todos.length, data: todos });
    } catch (error) {
      return next(error);
    }
  },

  listarPontos: async (req, res, next) => {
    try {
      const instituicaoId = req.locals.client.instituicaoId;
      req.query.instituicaoId = instituicaoId;
      const usuarios = await facade.todos(req.query);

      const pontuacao = [];

      usuarios.forEach((usuario) => {
        let pontosAcu = 0;
        const pontuacoes = usuario.pontuacao;
        pontuacoes.forEach((ponto) => {
          pontosAcu = pontosAcu + ponto.valor;
        });
        const data = {
          _id: usuario._id,
          pontuacao_acumulada: pontosAcu,
          nome: usuario.nome,
          apelido: usuario.apelido,
          foto: usuario.foto,
          whatsapp: usuario.whatsapp || usuario.telefone,
          tipo_de_usuario: usuario.tipo_de_usuario,
          status: usuario.status,
          pontuacao: usuario.pontuacao,
        };
        pontuacao.push(data);
      });

      const ranking = pontuacao.sort(function (a, b) {
        if (a.pontuacao_acumulada < b.pontuacao_acumulada) {
          return 1;
        } else if (a.pontuacao_acumulada > b.pontuacao_acumulada) {
          return -1;
        }
        return 0;
      });

      // console.log(ranking);

      return res.status(200).json(ranking);
    } catch (error) {
      return next(error);
    }
  },

  listarPontosAberto: async (req, res, next) => {
    try {
      const instituicaoId = req.locals.client.instituicaoId;
      req.query.instituicaoId = instituicaoId;
      const usuarios = await facade.todos(req.query);

      const pontuacao = [];

      usuarios.forEach((usuario) => {
        let pontosAcu = 0;
        const pontuacoes = usuario.pontuacao;
        pontuacoes.forEach((ponto) => {
          pontosAcu = pontosAcu + ponto.valor;
        });

        const data = {
          _id: usuario._id,
          pontuacao_acumulada: pontosAcu,
          nome: usuario.nome,
          apelido: usuario.apelido,
          foto: usuario.foto,
        };
        pontuacao.push(data);
      });

      const ranking = pontuacao.sort(function (a, b) {
        if (a.pontuacao_acumulada < b.pontuacao_acumulada) {
          return 1;
        } else if (a.pontuacao_acumulada > b.pontuacao_acumulada) {
          return -1;
        }
        return 0;
      });

      return res.status(200).json(ranking);
    } catch (error) {
      return next(error);
    }
  },

  busca: async (req, res, next) => {
    const { estado, localidade, bairro } = req.query;
    const Estado = [];
    const Localidade = [];
    const Bairro = [];

    try {
      const instituicaoId = req.locals.client.instituicaoId;
      req.query.instituicaoId = instituicaoId;
      const todos = await facade.todos(req.query);

      if (bairro) {
        for (let index = 0; index < todos.length; index++) {
          if (
            bairro === todos[index].endereco.bairro &&
            localidade === todos[index].endereco.localidade &&
            estado === todos[index].endereco.uf
          ) {
            Bairro.push(todos[index]);
          }
        }
        if (Bairro.length > 0) {
          return res.status(200).json({
            uf: estado,
            localidade: localidade,
            bairro: bairro,
            quantidade: Bairro.length,
            data: Bairro,
          });
        }
        return res.status(200).json("Bairro não encontrado");
      }

      if (localidade) {
        for (let index = 0; index < todos.length; index++) {
          if (
            localidade === todos[index].endereco.localidade &&
            estado === todos[index].endereco.uf
          ) {
            Localidade.push(todos[index]);
          }
        }
        if (Localidade.length > 0) {
          return res.status(200).json({
            uf: estado,
            localidade: localidade,
            quantidade: Localidade.length,
            data: Localidade,
          });
        }
        return res.status(200).json("Nenhum resultado encontrado");
      }

      if (estado) {
        for (let index = 0; index < todos.length; index++) {
          if (estado === todos[index].endereco.uf) {
            Estado.push(todos[index]);
          }
        }
        if (Estado.length > 0) {
          return res.status(200).json({
            uf: estado,
            quantidade: Estado.length,
            data: Estado,
          });
        }
      }

      return res.status(200).json("Nenhum resultado encontrado");
    } catch (error) {
      return next(error);
    }
  },

  listarColaboradores: async (req, res, next) => {
    try {
      const instituicaoId = req.locals.client.instituicaoId;
      req.query.instituicaoId = instituicaoId;
      const todos = await facade.todos(req.query);
      const colaboradores = [];

      for (let index = 0; index < todos.length; index++) {
        if (todos[index].tipo_de_usuario === "COLABORADOR") {
          colaboradores.push(todos[index]);
        }
      }
      // console.log(colaboradores);

      return res.status(200).json({
        msg: "Colaboradores",
        size: colaboradores.length,
        data: colaboradores,
      });
    } catch (error) {
      return next(error);
    }
  },

  listarAssociados: async (req, res, next) => {
    try {
      const instituicaoId = req.locals.client.instituicaoId;
      req.query.instituicaoId = instituicaoId;
      const todos = await facade.todos(req.query);
      const associados = [];

      for (let index = 0; index < todos.length; index++) {
        if (
          todos[index].tipo_de_usuario === "ASSOCIADO" ||
          todos[index].tipo_de_usuario === "MEMBRO" ||
          todos[index].tipo_de_usuario === "FILIADO"
        ) {
          associados.push(todos[index]);
        }
      }

      return res.status(200).json({
        msg: "Associados",
        size: associados.length,
        data: associados,
      });
    } catch (error) {
      return next(error);
    }
  },

  listarUm: async (req, res, next) => {
    const { entidade, client } = req.locals;
    try {
      const usuario = await facade.obterPorDto(entidade, req.locals.access);
      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  },

  listarUmRecurso: async (req, res, next) => {
    const { entidade } = req.locals;
    const recurso = entidade[req.params.recurso];

    if (!recurso) {
      return res.status(404).json({
        message: "Not Found",
        detalhes: "Recurso não encontrado!",
        code: 404,
      });
    }

    return res.status(200).json(recurso);
  },

  inserirUm: async (req, res, next) => {
    try {
      const novoCriado = await facade.criar(req.body);

      return res.status(201).json(novoCriado);
    } catch (error) {
      next(error);
    }
  },

  editarUm: async (req, res, next) => {
    const { entidade } = req.locals;
    const novasInfos = req.body;

    try {
      const atualizado = await facade.atualizar(
        novasInfos,
        entidade,
        req.locals.access
      );
      if (
        atualizado.tipo_de_usuario === "COLABORADOR" ||
        atualizado.tipo_de_usuario === "ADMIN"
      ) {
        adicionarAdmistrador(atualizado);
      } else {
        /*         console.log(atualizado._id);
        console.log(atualizado.instituicoes.instituicao_id); */
        removerAdmistrador(atualizado);
      }
      return res.status(200).json(atualizado);
    } catch (error) {
      return next(error);
    }
  },

  deletarUm: async (req, res, next) => {
    const { entidade } = req.locals;
    try {
      const message = await facade.deletar(entidade);
      return res.status(200).json(message);
    } catch (error) {
      return next(error);
    }
  },
  inserirUmComConvite: async (req, res, next) => {
    /**
     * Na ideia inicial convite seria validado por um codigo de 6 digitos contendo letras e numeros,
     * no entanto, pensando na melhor evolução / adesão ao produto foi sugerido que deveria ser algo mais simples
     * pensando nisso, na pratica o codigo ou é o {codigo} ou {conviteUri} e o endpoit passou a ser público
     */
    try {
      const novoCriado = await facade.criarComConvite(
        Object.assign(req.body, {
          codigo: req.params.codigo,
        })
      );
      return res.status(200).json(novoCriado);
    } catch (error) {
      next(error);
    }
  },

  recuperarSenha: async (req, res, next) => {
    console.log("recuperar senha");
    const recuperarSenhaRequest = Object.assign(req.body);

    try {
      const codigo = {
        codigo: CodigoGerador(),
      };
      const usuario = await facade.obterPorEmail(recuperarSenhaRequest.email);
      const novoCriado = await UsuarioRecuperarSenhaUsecase.recuperarSenha(
        usuario,
        codigo
      );

      return res.status(200).json({
        msg: "Codigo enviado para o email",
        email: recuperarSenhaRequest.email,
      });
    } catch (error) {
      return res.status(404).json({ msg: "email nao encontrado" });
    }
  },

  alteraSenha: async (req, res, next) => {
    console.log("Alterar senha");
    const novaSenhaRequest = Object.assign(req.body);
    const Codigo = req.params.codigo;

    let autorizado = false;
    try {
      const usuario = await facade.obterPorEmail(novaSenhaRequest.email);
      const Senha = {
        senha: novaSenhaRequest.senha,
        comApi: usuario.dados_sensiveis.comApi,
      };
      const recuperarBanco = usuario.recuperarSenha;
      if (recuperarBanco[recuperarBanco.length - 1].codigo === Codigo) {
        console.log("autorizado");
        autorizado = true;
      }

      if (autorizado) {
        const atualizado = await facade.atualizar(Senha, usuario);
        return res.status(200).json({ msg: "senha alterada" });
      }

      return res.status(404).json({ msg: "troca de senha nao autorizada" });
    } catch (error) {
      return res.status(404).json({ msg: "troca de senha nao autorizada" });
    }
  },

  convite: async (req, res, next) => {
    //console.log(req.locals.client.id);
    try {
      const response = await facade.convite(
        Object.assign(req.body, { criadorId: req.locals.client.id })
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  },

  emailtoken: async (req, res, next) => {
    try {
      const response = await facade.convite(
        Object.assign({
          email: req.params.email,
          cpf: req.params.cpf,
          datanasc: req.params.datanasc,
          criadorId: req.params.instituicaoId,
          geradoPor: req.params.instituicaoId,
          instituicaoId: req.params.instituicaoId,
          tipo_de_usuario: "FILIADO",
          tipo: "EMAIL",
        })
      );
      return res.status(200).json({
        cpf: response.cpf,
        datanasc: response.datanasc,
        email: response.email,
        instituicaoId: response.instituicaoId,
        instituicaoTipo: response.instituicaoTipo,
        status: response.status,
        tipo: response.tipo,
        usuarioTipo: response.usuarioTipo,
        _id: response._id,
      });
    } catch (error) {
      return next(error);
    }
  },

  buscaCpf: async (req, res, next) => {
    const cpf = req.params.cpf;
    const instituicaoId = req.params.instituicaoId;

    console.log(cpf);
    console.log(instituicaoId);
    try {
      const usuarios = await facade.todos({ instituicaoId: instituicaoId });

      let usuario = usuarios.find(function (usuario) {
        return usuario._cpf === cpf;
      });

      if (usuario) {
        return res.status(401).json({
          msg: "ID já emitida para esse usuario",
          email: usuario.email,
          status: false,
        });
      } else {
        return res
          .status(200)
          .json({ msg: "Usuario não cadastrado", status: true });
      }

      // console.log(usuarios);

      //let busca = await
      return res.status(200).json(usuarios);
    } catch (error) {
      return next(error);
    }
  },

  deletarConvite: async (req, res, next) => {
    try {
      const message = await conviteService.deletar(req.params.convite_id);
      return res.status(200).json(message);
    } catch (error) {
      return next(error);
    }
  },

  validarConvite: async (req, res, next) => {
    try {
      const response = await facade.validarConvite(req.params.codigo);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  },

  multiplosConvites: async (req, res, next) => {
    try {
      const fila = MultiplosConvitesUseCase(req.body);
      res.status(200).json({
        ultima_atualizacao: new Date().toISOString(),
        fila: fila,
      });
    } catch (error) {
      next(error);
    }
  },
  /**
   * operações do usuario de seus próprios dados dentro de sua instituição
   */
  instituicao: {
    middlewareEncontrarInstituicao: async (req, res, next) => {
      const { client } = req.locals;
      const hasIdook = req.access === "IDOOK";
      const options = {
        colaboradores: true,
        associados: true,
      };

      try {
        const instuicaoId = hasIdook
          ? req.body.instituicaoId
          : client.instituicaoId;

        const instituicao = await InstituicaoFacade.obterPorId(
          instuicaoId,
          options
        );

        req.locals.instituicao = instituicao;

        return next();
      } catch (error) {
        next(error);
      }
    },

    editarUm: async (req, res, next) => {
      const request = req.body;
      const { client, instituicao } = req.locals;
      const { usuario_id, collection } = req.params;
      try {
        if (collection == "membro") {
          const membroAtualizado = await InstituicaoMembrosUsecase.atualizar(
            instituicao,
            usuario_id,
            request
          );
          return res.status(200).json(membroAtualizado);
        }

        if (collection == "colaborador") {
          const colaboradorAtualizado =
            await InstituicaoColaboradoresUsecase.atualizar(
              instituicao,
              usuario_id,
              request
            );
          return res.status(200).json(colaboradorAtualizado);
        }

        next(
          new ServiceError(
            "Coleção invalida",
            500,
            "Ocorreu um erro, tente novamente mais tarde."
          )
        );
      } catch (error) {
        next(error);
      }
    },

    obterUm: async (req, res, next) => {
      const { client, instituicao } = req.locals;
      const { usuario_id, collection } = req.params;
      try {
        if (collection == "membro") {
          const dados = await InstituicaoMembrosUsecase.obterPorId(
            instituicao,
            usuario_id
          );
          return res.status(200).json(dados);
        }

        if (collection == "colaborador") {
          const dados = await InstituicaoColaboradoresUsecase.obterPorId(
            instituicao,
            usuario_id
          );
          return res.status(200).json(dados);
        }

        next(
          new ServiceError(
            "Coleção invalida",
            500,
            "Ocorreu um erro, tente novamente mais tarde."
          )
        );
      } catch (error) {
        next(error);
      }
    },
  },
};
