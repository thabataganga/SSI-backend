const mongoose = require('mongoose')

const NoticiasSchema = mongoose.Schema({
    titulo: {
      type: String,
      required: true,
    },
    subtitulo: {
      type: String,
      required: true,
    },
    imagem: {
      type: String,
      required: true,
    },
    texto: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    autor_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true
    }
}, { timestamps: true})

const noticias = {
  type: [NoticiasSchema], 
  default: []
}

module.exports = noticias
