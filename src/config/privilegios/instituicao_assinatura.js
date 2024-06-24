const permissao = (full=false, ler=false, modificar=false, deletar=false) => {
    if (full) return { full, GET:true, PATCH:true, DELETE:true}
    else return { GET:ler, PATCH:modificar, DELETE:deletar}
}

const RSA = require('../certificates/RSA').ISTITUICAO

module.exports = {
    "assinatura" : "5127062e-6f19-4432-96f7-5ea4fe45fd51",
    RSA
}