const app = require("./src/app");
const log = require("./src/api/log");

const PORT = process.env.APP_PORT || 8080;
const NODE_ENV = process.env.NODE_ENV;

app.listen(
  PORT,
  () => log.sucess(`server rodando no modo ${NODE_ENV}, na port ${PORT}`)
  //elvis-cezar
);
