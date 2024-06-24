const { ariesClient } = require("../services");
const service = require("../facade/InstituicaoFacade")();
const filterResponse = require("./utils/filterResponse");
const CodigoGerador = require("..//models/utils/conviteCodigoGerador");
const InstituicaoRecuperarSenhaUsecase = require("../usecases/InstituicaoRecuperarSenhaUseCase");
const axios = require("axios");
const qr = require("qrcode");
const qrTerminal = require("qrcode-terminal");
const { verifyProof } = require("../services/ariesClient");

const interceptor = async (req, res, next, instituicao_id) => {
  try {
    const entidade = await service.obterPorId(instituicao_id);
    req.locals.entidade = entidade;
    next();
  } catch (error) {
    return next(error);
  }
};

const listarTodos = async (req, res, next) => {
  try {
    const todos = await service.todos(req.body);
    return res.status(200).json(todos);
  } catch (error) {
    return next(error);
  }
};

const listarUm = async (req, res, next) => {
  const { entidade, access } = req.locals;

  try {
    const instituicao = await service.obterComPopulate(
      entidade._id,
      "admistradores",
      access
    );
    return res
      .status(200)
      .json(
        filterResponse(instituicao, [
          "_id",
          "nome_fantasia",
          "cnpj",
          "telefone",
          "tipo",
          "status",
          "email",
          "endereco",
          "identidade_visual",
          "redes_sociais",
          "api_noticias",
          "liderancas",
          "sobre_nos",
          "slug",
          "pix",
        ])
      );
  } catch (error) {
    next(error);
  }
};

const listarPix = async (req, res, next) => {
  const { entidade, access } = req.locals;

  try {
    const instituicao = await service.obterComPopulate(
      entidade._id,
      "admistradores",
      access
    );
    return res.status(200).json(filterResponse(instituicao, ["pix"]));
  } catch (error) {
    next(error);
  }
};

const getTokenApi = async (req, res, next) => {
  const { entidade, access } = req.locals;
  const { url, usuario, senha } = req.body;

  const dadosLogin = {
    username: usuario,
    password: senha,
  };

  var api_dados = entidade.api_dados;

  // console.log(api_dados)
  //console.log(dadosLogin)

  const apiDados = axios.create({
    baseURL: url,
  });

  console.log(url);

  // await apiDados(url);
  try {
    const { data } = await apiDados.post(`${url}/login`, dadosLogin);
    api_dados = {
      link: url,
      chave: data.token,
    };
    return res.status(200).json({ data, api_dados });
  } catch (error) {
    next(error);
  }
};

