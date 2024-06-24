const mongoose = require('mongoose')

const GeolocalizacoesSchema = mongoose.Schema(
  {
    lat: String,
    lon: String,
  },
  { timestamps: true }
)

const geolocalizacoes= {
  type: [GeolocalizacoesSchema]
}

module.exports = geolocalizacoes