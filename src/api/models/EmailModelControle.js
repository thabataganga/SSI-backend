const mongoose = require("mongoose");


// utils
const email = require("./utils/email")

const EmailControle = new mongoose.Schema(
  {
    email,
    tipo: {
        type: String,
        required: true
    },
    servicos_cadastrados: [
      
    ],
    
    fk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fk',
        required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("email", EmailControle);
