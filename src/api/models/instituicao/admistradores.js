const mongoose = require('mongoose')
const status = require("../usuario/status")

const AdminSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuario",
    required: true
  },

  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  email: {
    type: String,
    required: true
  },

  status
},
  { timestamps: true }
)


AdminSchema.index({  // para campos unicos
  email: 1,
  usuario_id: 1
}, { unique: true })

const AdmistradoresModel = mongoose.model("instituicao_admistradores", AdminSchema)
if (process.env.NODE_ENV !== 'test') {
  AdmistradoresModel.createIndexes((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
}


module.exports = AdmistradoresModel