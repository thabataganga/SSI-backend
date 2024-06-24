require("dotenv").config()
const mongoose = require("../src/infra/mongoDbConenct").connect()

const { instituicaoService }  = require("../src/api/services/instituicaoService")


const credential = {
    "email": "test3@gmail.com",
    "senha" : "123"
}