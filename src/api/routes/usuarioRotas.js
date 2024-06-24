const express = require("express");
const rotas = express.Router();
const sub_app = express();

/**
 * RABC
 */
const { usuario, instituicao } = require("../chain");
const AuthorizationHandler = require("../chain/AuthorizationHandler");
const criarCorpoConviteRequisicao =
  require("../middlewares/criarCorpoConviteRequisicao")();
const acessoAdmInstituicao = require("../middlewares/requestAdmInstituicao");

const usuarioAcesso = new AuthorizationHandler().liberar(usuario).builder();
const instituicaoAdminAcesso = new AuthorizationHandler()
  .liberar(instituicao)
  .builder();
const adminAcesso = new AuthorizationHandler().builder();
const instituicaoOuUsuario = new AuthorizationHandler()
  .liberar(usuario, instituicao)
  .builder();
const publico = new AuthorizationHandler()
  .liberar(instituicao, usuario)
  .builder()
  .public();

/**
 * controlles
 */

const instituicaoAcesso = new AuthorizationHandler()
  .liberar(instituicao)
  .builder();
const usuarioController = require("../controllers/usuarioController");
const EventosController = require("../controllers/colecoes/InstituicaoEventosController");
const InstituicaoController = require("../controllers/InstituicaoController");
const SugestoesController = require("../controllers/colecoes/InstituicaoSugestoesController");
const DenunciasController = require("../controllers/colecoes/InstituicaoDenunciasController");
const NoticiaController = require("../controllers/colecoes/InstituicaoNoticiasController");
const PontosController = require("../controllers/pontuacao/PontosController");

/**
 * rotas
 */

rotas.param("usuario_id", usuarioController.interceptor);
rotas.param("instituicao_id", InstituicaoController.interceptor);
rotas.param("evento_id", EventosController.interceptor);
rotas.param("sugestao_id", SugestoesController.interceptor);
rotas.param("denuncia_id", DenunciasController.interceptor);
rotas.param("noticia_id", NoticiaController.interceptor);
rotas.param("pontuacao_id", PontosController.interceptor);

/**
 * CONVITE ACTIONS
 */
rotas.post(
  "/convite",
  ...instituicaoAdminAcesso,
  criarCorpoConviteRequisicao,
  usuarioController.convite
);

rotas.get(
  "/emailtoken/:instituicaoId/:email/:cpf/:datanasc",
  ...publico,
  //  criarCorpoConviteRequisicao,
  usuarioController.emailtoken
);

rotas.get(
  "/cpf/:instituicaoId/:cpf",
  ...publico,
  //  criarCorpoConviteRequisicao,
  usuarioController.buscaCpf
);
/* rotas.post(
  "/convite/:instituicao_id",
  ...usuarioAcesso,
  usuarioController.convite
); */
rotas.delete(
  "/convite/:convite_id",
  ...instituicaoAdminAcesso,
  usuarioController.deletarConvite
);
rotas.post(
  "/convite/multiplos",
  ...instituicaoAdminAcesso,
  criarCorpoConviteRequisicao,
  usuarioController.multiplosConvites
);
rotas.post("/convite/:codigo/validar", usuarioController.validarConvite);
rotas.post("/convite/:codigo", usuarioController.inserirUmComConvite);

/* RECUPERAR SENHA */

rotas.post("/recuperar", usuarioController.recuperarSenha);
rotas.post("/novasenha/:codigo", usuarioController.alteraSenha);

/**
 * USUARIO ACTIONS
 */
rotas.post("/", ...adminAcesso, usuarioController.inserirUm);
rotas.get(
  "/:usuario_id/recurso/:recurso",
  ...instituicaoOuUsuario,
  usuarioController.listarUmRecurso
);
rotas.get("/:usuario_id", ...instituicaoOuUsuario, usuarioController.listarUm);
rotas.patch(
  "/:usuario_id",
  ...instituicaoOuUsuario,
  usuarioController.editarUm
);
rotas.delete(
  "/:usuario_id",
  ...instituicaoOuUsuario,
  usuarioController.deletarUm
);

