const mongoose = require("mongoose");

const indentidadeVisualSchema = mongoose.Schema(
  {
    logotipo: {
      type: String,
      default:
        "https://idookdev.s3.sa-east-1.amazonaws.com/logoroxocortado.png",
    },
    slogan: {
      type: String,
    },
    calltoaction: {
      type: String,
    },
    cor_pri: {
      type: String,
      default: "#662D91",
    },
    cor_sec: {
      type: String,
      default: "#91BD36",
    },
    cor_ter: {
      type: String,
      default: "#10E2E9",
    },
  },
  { timestamps: true }
);

const indentidadeVisual = {
  type: indentidadeVisualSchema,
  default: {},
};
module.exports = indentidadeVisual;
