const express = require("express");
const rotas = express.Router();
const sub_app = express();

const InstituicaoController = require("../controllers/InstituicaoController");
const Inicializacao = require("../controllers");

const { instituicao, usuario } = require("../chain");
const AuthorizationHandler = require("../chain/AuthorizationHandler");

const instituicaoAcesso = new AuthorizationHandler()
  .liberar(instituicao)
  .builder();
const publico = new AuthorizationHandler()
  .liberar(instituicao, usuario)
  .builder()
  .public();
const instituicaoOuUsuario = new AuthorizationHandler()
  .liberar(usuario, instituicao)
  .builder();

const adminAcesso = new AuthorizationHandler().builder();

// Array Controller
const InstituicaoAlertaController = require("../controllers/colecoes/InstituicaoAlertasController");
const LiderancasController = require("../controllers/colecoes/InstituicaoLiderancasController");
const NoticiaController = require("../controllers/colecoes/InstituicaoNoticiasController");
const EventosController = require("../controllers/colecoes/InstituicaoEventosController");
const SugestoesController = require("../controllers/colecoes/InstituicaoSugestoesController");
const DenunciasController = require("../controllers/colecoes/InstituicaoDenunciasController");
const ColaboradorController = require("../controllers/colecoes/InstituicaoColaboradoresCrud");
const MembroController = require("../controllers/colecoes/InstituicaoMembrosController");
/**
 * @param  : intercepta uma requisição a validando pelo id, caso o id exista no banco continua, caso o contrato
 * já retorna um statusCode 400 - não encontrado
 */
rotas.param("instituicao_id", InstituicaoController.interceptor);
rotas.param("alerta_id", InstituicaoAlertaController.interceptor);
rotas.param("lideranca_id", LiderancasController.interceptor);
rotas.param("noticia_id", NoticiaController.interceptor);
rotas.param("evento_id", EventosController.interceptor);
rotas.param("sugestao_id", SugestoesController.interceptor);
rotas.param("denuncia_id", DenunciasController.interceptor);
rotas.param("colaborador_id", ColaboradorController.interceptor);
rotas.param("membro_id", MembroController.interceptor);

/**
 * rotas básicas
 */
rotas.post("/", InstituicaoController.inserirUm);

rotas
  .route("/:instituicao_id")
  .get(publico, InstituicaoController.listarUm)
  .patch(...instituicaoAcesso, InstituicaoController.editarUm)
  .delete(...instituicaoAcesso, InstituicaoController.deletarUm);

rotas
  .route("/private/:instituicao_id")
  .get(...instituicaoAcesso, InstituicaoController.listarUmPrivado);

// Agente Aries
rotas
  .route("/:instituicao_id/aries")
  .get(...instituicaoOuUsuario, InstituicaoController.iniciarAries);

rotas
  .route("/:instituicao_id/aries/auth-token")
  .post(...instituicaoOuUsuario, InstituicaoController.requestAriesAuthToken);

rotas
  .route("/:instituicao_id/aries/create-invitation")
  .post(...instituicaoOuUsuario, InstituicaoController.ariesInvitation);

rotas
  .route("/:instituicao_id/aries/connections")
  .post(...instituicaoOuUsuario, InstituicaoController.ariesConnections);

rotas
  .route("/:instituicao_id/aries/connections/:connection_id")
  .post(...instituicaoOuUsuario, InstituicaoController.ariesSingleConnection);

rotas
  .route("/:instituicao_id/aries/verify-connection-state")
  .post(...instituicaoOuUsuario, InstituicaoController.verifyConnectionState);

rotas
  .route("/:instituicao_id/aries/send-offer")
  .post(...instituicaoOuUsuario, InstituicaoController.sendOffer);

rotas
  .route("/:instituicao_id/aries/wallet")
  .get(...instituicaoOuUsuario, InstituicaoController.ariesWallet);

rotas
  .route("/:instituicao_id/aries/verify-credential")
  .post(...instituicaoOuUsuario, InstituicaoController.verifyCredential);

