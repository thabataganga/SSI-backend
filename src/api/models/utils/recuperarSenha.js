const mongoose = require("mongoose");

const RecuperarSenhaSchema = mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const recuperarSenha = {
  type: [RecuperarSenhaSchema],
  default: [],
};

module.exports = recuperarSenha;
