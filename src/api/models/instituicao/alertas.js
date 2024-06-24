const mongoose = require('mongoose')

const DestinatarioSchema = mongoose.Schema({
  
    tipo_de_usuario: {
      type: String,
    },
    uf: {
      type: String,
    },
    localidade: {
      type: String,
    },
    bairro: {
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
    genero: {
      type: String,
    },
    doacao: {
      type: Boolean
    },
})

const AlertaSchema = mongoose.Schema({
    texto: {
      type: String,
    },
    autor_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true
    },
    destinatario: DestinatarioSchema,
    _id : {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId
    }
}, { timestamps: true})

const alertas = {
  type: [AlertaSchema],
  default: []
}

module.exports = alertas
