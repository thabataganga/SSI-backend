const sugestoesEnuns = [
  "Administrativo",
  "Financeiro",
  "Recursos Humanos",
  "Parcerias",
  "Negócios",
  "SAC",
  "Outros",
];
const ENUM_SUGESTOES = {
  type: String,
  required: true,
  enum: {
    values: sugestoesEnuns,
    message:
      "{VALUE} não suportado, valores validos: " + sugestoesEnuns.join(" | "),
  },
};
module.exports = ENUM_SUGESTOES;
