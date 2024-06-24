const permissao = (full=false, ler=false, modificar=false, deletar=false) => {
    if (full) return { full, GET:true, PATCH:true, DELETE:true}
    else return { GET:ler, PATCH:modificar, DELETE:deletar}
}

const RSA = require('../certificates/RSA').ADMIN

module.exports = {
    "assinatura" : "82217e95-8d27-48a5-9b3c-e55316e86b9d",
    RSA
}