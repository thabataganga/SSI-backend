const express = require("express");
const rotas = express.Router();

const autenticacaoController = require("../controllers/autenticacaoController");

rotas.post("/:permissao", autenticacaoController)

module.exports = rotas