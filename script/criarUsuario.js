require("dotenv").config();
require("../src/infra/mongoDbConenct").connect();
require("../src/api/events/index");

const event = require("../src/api/events/appEvent");

const usuario = {
  email: "test20@gmail.com",
  tipo_de_usuario: "COLABORADOR",
  cpf: "123.456.789-10",
  _id: "6260b998517fa898619124f9",
  status: "ATIVO",
  senha: "123",
  privacidade: {
    termos_de_uso: true,
    receber_email: true,
  },
  instituicoes: {
    instituicao_id: "625f82c365d8602ca397e561",
    instituicao_tipo: "SINDICATO",
    vinculo: "COLABORADOR",
  },
};

const usuarioFacade = require("../src/api/facade/UsuariosFacade")();

// const criar = async () => {
//    try {
//        await usuarioFacade.criar(usuario)
//    } catch (error) {
//        console.error(error)
//    }
// }

// criar()

const gerarEvento = () => {
  event.emit("usuario", "REPETIR-adicionarColaborador-1", usuario);
};

gerarEvento();