rotas
  .route("/:instituicao_id/aries/did_resolver/:did")
  .get(InstituicaoController.didResolver);

rotas
  .route("/:instituicao_id/aries/send-proof-request-filiacao")
  .post(
    ...instituicaoOuUsuario,
    InstituicaoController.sendProofRequestFiliacao
  );

rotas
  .route("/:instituicao_id/aries/send-proof-request-acordo")
  .post(
    ...instituicaoOuUsuario,
    InstituicaoController.sendProofRequestAcordoColetivo
  );

rotas
  .route("/:instituicao_id/aries/verify-proof")
  .post(InstituicaoController.verifyProofSend);

//sendProofRequestAcordoColetivo

/* RECUPERAR SENHA */
rotas.post("/recuperar", InstituicaoController.recuperarSenha);
rotas.post("/novasenha/:codigo", InstituicaoController.alterarSenha);

/**
 * wip -----------------------------------------------------
 */

rotas.get(
  "/:instituicao_id/recurso/:recurso",
  ...instituicaoAcesso,
  InstituicaoController.listarUmRecurso
);

rotas.patch("/:instituicao_id/:recurso", (req, res, next) =>
  next(new Error("não implementado"))
);
rotas.patch("/:instituicao_id/:collection/:recurso_id", (req, res, next) =>
  next(new Error("não implementado"))
);

/**
 * convite ----------------------------------------------
 */
rotas.get(
  "/:instituicao_id/convites",
  ...instituicaoAcesso,
  InstituicaoController.obterTodosOsConvites
);

/**
 * Alertas -------------------------------------------------
 */
rotas.get(
  "/:instituicao_id/alertas",
  ...instituicaoOuUsuario,
  InstituicaoAlertaController.obterTodos
);

rotas
  .route("/:instituicao_id/alerta")
  .post(...instituicaoAcesso, InstituicaoAlertaController.inserirUm)
  .delete(...instituicaoAcesso, InstituicaoAlertaController.deletarTodos);

rotas
  .route("/:instituicao_id/alerta/:alerta_id")
  .get(...instituicaoAcesso, InstituicaoAlertaController.obterPorId)
  .put(...instituicaoAcesso, InstituicaoAlertaController.atualizarUm)
  .delete(...instituicaoAcesso, InstituicaoAlertaController.deletarUm);

/**
 * Liderancas -------------------------------------------------
 */

rotas.get(
  "/:instituicao_id/liderancas",
  ...instituicaoOuUsuario,
  LiderancasController.obterTodos
);
rotas
  .route("/:instituicao_id/lideranca")
  .post(...instituicaoAcesso, LiderancasController.inserirUm)
  .delete(...instituicaoAcesso, LiderancasController.deletarTodos);

rotas
  .route("/:instituicao_id/lideranca/:lideranca_id")
  .get(...instituicaoOuUsuario, LiderancasController.obterPorId)
  .put(...instituicaoAcesso, LiderancasController.atualizarUm)
  .delete(...instituicaoAcesso, LiderancasController.deletarUm);

/**
 * PIX -------------------------------------------------
 */

rotas.get("/:instituicao_id/pix", ...publico, InstituicaoController.listarPix);

/**
 * ApiDeDados -------------------------------------------------
 */

rotas.post(
  "/:instituicao_id/api_de_dados",
  ...instituicaoAcesso,
  InstituicaoController.getTokenApi
);

/**
 * Resgatar ID -------------------------------------------------
 */

/* rotas.get(
  "/:instituicao_id/resgatar_id",
  ...publico,
  InstituicaoController.resgatarID
); */

rotas.get(
  "/:instituicao_id/resgatar_id/:cpf/:datanasc",
  ...publico,
  InstituicaoController.resgatarID
);

/**
 * Noticias -------------------------------------------------
 */

rotas.get(
  "/:instituicao_id/noticias",
  ...publico,
  NoticiaController.obterTodos
);
rotas
  .route("/:instituicao_id/noticia")
  .post(...instituicaoAcesso, NoticiaController.inserirUm)
  .delete(...instituicaoAcesso, NoticiaController.deletarTodos);

