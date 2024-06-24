const mongoose = require("mongoose");

const PrivacidadeSchema = mongoose.Schema({
  termos_de_uso: {
    type: Boolean,
    required: value => {
      if (value===true) return true
      else return false
    }

  },
  receber_email: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true})

const privacidade =  {
   type: PrivacidadeSchema,
   required: true
}

module.exports = privacidade