/* PONTOS */

rotas
  .post(
    "/logindiario/:usuario_id",
    ...usuarioAcesso,
    PontosController.loginDiario
  )
  .post("/ponto/:usuario_id", ...usuarioAcesso, PontosController.inserirUm)
  .get("/pontos/:usuario_id", ...usuarioAcesso, PontosController.obterTodos);

/* NOTICIAS */

rotas.get(
  "/noticias/:instituicao_id",
  ...instituicaoOuUsuario,
  NoticiaController.obterTodos
);
rotas
  .route("/noticia/:instituicao_id")
  .post(...instituicaoOuUsuario, NoticiaController.inserirUm)
  .delete(...instituicaoOuUsuario, NoticiaController.deletarTodos);

rotas
  .route("/noticia/:instituicao_id/:noticia_id")
  .get(...instituicaoOuUsuario, NoticiaController.obterPorId)
  .put(...instituicaoAcesso, NoticiaController.atualizarUm)
  .delete(...instituicaoAcesso, NoticiaController.deletarUm);

/* EVENTOS */

rotas.get(
  "/eventos/:instituicao_id",
  ...instituicaoOuUsuario,
  EventosController.obterTodos
);

/* SUGESTOES */

rotas.get(
  "/sugestoes/:instituicao_id",
  ...instituicaoOuUsuario,
  SugestoesController.obterTodos
);

rotas
  .route("/sugestao/:instituicao_id")
  .post(...instituicaoOuUsuario, SugestoesController.inserirUm)
  .delete(...instituicaoOuUsuario, SugestoesController.deletarTodos);

rotas
  .route("/sugestao/:instituicao_id/:sugestao_id")
  .get(...instituicaoOuUsuario, SugestoesController.obterPorId)
  .put(...instituicaoOuUsuario, SugestoesController.atualizarUm)
  .delete(...instituicaoOuUsuario, SugestoesController.deletarUm);

/* DENUNCIAS */

rotas.get(
  "/denuncias/:instituicao_id",
  ...instituicaoOuUsuario,
  DenunciasController.obterTodos
);

rotas
  .route("/denuncia/:instituicao_id")
  .post(...instituicaoOuUsuario, DenunciasController.inserirUm)
  .delete(...instituicaoOuUsuario, DenunciasController.deletarTodos);

rotas
  .route("/denuncia/:instituicao_id/:denuncia_id")
  .get(...instituicaoOuUsuario, DenunciasController.obterPorId)
  .put(...instituicaoOuUsuario, DenunciasController.atualizarUm)
  .delete(...instituicaoOuUsuario, DenunciasController.deletarUm);

/**
 * INSTITUICAO ACTIONS
 * Ações que o usuario pode fazer dentro da instituicao, ex:  acrescentar / editar dados como membro/colaborador
 */

const CollectionController = usuarioController.instituicao;

rotas
  .route("/:usuario_id/instituicao/:collection")
  .get(
    ...instituicaoAcesso,
    CollectionController.middlewareEncontrarInstituicao,
    CollectionController.obterUm
  )
  .patch(
    ...instituicaoAcesso,
    CollectionController.middlewareEncontrarInstituicao,
    CollectionController.editarUm
  );

sub_app.use("/usuario", rotas);
sub_app.get("/usuarios", ...instituicaoAcesso, usuarioController.listarTodos);
sub_app.get(
  "/usuarios/ranking",
  ...instituicaoAcesso,
  usuarioController.listarPontos
);

sub_app.get(
  "/usuarios/ranking/:usuario_id",
  ...instituicaoOuUsuario,
  usuarioController.listarPontosAberto
);

sub_app.get("/usuarios/busca", ...instituicaoAcesso, usuarioController.busca);

sub_app.get(
  "/colaboradores",
  ...instituicaoAcesso,
  usuarioController.listarColaboradores
);

sub_app.get(
  "/associados",
  ...instituicaoAcesso,
  usuarioController.listarAssociados
);

module.exports = sub_app;