rotas
  .route("/:instituicao_id/noticia/:noticia_id")
  .get(...publico, NoticiaController.obterPorId)
  .put(...instituicaoAcesso, NoticiaController.atualizarUm)
  .delete(...instituicaoAcesso, NoticiaController.deletarUm);

/**
 * Eventos -------------------------------------------------
 */

rotas.get("/:instituicao_id/eventos", EventosController.obterTodos);
rotas
  .route("/:instituicao_id/evento")
  .post(...instituicaoAcesso, EventosController.inserirUm)
  .delete(...instituicaoAcesso, EventosController.deletarTodos);

rotas
  .route("/:instituicao_id/evento/:evento_id")
  .get(EventosController.obterPorId)
  .put(...instituicaoAcesso, EventosController.atualizarUm)
  .delete(...instituicaoAcesso, EventosController.deletarUm);

/**
 * Sugestoes -------------------------------------------------
 */

rotas.get(
  "/:instituicao_id/sugestoes",
  ...instituicaoOuUsuario,
  SugestoesController.obterTodos
);
rotas
  .route("/:instituicao_id/sugestao")
  .post(...instituicaoOuUsuario, SugestoesController.inserirUm)
  .delete(...instituicaoAcesso, SugestoesController.deletarTodos);

rotas
  .route("/:instituicao_id/sugestao/:sugestao_id")
  .get(...instituicaoOuUsuario, SugestoesController.obterPorId)
  .put(...instituicaoOuUsuario, SugestoesController.atualizarUm)
  .delete(...instituicaoOuUsuario, SugestoesController.deletarUm);

/**
 * Denuncias -------------------------------------------------
 */

rotas.get(
  "/:instituicao_id/denuncias",
  ...instituicaoOuUsuario,
  DenunciasController.obterTodos
);
rotas
  .route("/:instituicao_id/denuncia")
  .post(...instituicaoOuUsuario, DenunciasController.inserirUm)
  .delete(...instituicaoAcesso, DenunciasController.deletarTodos);

rotas
  .route("/:instituicao_id/denuncia/:denuncia_id")
  .get(...instituicaoOuUsuario, DenunciasController.obterPorId)
  .put(...instituicaoOuUsuario, DenunciasController.atualizarUm)
  .delete(...instituicaoOuUsuario, DenunciasController.deletarUm);

/**
 * Colaboradores -------------------------------------------------
 */

rotas.get(
  "/:instituicao_id/colaboradores",
  ...instituicaoAcesso,
  ColaboradorController.obterTodos
);
rotas
  .route("/:instituicao_id/colaborador")
  .post(...adminAcesso, ColaboradorController.inserirUm)
  .delete(...adminAcesso, ColaboradorController.deletarTodos);

rotas
  .route("/:instituicao_id/colaborador/:colaborador_id")
  .get(...instituicaoAcesso, ColaboradorController.obterPorId)
  .put(...instituicaoAcesso, ColaboradorController.atualizarUm)
  .delete(...adminAcesso, ColaboradorController.deletarUm);

/**
 * Associados -------------------------------------------------
 */

rotas.get(
  "/:instituicao_id/membros",
  ...instituicaoAcesso,
  MembroController.obterTodos
);
rotas
  .route("/:instituicao_id/membro")
  .post(...adminAcesso, MembroController.inserirUm)
  .delete(...adminAcesso, MembroController.deletarTodos);

rotas
  .route("/:instituicao_id/membro/:membro_id")
  .get(...instituicaoAcesso, MembroController.obterPorId)
  .put(...instituicaoAcesso, MembroController.atualizarUm)
  .delete(...adminAcesso, MembroController.deletarUm);

sub_app.use("/instituicao", rotas);
sub_app.get("/instituicoes", ...adminAcesso, InstituicaoController.listarTodos);

module.exports = sub_app;
