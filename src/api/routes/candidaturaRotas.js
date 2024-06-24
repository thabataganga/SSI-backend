const express = require("express");
const rotas = express.Router();

const candidaturaController = require("../controllers/candidaturaController");

rotas.param("id", candidaturaController.interceptor)


rotas.get("/", candidaturaController.listarTodos);
rotas.post("/", candidaturaController.inserirUm);
rotas.get("/:id/recurso/:recurso", candidaturaController.listarUmRecurso);
rotas.get("/:id", candidaturaController.listarUm);
rotas.patch("/:id", candidaturaController.editarUm);
rotas.delete("/:id", candidaturaController.deletarUm);

module.exports = rotas
