const mongoose = require('mongoose')
const ApiDadosSchema = mongoose.Schema({
  link: {
    type: String,
  },
  chave: {
    type: String,
  },
}, { timestamps: true })
const apiDados = {
  type: ApiDadosSchema,
  default: {
    link: null,
    chave: null
  }
}

module.exports = apiDados


