/**
 * arquivo de configuração de exibição de dados do usuario, por defaut tanto o usuario,
 * tanto a idook pode visualizar todos os dados,
 * abaixo insira os dados que deseja que que NÃO SEJAM compartilhados
 */

/*
    dados_sensiveis -> referente a dados sensiveis mesmo
*/
const dados_sensiveis = ["cpf"]

/*
    camposBasicos -> outros campos básicos
*/
const camposBasicos = []

/**
 * composComplexos -> por exemplo privacidade e por ai vai...
 */
const camposComplexos = []

/**
 * exporta uma lista de propriedades com os dados removidos
 * atenção - não editar o export abaixo
 */
module.exports = []
    .concat(camposBasicos)
    .concat(dados_sensiveis)
    .concat(camposComplexos)