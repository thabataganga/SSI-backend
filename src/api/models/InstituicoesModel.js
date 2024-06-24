const mongoose = require("mongoose");
const { cnpj } = require("cpf-cnpj-validator");

// Modelos
const privacidade = require("./_privacidade");
const identidadeVisual = require("./instituicao/identidadeVisual");
const endereco = require("./_endereco");
const redesSociais = require("./instituicao/redesSociais");
const apiNoticias = require("./instituicao/apiNoticias");
const apiDados = require("./instituicao/apiDados");
const tiposDeUsuarios = require("./instituicao/tiposDeUsuarios");
const liderancas = require("./instituicao/liderancas");
const colaboradores = require("./instituicao/colaboradores");
const associados = require("./instituicao/associados");
const alertas = require("./instituicao/alertas");
const noticias = require("./instituicao/noticias");
const sobreNos = require("./instituicao/sobreNos");
const eventos = require("./instituicao/eventos");
const sugestoes = require("./instituicao/sugestoes");
const denuncias = require("./instituicao/denuncias");
const pix = require("./instituicao/pix");
const wallet = require("./instituicao/wallet");

// utils
const senha = require("./utils/senha");

// enus
const ENUM_INSTITUICOES = require("./instituicao/instituicoesEnuns");
const ENUM_STATUS = require("./enumStatus");
const recuperarSenha = require("./utils/recuperarSenha");
const { required } = require("./_privacidade");


// schema
const InstituicaoSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
      required: true,
    },

    nome_fantasia: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    cnpj: {
      type: String,
    },

    telefone: {
      type: String, // f
    },

    tipo: ENUM_INSTITUICOES,

    criador_id: {
      type: String,
    },

    status: ENUM_STATUS,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    senha,
    privacidade,
    endereco,
    identidade_visual: identidadeVisual,
    redes_sociais: redesSociais,
    api_dados: apiDados,
    api_noticias: apiNoticias,
    tipos_de_usuarios: tiposDeUsuarios,
    liderancas,
    admistradores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usuario",
        default: [],
      },
    ],
    colaboradores,
    associados,
    alertas,
    noticias,
    eventos,
    sugestoes,
    denuncias,
    pix,
    wallet: wallet,
    sobre_nos: sobreNos,
    recuperarSenha: recuperarSenha,
  },

  { timestamps: true }
);

const instituicaoModel = mongoose.model("instituicoes", InstituicaoSchema);

module.exports = instituicaoModel;
