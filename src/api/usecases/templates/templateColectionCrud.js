module.exports = () => {
    return class {
        static async criar(instituicao, request) { }
        static async atualizar(instituicao, request) { }
        static async deletarUm(instituicao, nestedId) { }
        static async deletarTodos(instituicao, nestedId) { }
        static async todos(instituicao, queryParams) { }
        static async obterPorId(instituicao, nestedId) {} 
        static async obterPorFiltro(instituicao, filtro) {}
    }
}