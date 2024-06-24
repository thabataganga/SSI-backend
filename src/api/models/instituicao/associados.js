const mongoose = require('mongoose')
const status = require('../usuario/status')

const AssociadoSchema = mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  matricula: {
    type: String,
  },
  area_de_atuacao: {
    type: String,
  },
  local_de_trabalho: {
    type: String,
  },
  cargo: {
    type: String,
  },
  doacao: {
    type: Boolean
  },
  status
}, { timestamps: true })

const associados = {
  type: [AssociadoSchema],
  default: []
}

module.exports = associados
