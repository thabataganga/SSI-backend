const router = require("express").Router();
const usuarioController = require("../controllers/usuarioController");

const { instituicao, usuario } = require("../chain");

const AuthorizationHandler = require("../chain/AuthorizationHandler");
const conviteController = require("../controllers/conviteController");

router.param("convite_id", conviteController.interceptor);

const acessoAdmin = new AuthorizationHandler().builder();
const instituicaoAcesso = new AuthorizationHandler()
  .liberar(instituicao)
  .builder();

router.post("/multiplos", ...acessoAdmin, usuarioController.multiplosConvites);
router.get("/:convite_id", ...instituicaoAcesso, conviteController.obterPorId);

module.exports = router;
