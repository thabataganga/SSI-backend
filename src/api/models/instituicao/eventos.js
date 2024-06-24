const mongoose = require("mongoose");

const EventosSchema = mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    data: {
      type: Date,
      required: true,
    },
    horarioInicio: {
      type: String,
      required: true,
    },
    horarioTermino: {
      type: String,
      required: true,
    },
    local: {
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
      require: true,
    },
  },
  { timestamps: true }
);

const eventos = {
  type: [EventosSchema],
  default: [],
};

module.exports = eventos;
