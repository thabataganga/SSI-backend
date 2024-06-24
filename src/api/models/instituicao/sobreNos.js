const mongoose = require("mongoose");

const sobreNosSchema = mongoose.Schema(
  {
    historico: {
      type: String,
      default: "",
    },
    missao: {
      type: String,
      default: "",
    },
    visao: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const sobreNos = {
  type: sobreNosSchema,
  default: {},
};

module.exports = sobreNos;
