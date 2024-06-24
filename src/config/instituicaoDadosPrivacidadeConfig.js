/**
 * arquivo de configuração de exibição de dados do instituicao, por defaut tanto o instituicao,
 * tanto a idook pode visualizar todos os dados,
 * abaixo insira os dados que deseja que que NÃO SEJAM compartilhados
 */

/*
    dados_sensiveis -> referente a dados sensiveis mesmo
*/
const dados_sensiveis = ["email", "senha"]

/*odel
    camposBasicos -> outros campos básicos
*/
const camposBasicos = []

/**
 * composComplexos -> por exemplo privacidade e por ai vai...
 */
const camposComplexos = [ "api_dados", "api_noticias", "admistradores"]

/**
 * excluidos por padrao pois requerem interações adicionais para funcionar
 */
 const padraoExcluido = {
     colaboradores: false,
     associados: false
 }

 /**
  * NÃO EDITAR A PARTIR DAQUI 
  */
const camposRemovidos = []
.concat(camposBasicos)
.concat(dados_sensiveis)
.concat(camposComplexos)


camposRemovidos.exclude = padraoExcluido

/**
 * exporta uma lista de propriedades com os dados removidos
 */
module.exports = camposRemovidos


