const mongoose = require("mongoose");

const enderecoSchema = mongoose.Schema({
  cep: {
    type: String,
    required: true
  },
  uf: {
    type: String,
    required: true
  },
  localidade: {
    type: String,

  },
  bairro: {
    type: String,

  },
  logradouro: {
    type: String,

  },
  numero: {
    type: String,

  },
  complemento: {
    type: String,
  },
}, { timestamps: true })

const endereco = {
   type: enderecoSchema
}
module.exports = endereco


