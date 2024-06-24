const express = require("express");
const rotas = express.Router();

const Inicializacao = require("../controllers");


rotas.get("/", Inicializacao.start);


module.exports = rotas