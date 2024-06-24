
// modulos
const express = require("express");

// dependencias de segurança
const cors = require("cors");
const helmet = require("helmet")

const app = express();

// variaveis de ambientes
require('dotenv').config()

// database
// require("./api/cache/moogoseCache")
require("./infra/mongoDbConenct").connect()


// security
app.use(helmet())

// heades
app.use(cors());

// body-parse
require('./config/BodyParse')(app)

// logs
require('./config/morganConfig')(app)
const log = require('./api/log')

// eventos
require('./api/events')

// rotas
require("./api/routes/")(app)

// configurações especificas por ambiente
if (process.env.NODE_ENV === 'doc') {
    log.info("documentação gerada com sucesso!")
    process.exit(1)
}
if (process.env.NODE_ENV === 'local') {
    log.warn("Acesso a recursos externos desabilitados!")
}
module.exports = app