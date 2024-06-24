const express = require("express");
const router = express.Router();
const ariesController = require("../controllers/ariesClientController");

const { instituicao, usuario } = require("../chain");
const AuthorizationHandler = require("../chain/AuthorizationHandler");

// Rota para inicializar o Aries Client
router.get("/", (req, res) => {
    res.json({ message: "Aries Client Inicializado" });
  });

// Interceptor de parâmetro para o ID do convite
//router.param("convite_id", conviteController.interceptor);

console.log("Aries rotas")

// Criação de uma instância de AuthorizationHandler para controle de acesso
const instituicaoAcesso = new AuthorizationHandler().liberar(instituicao, usuario).builder();

// Rota para solicitar um token de autenticação
router.post("/auth-token", ariesController.requestAuthToken);

// Rota para criar um convite
router.post("/create-invitation", ...instituicaoAcesso, ariesController.createInvitation);

module.exports = router;
