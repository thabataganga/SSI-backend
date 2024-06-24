require("dotenv").config()
const mongoose = require("../src/infra/mongoDbConenct").connect()

const { conviteModels, InstituicaoModel, UsuariosModel } = require("../src/api/models")

const clearDatabase = async () => {
    try {

        console.log("processando...")
        //console.log("processando...convite")
        //await conviteModels.collection.drop()
        console.log("processando...instituicao")
        await InstituicaoModel.collection.drop()
        console.log("processando...usuarios")
         await UsuariosModel.collection.drop()
        console.log("sucesso")

    } catch (error) {
        console.error(error)
    }

    process.exit(1)
}

clearDatabase()

