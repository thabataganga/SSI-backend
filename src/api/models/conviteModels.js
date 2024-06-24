const mongoose = require("mongoose");

const CodigoGerador = require("./utils/conviteCodigoGerador");

const ConviteType = {
  LINK: "LINK",
  EMAIL: "EMAIL",
  values() {
    return Object.keys(this).filter((k) => k != "values");
  },
};

const UsuarioType = {
  MEMBRO: "MEMBRO",
  ASSOCIADO: "ASSOCIADO",
  FILIADO: "FILIADO",
  ADMIN: "ADMIN",
  values() {
    return Object.keys(this).filter((k) => k != "values");
  },
};

const ConviteStatus = {
  HABILITADO: "HABILITADO",
  EXPIRADO: "EXPIRADO",
  DESABILITADO: "DESABILITADO",
  ATIVACAO_PENDENTE: "ATIVACAO_PENDENTE",
  UTILIZADO: "UTILIZADO",
  values() {
    return Object.keys(this).filter((k) => k != "values");
  },
};

exports.ConviteTypeEnum = ConviteType;
exports.UsuarioTypeEnum = UsuarioType;
exports.ConviteEnumStatus = ConviteStatus;

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
const ConviteSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: true,
      enum: {
        values: ConviteType.values(),
        message:
          "{VALUE} não suportado, valores validos: " +
          ConviteType.values().join(" | "),
      },
    },
    usuarioTipo: {
      type: String,
      enum: {
        values: UsuarioType.values(),
        message:
          "{UsuarioType} não suportado, valores validos: " +
          UsuarioType.values().join(" | "),
      },
    },
    instituicaoTipo: {
      type: String,
      enum: {
        values: instituicoesEnuns,
        message:
          "{instituicoesEnuns} não suportado, valores validos: " +
          instituicoesEnuns.join(" | "),
      },
    },

    status: {
      type: String,
      enum: {
        values: ConviteStatus.values(),
        message:
          "{convites enuns} não suportado, valores validos: " +
          ConviteStatus.values().join(" | "),
      },
    },
    instituicaoId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    email: {
      type: String,
      partialFilterExpression: { email: { $type: "string" } },
      default: null,
    },

    geradoPor: {
      type: String,
      required: true,
    },

    cpf: {
      type: String,
      partialFilterExpression: { cpf: { $type: "string" } },
      required: true,
    },
    datanasc: {
      type: String,
      required: true,
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
      required: true,
    },
    codigo: {
      type: String,
      default: CodigoGerador,
      require: true,
    },
    conviteUri: {
      type: String,
    },

    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ConviteModel = mongoose.model("convite", ConviteSchema);

module.exports = ConviteModel;
