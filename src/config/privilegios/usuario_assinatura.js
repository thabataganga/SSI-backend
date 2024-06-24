const permissao = (full=false, ler=false, modificar=false, deletar=false) => {
    if (full) return { full, GET:true, PATCH:true, DELETE:true}
    else return { GET:ler, PATCH:modificar, DELETE:deletar}
}

const RSA = require('../certificates/RSA').USUARIO

module.exports = {
    "assinatura" : "519d56fe-f1a8-4a9f-942b-966bfcd31464",
    RSA
}