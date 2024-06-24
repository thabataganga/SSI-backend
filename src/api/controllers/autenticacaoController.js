const { entrar: adminEntrar } = require('../services/adminService')()
const { entrar: instituicaoEntrar } = require('../facade/InstituicaoFacade')()
const { entrar: usuarioEntrar } = require('../facade/UsuariosFacade')()
const ServiceError = require("../err/ServiceError")

/**
 * as propriedades são equivalentes aos path params entrarComoMaster entrarComoAdmin
 */
const handle = {
  admin: adminEntrar,
  instituicao: instituicaoEntrar,
  usuario: usuarioEntrar,
};

// enpoits de buildLogin
// entrar admistradores (istituicao)
// entrar colaborador, associado  (istituicao -> ler)

const login = async (entidade, email, senha) => {

  try {
    if (!entidade) throw new ServiceError(
      "Servidor indisponivel", 500,
      "Por favor, entre em contato com a equipe de desenvolvimento: detalhes: sem handle de login"
    )
    return await entidade(email, senha)
  } catch (error) {
    throw error
  }
}
const preLogin = ({ email, usuario, senha }) => {
      if (!email || email.includes("@") === false) {
        throw new ServiceError("Email Requirido.", 400, "É requirido um email válido")
      }

      if (!senha || senha.length.toString().trim() < 3) {
          throw new ServiceError("Senha requirida", 400, "É a senha é requirida e precisa ter no minimo 3 digitos")
      }
}
module.exports = async (req, res, next) => {
  const { email, usuario, senha } = req.body;
  const { permissao } = req.params;
  try {
    if (!handle.hasOwnProperty(permissao))
      return next(
        new ServiceError(
          "Parametros invalidos",
          404,
          "Não existe um modo de antenticacao para o tipo de acesso fornecido"
        )
      );
    
    preLogin(req.body)

    const token = await login(handle[permissao], email, senha);

    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
};
