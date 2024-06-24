const express = require("express");
const rotas = express.Router();
const adminController = require("../controllers/adminController")
const AuthorizationHandler = require("../chain/AuthorizationHandler")

rotas.param("id", adminController.interceptor)

//rotas.use(...AuthorizationHandler.builder())
rotas.get("/", adminController.listarTodos);
rotas.post("/", adminController.inserirUm);
rotas.get("/:id/recurso/:recurso", adminController.listarUmRecurso);
rotas.get("/:id", adminController.listarUm);
rotas.patch("/:id", adminController.editarUm);
rotas.delete("/:id", adminController.deletarUm);

module.exports = rotas