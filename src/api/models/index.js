const AdminModel = require("./IdookModel")
const InstituicaoModel = require("./InstituicoesModel")
const UsuariosModel = require("./UsuariosModel")
const ConviteModel = require("./conviteModels")
const Logs = require("./logs")
const log = require("../log")

const criarIndices = () => {
    if (process.env.NODE_ENV !== 'test') {

        /**
         * indices para melhora de desempenho no mongo
         */

        UsuariosModel.createIndexes((err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
        })

        ConviteModel.createIndexes((err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });

        InstituicaoModel.createIndexes((err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });

        AdminModel.createIndexes((err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });

        log.info("indices criados com sucesso.")
    }
}

module.exports = {
    AdminModel,
    InstituicaoModel,
    UsuariosModel,
    ConviteModel,
    Logs,
    criarIndices: () => criarIndices()
}
