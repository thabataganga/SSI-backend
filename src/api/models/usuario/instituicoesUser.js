const mongoose = require('mongoose')
const ENUM_INSTITUICOES = require("../instituicao/instituicoesEnuns")

const instituicaoUserSchema = mongoose.Schema(
  {
    instituicao_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    instituicao_tipo: ENUM_INSTITUICOES,
    vinculo: String,
  },
  { timestamps: true }
)

 // isso não é membro / colaborador?
const instituicaoUser = {
  type: instituicaoUserSchema,
  required: true
}

module.exports = instituicaoUser