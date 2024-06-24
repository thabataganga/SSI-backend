// dependecias do swagger
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../../../swagger_output.json");

module.exports = (app) => {
  // rotas
  app.use("/", require("./indexRotas"));
  app.use("/", require("./instituicaoRotas"));
  app.use("/", require("./usuarioRotas"));
  app.use("/aries", require("./ariesRotas")); // Adicionando as rotas do ariesClientController com o prefixo /aries
  app.use("/auth", require("./entrarRotas"));
  app.use("/noticia", require("./noticasRotas"));
  app.use("/admin", require("./adminRotas"));
  app.use("/convite", require("./conviteRotas"));
  //app.use("/sindicato", require("./sindicatoRotas"))
  //app.use("/candidatura", require("./candidaturaRotas"))

  //swaggerUi
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

  // default pagina não encontrada
  app.use(require("../controllers/errorController"));

  // error controller
  app.use(require("../../config/notFound"));

  return app;
};
