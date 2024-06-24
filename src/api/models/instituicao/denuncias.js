const mongoose = require("mongoose");

const DenunciaSchema = mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    texto: {
      type: String,
      required: true,
    },
    imagem: {
      type: String,
      required: false,
    },
    resposta: {
      type: String,
      required: false,
      default: null,
    },
    autor_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const denuncias = {
  type: [DenunciaSchema],
  default: [],
};

module.exports = denuncias;
