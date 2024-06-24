import axios from "axios";

const apiDados = axios.create({
  //baseURL: "https://api.idook.com.br",
  baseURL: "https://integracao.sindpd.org.br/api2/",
});

export default apiDados;
