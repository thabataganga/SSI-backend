const mongoose = require("mongoose");

//modelos
const ENUM_SUGESTOES = require("../enuns/sugestoesEnuns");

const SugestoesSchema = mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    tipo_de_sugestao: ENUM_SUGESTOES,
    status: {
      type: Boolean,
      required: true,
    },
    texto: {
      type: String,
      required: true,
    },
    resposta: {
      type: String,
      required: false,
      default: null,
    },
    autor_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
      required: true,
    },
    autor_nome: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const sugestoes = {
  type: [SugestoesSchema],
  default: [],
};

module.exports = sugestoes;
