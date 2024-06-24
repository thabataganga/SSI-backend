const mongoose = require("mongoose");

const PontuacaoSchema = mongoose.Schema(
  {
    valor: Number,
    atividade: String,
    IPv4: String,
  },
  { timestamps: true }
);

const pontuacao = {
  type: [PontuacaoSchema],
};

module.exports = pontuacao;
