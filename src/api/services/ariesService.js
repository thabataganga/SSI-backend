const axios = require("axios");

/**
 * Função para configurar e retornar uma instância do cliente Axios com as configurações padrão.
 * Esta função pode ser chamada sempre que você precisar de uma instância do cliente Axios com as mesmas configurações.
 * @param {string} [token] O token de autenticação opcional a ser adicionado ao cabeçalho 'Authorization'.
 * @returns {AxiosInstance} Uma instância do cliente Axios configurada com as configurações padrão.
 */
function createAriesApiClient(token = null) {
  // Configuração padrão do cliente Axios
  const config = {
    baseURL: process.env.ARIES_URL,
    headers: {
      "Content-Type": "application/json", // Definindo o tipo de conteúdo como JSON
    },
  };

  // Se um token de autenticação foi fornecido, adicione-o ao cabeçalho 'Authorization'
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // Cria e retorna uma instância do cliente Axios com as configurações fornecidas
  return axios.create(config);
}

module.exports = {
  createAriesApiClient,
};
