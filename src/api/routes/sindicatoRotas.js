const express = require("express");
const rotas = express.Router();

const sindicatoController = require("../controllers/sindicatoController");

rotas.param("id", sindicatoController.interceptor)

rotas.get("/", sindicatoController.listarTodos);
rotas.post("/", sindicatoController.inserirUm);
rotas.get("/:id/recurso/:recurso", sindicatoController.listarUmRecurso);
rotas.get("/:id", sindicatoController.listarUm);
rotas.patch("/:id", sindicatoController.editarUm);
rotas.delete("/:id", sindicatoController.deletarUm);

module.exports = rotas
