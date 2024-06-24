const mongoose = require('mongoose')
const ApiNoticiasSchema = mongoose.Schema({
  link: {
    type: String,
  },
  tag_titulo: {
    type: String,
  },
  tag_data: {
    type: String,
  },
  tag_imagem: {
    type: String,
  },
  tag_texto: {
    type: String,
  },
}, { timestamps: true })

const apiNoticias = {
  type: ApiNoticiasSchema,
  default: {
    link: null,
    tag_titulo: null,
    tag_data: null,
    tag_imagem: null,
    tag_texto: null
  }
}

module.exports = apiNoticias
