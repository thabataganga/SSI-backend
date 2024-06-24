const express = require("express");
const rotas = express.Router();

rotas.get("/", (req, res) => {
    res.json({ message: "Aries inicializado" });
  });
   

module.exports = rotas