const mongoose = require('mongoose')
const status = require("../usuario/status")

const ColaboradoresSchema = mongoose.Schema({
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usuario",
      require: true
    },
    matricula: {
      type: String,
    },
    departameno: {
      type: String,
    },
    cargo: {
      type: String,
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true
    },
    status
}, { timestamps: true })

const colaboradores = {
   type: [ColaboradoresSchema],
   default: []
}

module.exports = colaboradores