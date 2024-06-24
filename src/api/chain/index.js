const admistradorPermissao = require("./admistradorPermissao");
const usuarioPermissao = require("./usuarioPermissao");
const instituicaoPermissao = require("./instituicaoPermissao");
const AuthorizationHandler = require("./AuthorizationHandler");

module.exports = {
  admin: admistradorPermissao,
  usuario: usuarioPermissao,
  instituicao: instituicaoPermissao(),
  AuthorizationHandler,
};
