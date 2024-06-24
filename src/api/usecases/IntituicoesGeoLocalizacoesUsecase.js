module.exports = () => {
    return class {
        static async criar(instituicao, request) { }
        static atualizar(instituicao, request) { }
        static deletarUm(instituicao, nestedId) { }
        static deletarTodos(instituicao, nestedId) { }
        static todos(instituicao, queryParams) { }
        static obterPorId(instituicao, nestedId) {} 
        static obterPorFiltro(instituicao, filtro) {}
    }
}