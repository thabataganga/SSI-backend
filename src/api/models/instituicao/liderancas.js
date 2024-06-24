const mongoose = require("mongoose");
const status = require("../usuario/status");

const LiderancasSchema = mongoose.Schema(
  {
    titulo: String,
    foto: String,
    telefone: String,
    nome: {
      type: String,
      required: (value) => {
        if (!value || value.trim()) {
          return false;
        }
        return true;
      },
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
    },
    status,
  },
  { timestamps: true }
);

const liderancas = {
  type: [LiderancasSchema],
  default: [],
};
module.exports = liderancas;
