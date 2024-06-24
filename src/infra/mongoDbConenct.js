const mongoose = require("mongoose");
const log = require("../api/log");
const { criarIndices } = require("../api/models");

const { DB_DATABASE, DB_HOSTNAME, DB_PORT, DB_USERNAME, DB_PASSWORD } =
  process.env;

const MONGO_DATABASE = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOSTNAME}:${DB_PORT}/${DB_DATABASE}?authSource=admin`;
//const MONGO_DATABASE = `mongodb://${DB_HOSTNAME}:${DB_PORT}/${DB_DATABASE}?authSource=admin`;

const connect = () => {
  try {
    mongoose.connect(MONGO_DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    log.sucess("database connected!");
    log.info("tentando gerar indices...");

    criarIndices();

    return mongoose;
  } catch (error) {
    log.error(error.message);
    process.exit(1);
  }
};

module.exports = { connect };
