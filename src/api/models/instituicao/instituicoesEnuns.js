const instituicoesEnuns = [
  "IDOOK",
  "SINDICATO",
  "CENTRAL SINDICAL",
  "CANDIDATURA",
  "ASSOCIAÇÃO",
  "EMPRESA",
  "EDUCAÇÃO",
  "COWORKING",
  "DEMONSTRAÇÃO",
];
const ENUM_INSTITUICOES = {
  type: String,
  required: true,
  enum: {
    values: instituicoesEnuns,
    message:
      "{VALUE} não suportado, valores validos: " +
      instituicoesEnuns.join(" | "),
  },
};
module.exports = ENUM_INSTITUICOES;
