const mongoose = require('mongoose')

const redesSociaisSchema = mongoose.Schema({
  whatsapp: {
    type: String,
    default: ""
  },
  youtube: {
    type: String,
    default: ""
  },
  instagram: {
    type: String,
    default: ""
  },
  twitter: {
    type: String,
    default: ""
  },
  facebook: {
    type: String,
    default: ""
  },
  linkedin: {
    type: String,
    default: ""
  },
  tiktok: {
    type: String,
    default: ""
  },
  website: {
    type: String,
    default: ""
  },
}, { timestamps: true})

const redesSociais = {
  type: redesSociaisSchema,
  default: {}
}

module.exports = redesSociais

