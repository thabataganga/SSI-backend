const mongoose = require("mongoose");

// modelos
const privacidade = require("./_privacidade");
const dadosSensiveis = require("./usuario/dadosSensiveis");
const instituicaoUser = require("./usuario/instituicoesUser");
const geolocalizacoes = require("./usuario/geolocalizacoes");
const endereco = require("./_endereco");

// utils
const senha = require("./utils/senha");

// enuns
const ENUM_USUARIOS_TIPOS = ["COLABORADOR", "ASSOCIADO", "FILIADO"];
const ENUM_STATUS = require("./enumStatus");
const recuperarSenha = require("./utils/recuperarSenha");
const pontuacao = require("./usuario/pontuacao");

const UsuarioEsquemaDeDados = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    _cpf: {
      type: String,
      unique: true,
      required: true,
    },
    tipo_de_usuario: {
      type: String, // colaborar(quem tem permissão para editar a istituição) | associado (tem permissao somente para visualizar)
      require: true,
      enum: {
        values: ENUM_USUARIOS_TIPOS,
        message:
          "{VALUE} não suportado, valores validos: " +
          ENUM_USUARIOS_TIPOS.join(" | "),
      },
    },
    colaborador: {
      // sugestao para futuro
      type: {
        String,
        values: ["ADMIN", "FUNCIONARIO", "VOLUNTARIO"],
      },
    },
    status: ENUM_STATUS,
    senha,
    dados_sensiveis: dadosSensiveis, // o usuario só pode ser considerado ativo depois que disponibilizar seus dados sensiveis?
    privacidade,
    endereco,
    instituicoes: instituicaoUser,
    geolocalizacoes,
    recuperarSenha: recuperarSenha,
    pontuacao: pontuacao,
  },
  { timestamps: true }
);

const usuarioModels = mongoose.model("usuario", UsuarioEsquemaDeDados);

module.exports = usuarioModels;