const resgatarID = async (req, res, next) => {
  console.log("Busca ID");

  const { instituicao_id, cpf, datanasc } = req.params;

  try {
    const instituicao = await service.obterPorId(instituicao_id);
    const api_dados = instituicao.api_dados;
    const { link, chave } = api_dados;

    const apiDados = axios.create({
      baseURL: link,
    });

    const url = `${link}/carteirinha`;

    const config = {
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": "application/json",
      },
      params: {
        cpf,
        datanasc,
      },
    };

    const { data } = await apiDados.get(url, config);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

const listarUmPrivado = async (req, res, next) => {
  const { entidade, access } = req.locals;

  try {
    const instituicao = await service.obterComPopulate(
      entidade._id,
      "admistradores",
      access
    );
    return res.status(200).json(instituicao);
  } catch (error) {
    next(error);
  }
};

const listarUmRecurso = async (req, res, next) => {
  const { entidade } = req.locals;
  const recurso = entidade[req.params.recurso];
  if (!recurso) {
    return res.status(404).json({
      message: "Not Found",
      detalhes: "Recurso não encontrado!",
      code: 404,
    });
  }

  return res.status(200).json(recurso);
};

const inserirUm = async (req, res, next) => {
  try {
    const novoCriado = await service.criar(req.body);

    return res
      .status(200)
      .json(
        filterResponse(novoCriado, [
          "_id",
          "nome_fantasia",
          "slug",
          "cnpj",
          "telefone",
          "tipo",
          "status",
          "email",
          "endereco",
          "identidade_visual",
          "redes_sociais",
          "api_noticias",
          "liderancas",
          "sobre_nos",
        ])
      );
  } catch (error) {
    next(error);
  }
};

const inserirUmComConvite = async (req, res, next) => {
  try {
    const novoCriado = await service.criarComConvite(
      Object.assign(req.body, {
        token: req.get("authorization").split(" ")[1],
        codigo: req.params.codigo,
      })
    );
    return res
      .status(200)
      .json(
        filterResponse(novoCriado, [
          "_id",
          "nome_fantasia",
          "redes_sociais",
          "identidade_visual",
          "email",
          "tipo",
          "status",
        ])
      );
  } catch (error) {
    next(error);
  }
};

const editarUm = async (req, res, next) => {
  const { entidade } = req.locals;
  const novasInfos = req.body;
  try {
    await service.atualizar(novasInfos, entidade);
    return res.status(200).json(novasInfos);
  } catch (error) {
    return next(error);
  }
};

const deletarUm = async (req, res, next) => {
  const { entidade } = req.locals;
  try {
    const message = await service.deletar(entidade);
    return res.status(200).json(message);
  } catch (error) {
    return next(error);
  }
};

const convite = async (req, res, next) => {
  try {
    const response = await service.convite(
      Object.assign(req.body, { criadorId: req.locals.client.id })
    );
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const obterTodosOsConvites = async (req, res, next) => {
  const { instituicao_id } = req.params;
  try {
    const convites = await service.todosOsConvites(instituicao_id, req.params);
    res.status(200).json(convites);
  } catch (error) {
    next(error);
  }
};

const iniciarAries = async (req, res, next) => {
  console.log(req.params);
  try {
    res.status(200).json({ message: "Aries inicializado" });
  } catch (error) {
    next(error);
  }
};

const requestAriesAuthToken = async (req, res, next) => {
  //console.log(req.body)
  const { tenantId, apiKey } = req.body;
  try {
    const token = await ariesClient.requestAuthToken(tenantId, apiKey);
    res.status(200).json({ token: token });
  } catch (error) {
    next(error);
  }
};

const ariesInvitation = async (req, res, next) => {
  const { token, alias, multi_use } = req.body;
  try {
    const invite = await ariesClient.createInvitation(token, alias, multi_use);
    const shortenedUrl = await shortenUrl(invite.invitation_url);
    console.log("URL do convite encurtada:", shortenedUrl);

    // Modificar o objeto invite para incluir a URL encurtada
    invite.shortened_url = shortenedUrl;
    partes = invite.invitation_url.split("=");
    console.log(partes[1]);
    invite.didcom = "didcomm://aries_connection_invitation?c_i=" + partes[1];

    // Gerar o código QR com largura reduzida e correção de erros configurada como 'low'
    const qrCode = await generateQR(shortenedUrl, {
      width: 5,
      errorCorrectionLevel: "low",
    });

    // Exibir o código QR no console
    //qrTerminal.generate(qrCode, { small: true });

    // Retorna o convite gerado com a URL encurtada como resposta
    res.status(200).json({ invite });
  } catch (error) {
    // Se houver algum erro, passa para o próximo middleware de tratamento de erros
    next(error);
  }
};

async function generateQR(url, options) {
  return new Promise((resolve, reject) => {
    qr.toDataURL(url, options, (err, qrCode) => {
      if (err) {
        reject(err);
      } else {
        resolve(qrCode);
      }
    });
  });
}

async function shortenUrl(longUrl) {
  const response = await axios.post("https://tinyurl.com/api-create.php", {
    url: longUrl,
  });
  return response.data;
}

const ariesConnections = async (req, res, next) => {
  const { token } = req.body;
  try {
    const connections = await ariesClient.getConnections(token);
    res.status(200).json({ connections });
  } catch (error) {
    next(error);
  }
};

const ariesSingleConnection = async (req, res, next) => {
  const { connection_id } = req.params; // Obtém o connection_id dos parâmetros da URL
  const { token } = req.body;
  try {
    // Use o connection_id para buscar a conexão correspondente
    const connection = await ariesClient.getConnection(connection_id, token);
    res.status(200).json({ connection });
  } catch (error) {
    next(error);
  }
};

const didResolver = async (req, res, next) => {
  const { did } = req.params;
  const tenantId = process.env.TENANT_ID;
  const apiKey = process.env.API_KEY;
  try {
    const token = await ariesClient.requestAuthToken(tenantId, apiKey);
    const didDocument = await ariesClient.getDIdDocument(token, did);
    res.status(200).json({ didDocument });
  } catch (error) {
    next(error);
  }
};

const verifyConnectionState = async (req, res, next) => {
  const { connection_id, token } = req.body;
  try {
    const isActive = await ariesClient.checkConnectionState(
      connection_id,
      token
    );
    res.status(200).json({ active: isActive });
  } catch (error) {
    next(error);
  }
};

const sendOffer = async (req, res, next) => {
  const { token } = req.body; // Obtenha o token do corpo da solicitação
  try {
    // Dados fixos
    const auto_issue = true;
    const auto_remove = false;
    const cred_def_id = process.env.CRED_DEF_ID;
    const trace = false;

    // Definir os mime-types fixos
    const mimeTypes = {
      DateOfBirth: "text/plain",
      State: "text/plain",
      DateOfExpiry: "text/plain", // Agora é definido como "date" em vez de "text/plain"
      ZIP: "text/plain",
      CPF: "text/plain",
      FiliationType: "text/plain",
      Institution: "text/plain",
      SocialName: "text/plain",
      City: "text/plain",
      FullName: "text/plain",
      Photo: "image/jpeg",
      Country: "text/plain",
      RegistrationNumber: "text/plain",
      Company: "text/plain",
    };

    // Dados variáveis do corpo da solicitação
    const { connection_id, credential_preview } = req.body;
    const comment = req.body.comment || ""; // Verifique se há um comentário, se não, deixe vazio

    // Construa os atributos com os mime-types fixos
    const attributes = credential_preview.attributes.map((attribute) => ({
      name: attribute.name,
      value: attribute.value,
      "mime-type": mimeTypes[attribute.name] || "text/plain", // Use o mime-type fixo se estiver definido, caso contrário, use "text/plain"
    }));

    // Construa o corpo da requisição
    const requestBody = {
      auto_issue,
      auto_remove,
      comment,
      connection_id,
      cred_def_id,
      credential_preview: {
        "@type": "issue-credential/2.0/credential-preview",
        attributes,
      },
      trace,
    };

    // Chame a função `sendOffer` do serviço Aries, passando o corpo da requisição
    const result = await ariesClient.sendOffer(token, requestBody);

    // Retorne a resposta
    res.status(200).json(result);
  } catch (error) {
    // Se houver algum erro, passe para o próximo middleware de tratamento de erros
    next(error);
  }
};

const ariesWallet = async (req, res, next) => {
  const { entidade, access } = req.locals;

  try {
    const instituicao = await service.obterComPopulate(
      entidade._id,
      "admistradores",
      access
    );
    return res.status(200).json(filterResponse(instituicao, ["_id", "wallet"]));
  } catch (error) {
    next(error);
  }
};

const verifyCredential = async (req, res, next) => {
  const { connection_id, thread_id, token } = req.body;
  //console.log(req.body);
  try {
    const isVerified = await ariesClient.checkCredentialState(
      token,
      connection_id,
      thread_id
    );
    res.status(200).json({ verify: isVerified });
  } catch (error) {
    next(error);
  }
};

const sendProofRequestFiliacao = async (req, res, next) => {
  const { connection_id, token } = req.body;

  // Obter a data atual formatada como YYYYMMDD
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adiciona um zero à esquerda se o mês tiver apenas um dígito
  const day = String(currentDate.getDate()).padStart(2, "0"); // Adiciona um zero à esquerda se o dia tiver apenas um dígito
  const formattedDate = parseInt(`${year}${month}${day}`);

  const requestBody = {
    connection_id: connection_id,
    auto_verify: true,
    comment: "Prova de filiação dentro da validade",
    trace: false,
    proof_request: {
      name: "Prova de Filiação",
      nonce: "1234567890",
      version: "1.0",
      requested_attributes: {
        filiationInfo: {
          names: ["FullName", "Institution", "CPF", "RegistrationNumber"],
          restrictions: [
            {
              schema_name: process.env.SCHEMA_NAME,
              cred_def_id: process.env.CRED_DEF_ID,
            },
          ],
        },
      },
      requested_predicates: {
        not_expired: {
          name: "DateOfExpiry",
          p_type: ">=",
          p_value: formattedDate, // Utilize a data atual formatada como p_value
          restrictions: [
            {
              schema_name: process.env.SCHEMA_NAME,
              cred_def_id: process.env.CRED_DEF_ID,
            },
          ],
        },
      },
    },
  };

  try {
    const sentProof = await ariesClient.sendProofRequest(token, requestBody);
    res.status(200).json({ proof: sentProof });
  } catch (error) {
    next(error);
  }
};

const sendProofRequestAcordoColetivo = async (req, res, next) => {
  const { connection_id, token } = req.body;

  // Obter a data atual formatada como YYYYMMDD
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = parseInt(`${year}${month}${day}`);

  const requestBody = {
    connection_id: connection_id,
    auto_verify: false,
    comment: "Prova de acordo coletivo",
    trace: false,
    proof_request: {
      name: "Prova de Acordo Coletivo",
      nonce: "1234567890",
      version: "1.0",
      requested_attributes: {
        acordoInfo: {
          names: [
            "FullName",
            "Institution",
            "CPF",
            "Company",
            "RegistrationNumber",
          ],
          restrictions: [
            {
              schema_name: process.env.SCHEMA_NAME,
              cred_def_id: process.env.CRED_DEF_ID,
            },
          ],
        },
      },
      requested_predicates: {
        not_expired: {
          name: "DateOfExpiry",
          p_type: ">=",
          p_value: formattedDate,
          restrictions: [
            {
              schema_name: process.env.SCHEMA_NAME,
              cred_def_id: process.env.CRED_DEF_ID,
            },
          ],
        },
      },
    },
  };

  try {
    const sentProof = await ariesClient.sendProofRequest(token, requestBody);
    res.status(200).json({ proof: sentProof });
  } catch (error) {
    next(error);
  }
};

const verifyProofSend = async (req, res, next) => {
  const tenantId = process.env.TENANT_ID;
  const apiKey = process.env.API_KEY;
  const { presentation_exchange_id } = req.body;
  try {
    const token = await ariesClient.requestAuthToken(tenantId, apiKey);
    const isProven = await verifyProof(token, presentation_exchange_id);

    res.status(200).json({ proof: isProven });
  } catch (error) {
    next(error);
  }
};

const recuperarSenha = async (req, res, next) => {
  console.log("recuperar senha");
  const recuperarSenhaRequest = Object.assign(req.body);
  try {
    const codigo = {
      codigo: CodigoGerador(),
    };
    const instituicao = await service.obterPorEmail(
      recuperarSenhaRequest.email
    );
    const novoCriado = await InstituicaoRecuperarSenhaUsecase.recuperarSenha(
      instituicao,
      codigo
    );
    return res.status(200).json({
      msg: "Codigo enviado para o email",
      email: recuperarSenhaRequest.email,
    });
  } catch (error) {
    return res.status(404).json({ msg: "email nao encontrado" });
  }
};

const alterarSenha = async (req, res, next) => {
  console.log("Alterar senha");
  const novaSenhaRequest = Object.assign(req.body);
  const Codigo = req.params.codigo;
  let autorizado = false;

  try {
    const instituicao = await service.obterPorEmail(novaSenhaRequest.email);

    const Senha = {
      senha: novaSenhaRequest.senha,
    };

    const recuperarBanco = instituicao.recuperarSenha;
    if (recuperarBanco[recuperarBanco.length - 1].codigo === Codigo) {
      console.log("autorizado");
      autorizado = true;
    }

    console.log(autorizado);

    if (autorizado) {
      const atualizado = await service.atualizar(Senha, instituicao);
      return res.status(200).json({ msg: "senha alterada" });
    }
    return res.status(404).json({ msg: "troca de senha nao autorizada" });
  } catch (error) {
    return res.status(404).json({ msg: "troca de senha nao autorizada" });
  }
};

module.exports = {
  listarTodos,
  listarUm,
  inserirUm,
  listarUmPrivado,
  editarUm,
  deletarUm,
  listarUmRecurso,
  interceptor,
  convite,
  inserirUmComConvite,
  obterTodosOsConvites,
  recuperarSenha,
  alterarSenha,
  listarPix,
  getTokenApi,
  resgatarID,
  iniciarAries,
  requestAriesAuthToken,
  ariesInvitation,
  ariesConnections,
  ariesSingleConnection,
  verifyConnectionState,
  sendOffer,
  ariesWallet,
  verifyCredential,
  didResolver,
  sendProofRequestFiliacao,
  sendProofRequestAcordoColetivo,
  verifyProofSend,
};
