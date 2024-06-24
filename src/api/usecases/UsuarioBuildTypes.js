const ServiceError = require("../err/ServiceError");

const UsuariosTipos = ["COLABORADOR", "ASSOCIADO", "FILIADO"];
module.exports = class {
  /**
   *
   * @param {ENUM} usuarioTipo Tipo de usuario, colaborador ou  FILIADO | ASSOCIADO ->
   * depended da instituicao dele
   * @param {ENUM} instituicaoTipo tipo de istituicao
   * Se a instituicao for do tipo Sindicato, o usuario será do tipo filiado,
   * caso seja do tipo Candidatura, o usuario sera do tipo associado
   * @deprecated essas regras precisam ser melhoradas
   */
  static buildTipo = (usuarioTipo, instituicaoTipo) => {
    const [COLABORADOR, ASSOCIADO, FILIADO] = UsuariosTipos;

    if (UsuariosTipos.includes(usuarioTipo)) return usuarioTipo;

    if (!instituicaoTipo) throw "É obrigatório informar o tipo de instituicao";
    if (!usuarioTipo) throw "É obrigatório informar o tipo de usuario";

    if (usuarioTipo == "ADMIN" || usuarioTipo == COLABORADOR)
      return COLABORADOR;

    if (usuarioTipo == "MEMBRO") {
      if (instituicaoTipo == "SINDICATO") return FILIADO;
      else return ASSOCIADO;
    }

    throw "Não foi possivel definir o tipo de usuario";
  };

  static buildTipoConvite = (usuarioTipo) => {
    if (usuarioTipo == "ADMIN" || usuarioTipo == "COLABORADOR") return "ADMIN";
    if (
      usuarioTipo == "MEMBRO" ||
      usuarioTipo == "ASSOCIADO" ||
      usuarioTipo == "FILIADO"
    )
      return "MEMBRO";

    throw "Não foi possivel definir o tipo de usuario at: " + usuarioTipo;
  };

  /**
   *
   * @param {MoogoseId} instituicaoId ID de referencia da instituicao
   * @param {ENUM} instituicaoTipo tipo de usuario
   * @param {String} vinculo tipo de vinculo
   * @returns { Object }
   * @deprecated Essa função precisa ser melhorada
   */

  static buildInstituicao = (instituicaoId, instituicaoTipo, vinculo) => {
    if (!instituicaoId) throw '"instituicaoId" is required';
    if (!instituicaoTipo) throw '"instituicaoTipo" is required';
    if (!vinculo) throw '"vinculo" is required';

    return {
      instituicao_id: instituicaoId,
      instituicao_tipo: instituicaoTipo,
      vinculo: vinculo,
    };
  };
};
