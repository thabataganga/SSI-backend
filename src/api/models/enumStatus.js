const enumStatus = [
    "BLOQUEADO",
    "ATIVO",
    "ATIVACAO_PENDENTE",
    "DESATIVADO"
]
module.exports =  {
   type: String,
   require: true,
   enum: {
       values: enumStatus,
       message: 'Valores validos:' + enumStatus.join(" | ")
   }
}