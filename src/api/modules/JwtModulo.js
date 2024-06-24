const jwt = require("jsonwebtoken");
const jwtValidator = require("validator/lib/isJWT");
const RSA = require("../../config/certificates/RSA");

const admin = require("../../config/privilegios/admin_assinatura");
const instituicao = require("../../config/privilegios/instituicao_assinatura");
const usuario = require("../../config/privilegios/usuario_assinatura");

const privilegios = [admin, instituicao, usuario];
/**
 * @param {static JwtGenerator.Builder(role)}
 * @description para gerar uma assinatura valida é necessário inserir a role(privilegio) adquado.
 */

class JwtGenerator {
  generate(payload) {
    const options = Object.assign({}, this.options);
    return jwt.sign(
      {
        data: payload,
        aud: this.input.aud,
        iss: this.input.issuer,
      },
      this.secretOrPrivateKey,
      options
    );
  }

  verify(autorization) {
    const token = this.bearerValidate(autorization);
    return jwt.verify(token, this.secretOrPublicKey, this.output);
  }

  decode(autorization) {
    const token = this.bearerValidate(autorization);
    return jwt.decode(token, { complete: true });
  }

  refresh(token) {
    const payload = this.verify(token);
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;
    const jwtSignOptions = Object.assign({}, this.options);
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }

  bearerValidate(autorization) {
    if (!autorization) throw new Error("Token jwt is required");

    const token = autorization && autorization.split(" ")[1];

    const validJwt =
      autorization &&
      (autorization.toLowerCase().includes("jwt") ||
        autorization.toLowerCase().includes("baerer"));

    if ((!validJwt, !jwtValidator(token)))
      throw new Error("Token jwt not valid");
    return token;
  }

  constructor(secretOrPublicKey, secretOrPrivateKey, aud, alg) {
    this.options = {
      algorithm: alg || "RS384",
      keyid: "1",
      noTimestamp: false,
      expiresIn: "780h",
      //notBefore: '2s'
    };
    this.input = {
      aud,
      issuer: "",
      jwtid: 1,
    };
    this.output = {
      audience: this.input.aud,
      issuer: this.input.issuer,
    };
    this.secretOrPublicKey = secretOrPublicKey;
    this.secretOrPrivateKey = secretOrPrivateKey;
  }
  static Builder(operacao, { token, roles }) {
    if (operacao === "VERIFICAR") {
      const {
        payload: { aud: assinatura },
      } = new this("secret", "secret", null, null).decode(token);

      for (const role of privilegios) {
        if (assinatura == role.assinatura)
          return [
            role,
            this.Builder("CRIAR", {
              roles: role,
            }).verify(token),
          ];
      }

      throw {
        message: "jwt assinatura invalida",
      };
    }

    if (operacao === "CRIAR") {
      if (!roles || !roles.assinatura || !roles.RSA) throw "role invalid";

      return new this(
        roles.RSA.secretOrPublicKey,
        roles.RSA.secretOrPrivateKey,
        roles.assinatura
      );
    }

    throw "operacao invalida";
  }
}

module.exports = JwtGenerator;
