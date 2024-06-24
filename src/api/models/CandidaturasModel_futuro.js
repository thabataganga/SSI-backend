const mongoose = require("mongoose");

const CandidaturasEsquemaDeDados = new mongoose.Schema(
  {
    instituicao_id: String,
    status: Boolean,
    dados_arrecadacao: {
      vaquinha: String,
      conta_corrente: String,
      pix: String,
    },
    campanha: {
      biografia: String,
      missao: String,
      visao: String,
    },
    santinho: {
      slogan: String,
      numero: String,
      partido: String,
      cargo: String,
    },
    material_de_campanha: [{}],
    documentos: [{}],
    candidatos: [
      {
        usuario_id: String,
        responsavel: Boolean,
        status: Boolean,
      },
      { timestamps: true },
    ],
    propostas: [
      {
        titulo: String,
        subtitulo: String,
        texto: String,
        imagem: String,
        status: Boolean,
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("candidatura", CandidaturasEsquemaDeDados);
