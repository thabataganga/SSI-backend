const axios = require("axios");

// Função para fazer a requisição de token de autenticação
async function requestAuthToken(tenantId, apiKey, walletKey = "") {
  const ariesApi = axios.create({
    baseURL: process.env.ARIES_URL,
    headers: {
      "Content-Type": "application/json", // Definindo o tipo de conteúdo como JSON
    },
  });

  const requestData = {
    api_key: apiKey,
    wallet_key: walletKey,
  };

  //console.log(requestData)

  try {
    const response = await ariesApi.post(
      `/multitenancy/tenant/${tenantId}/token`,
      requestData
    );
    console.log(response.data);
    return response.data.token;
  } catch (error) {
    throw new Error(
      "Erro ao solicitar token de autenticação: " + error.response.data
    );
  }
}

// Função para criar um convite
async function createInvitation(token, alias, multiUse) {
  const ariesApi = axios.create({
    baseURL: process.env.ARIES_URL,
    headers: {
      "Content-Type": "application/json", // Definindo o tipo de conteúdo como JSON
      Authorization: `Bearer ${token}`, // Adicionando o token de autenticação ao cabeçalho de autorização
    },
  });

  try {
    // Concatena os parâmetros alias e multi_use na URL da requisição
    const response = await ariesApi.post(
      `/connections/create-invitation?alias=${alias}&multi_use=${multiUse}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao criar convite: " + error.response.data);
  }
}

async function getConnections(token) {
  //console.log(token)
  const ariesApi = axios.create({
    baseURL: process.env.ARIES_URL,
    headers: {
      "Content-Type": "application/json", // Definindo o tipo de conteúdo como JSON
      Authorization: `Bearer ${token}`, // Adicionando o token de autenticação ao cabeçalho de autorização
    },
  });

  //console.log(ariesApi)

  try {
    const response = await ariesApi.get("/connections");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao mostrar conexões: " + error.response.data);
  }
}

async function getConnection(connection_id, token) {
  const ariesApi = axios.create({
    baseURL: process.env.ARIES_URL,
    headers: {
      "Content-Type": "application/json", // Definindo o tipo de conteúdo como JSON
      Authorization: `Bearer ${token}`, // Adicionando o token de autenticação ao cabeçalho de autorização
    },
  });

  try {
    const response = await ariesApi.get(`/connections/${connection_id}`);
    return response.data; // Retorne a conexão obtida da resposta
  } catch (error) {
    throw new Error("Erro ao obter conexão: " + error.message);
  }
}

async function getDIdDocument(token, did) {
  const ariesApi = axios.create({
    baseURL: process.env.ARIES_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    const response = await ariesApi.get(`/resolver/resolve/${did}`);
    return response.data.did_document; // Retorne o documento DID obtido da resposta
  } catch (error) {
    throw new Error("Erro ao obter o documento DID: " + error.message);
  }
}

async function checkConnectionState(connection_id, token) {
  try {
    // Obtém as conexões disponíveis
    const connections = await getConnections(token);

    // Verifica se alguma das conexões corresponde à connection_id fornecida e tem o estado "active"
    const connection = connections.results.find(
      (conn) => conn.connection_id === connection_id && conn.state === "active"
    );

    // Retorna verdadeiro se a conexão estiver ativa, caso contrário, retorna falso
    return !!connection;
  } catch (error) {
    // Em caso de erro, lança uma exceção
    throw new Error("Erro ao verificar o estado da conexão: " + error.message);
  }
}

async function sendOffer(token, requestBody) {
  const ariesApi = axios.create({
    baseURL: process.env.ARIES_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    // Faça a solicitação POST para enviar a oferta de credencial
    const response = await ariesApi.post(
      "/issue-credential/send-offer",
      requestBody
    );

    // Retorne os dados da resposta
    return response.data;
  } catch (error) {
    // Se houver um erro, lance uma exceção
    throw new Error("Erro ao enviar a oferta de credencial: " + error.message);
  }
}

async function checkCredentialState(token, connection_id, thread_id) {
  const ariesApi = axios.create({
    baseURL: process.env.ARIES_URL,
    headers: {
      "Content-Type": "application/json", // Definindo o tipo de conteúdo como JSON
      Authorization: `Bearer ${token}`, // Adicionando o token de autenticação ao cabeçalho de autorização
    },
  });

  const role = "issuer";

  console.log("thread", thread_id);

  const url = `/issue-credential/records?connection_id=${connection_id}&role=${role}&thread_id=${thread_id}`;

  try {
    const response = await ariesApi.get(url);
    return response.data.results;
  } catch (error) {
    console.log(error.response);

    throw new Error(
      "Erro ao mostrar registros de credenciais: " + error.response
    );
  }
}

async function sendProofRequest(token, requestBody) {
  const ariesApi = axios.create({
    baseURL: process.env.ARIES_URL,
    headers: {
      "Content-Type": "application/json", // Definindo o tipo de conteúdo como JSON
      Authorization: `Bearer ${token}`, // Adicionando o token de autenticação ao cabeçalho de autorização
    },
  });

  try {
    const response = await ariesApi.post(
      "/present-proof/send-request",
      requestBody
    );
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response);

    throw new Error("Erro ao enviar requisição de prova: " + error.response);
  }
}

async function verifyProof(token, presentation_exchange_id) {
  const ariesApi = axios.create({
    baseURL: process.env.ARIES_URL,
    headers: {
      "Content-Type": "application/json", // Definindo o tipo de conteúdo como JSON
      Authorization: `Bearer ${token}`, // Adicionando o token de autenticação ao cabeçalho de autorização
    },
  });

  const url = `/present-proof/records/${presentation_exchange_id}`;

  try {
    const response = await ariesApi.get(url);
    return response.data;
  } catch (error) {
    console.log(error.response);

    throw new Error("Erro ao verificar o envio das provas: " + error.response);
  }
}

module.exports = {
  requestAuthToken,
  createInvitation,
  getConnections,
  getConnection,
  checkConnectionState,
  sendOffer,
  checkCredentialState,
  getDIdDocument,
  sendProofRequest,
  verifyProof,
};
