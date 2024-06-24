const endereco = require("../_endereco");
const mongoose = require("mongoose");
const { cpf } = require("cpf-cnpj-validator");

// modelos

const DadosSchema = mongoose.Schema(
  {
    cpf: String,
    genero: String,
    nome: String,
    apelido: String,
    nascimento: String,
    telefone: String,
    whatsapp: String,
    foto: String,
    matricula: String,
    empresa: String,
    instituicao: String,
  },
  { timestamps: true }
);

const ApiSchema = mongoose.Schema(
  {
    url: String,
    headers: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const dadosSensiveisSchema = mongoose.Schema({
  api: ApiSchema,
  dados: DadosSchema,
  comApi: {
    type: Boolean,
    required: true,
  },
});
const dadosSensiveis = {
  type: dadosSensiveisSchema,
};

module.exports = dadosSensiveis;
