const mongoose = require("mongoose");

const SindicatosEsquemaDeDados = new mongoose.Schema(
  {
    instituicao_id: String,
    filiado_a_central: Boolean,
    nome_da_central: String,
    status: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("sindicato", SindicatosEsquemaDeDados);
