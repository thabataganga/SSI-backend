const colaboradorUsecase = require("../InstituicaoColaboradoresUsecase")

describe('Instituicao - COLABORADORES', () => {
    test('deve criar um colaborador', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() {
                this.colaboradores = []
                this._id = instituicaoId
            }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        const usuario_id = "1234"
        const novoColaborador = {
            "usuario_id": usuario_id,
            "_id": usuario_id,
            "matricula": "123456",
            "departamento": "Liga da Justica",
            "cargo": "assistente do Batima",
            "status": "ATIVO"
        }

        const usuario = await colaboradorUsecase
            .criar(new FakeModel(), novoColaborador, FakeModel)

        expect(usuario).toEqual(novoColaborador);
    });

    test('deve atualizar um colaborador', async () => {
        const instituicaoId = "12345"
        const usuario_id = "1234"
        const colaborador = {
            "usuario_id": usuario_id,
            "_id": usuario_id,
            "matricula": "123456",
            "departamento": "Liga da Justica",
            "cargo": "assistente do Batima",
            "status": "ATIVO"
        }

        class FakeModel {
            constructor() {
                this.colaboradores = [colaborador]
                this._id = instituicaoId
            }
            async save() {
                this.colaboradores.map(a => a._id = "1234")
                return this
            }
            static findById() {
                return new this()
            }
        }
        const usuarioAtualizado = {
            "usuario_id": usuario_id,
            "_id": usuario_id,
            "matricula": "123456",
            "departamento": "Liga da Justica",
            "cargo": "assistente do Flash",
            "status": "ATIVO"
        }

        const usuario = await colaboradorUsecase
            .atualizar(new FakeModel(), usuario_id, usuarioAtualizado)

        expect(usuarioAtualizado).toEqual(usuario);
    });

    test('deve deletar um colaborador', async () => {
        const instituicaoId = "12345"
        const usuario_id = "1234"
        const colaborador = {
            "usuario_id": usuario_id,
            "_id": usuario_id,
            "matricula": "123456",
            "departamento": "Liga da Justica",
            "cargo": "assistente do Batima",
            "status": "ATIVO"
        }
        class FakeModel {
            constructor() {
                this.colaboradores = [colaborador]
                this._id = instituicaoId
            }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }

        const usuario = await colaboradorUsecase
            .deletar(new FakeModel(), usuario_id)

        expect(usuario).toEqual(null);
    });

    test('deve obter um colaborador por id', async () => {
        const instituicaoId = "12345"
        const usuario_id = "1234"
        const colaborador = {
            "usuario_id": usuario_id,
            "_id": usuario_id,
            "matricula": "123456",
            "departamento": "Liga da Justica",
            "cargo": "assistente do Batima",
            "status": "ATIVO",
            "foto" : "emalgumlugardaweb.png"
        }
        class FakeModel {
            constructor() {
                this.colaboradores = [colaborador]
                this._id = instituicaoId
            }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        class FakeUsuarioFacade {
            static obterPorId() { 
                return colaborador
            }
        }       

        const usuarioEsperado = {
            "usuario_id": usuario_id,
            "_id": usuario_id,
            "matricula": "123456",
            "departamento": "Liga da Justica",
            "cargo": "assistente do Batima",
            "status": "ATIVO",
            "foto" : "emalgumlugardaweb.png"
        }

        const usuario = await colaboradorUsecase
            .obterPorId(new FakeModel(), usuario_id, FakeUsuarioFacade)

        expect(usuario).toEqual(usuarioEsperado);
    })  

    test('deve deletar todos os colaboradores', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() {
                this.colaboradores = colaboradoresMock;
                this._id = instituicaoId
            }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }

        const usuario = await colaboradorUsecase
            .deletarTodos(new FakeModel())

        expect(usuario).toEqual(null);
    });


    test('devo obter todos', async () => {
        const instituicaoId = "12345"
        const liderancaId = "12345"
        class FakeModel {
            constructor() {
                this.colaboradores = colaboradoresMock,
                this._id = instituicaoId
            }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        class FakeUsuarioFacade {
            static obterPorId(id) { 
                return new FakeModel().colaboradores.find(u => u._id == id)
            }
        }

        const response = {
            exibindo: `3 de 3`,
            total_de_paginas: 1,
            total_de_colaboradores: 3,  
            paginaAtual: 1,
            colaboradores: new FakeModel().colaboradores
        }
        const colaboradores = await colaboradorUsecase.todos(new FakeModel(), {}, FakeUsuarioFacade)

        expect(colaboradores).toEqual(JSON.parse(JSON.stringify(response)))
    });

    test('devo obter 1 passando paginacao e limite', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.colaboradores = colaboradoresMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        class FakeUsuarioFacade {
            static obterPorId(id) { 
                return new FakeModel().colaboradores.find(u => u._id == id)
            }
        }

        const consultaRequest = {
            pagina: 1,
            limite: 1,
        }
        const response = {
            exibindo: `1 de 3`,
            total_de_paginas: 3,
            total_de_colaboradores: 1,
            paginaAtual: 1,
            colaboradores: [new FakeModel().colaboradores[0]]
        }
        const colaboradores = await colaboradorUsecase
            .todos(new FakeModel(), consultaRequest, FakeUsuarioFacade)

        expect(colaboradores).toEqual(JSON.parse(JSON.stringify(response)))
    });

    test('devo obter 2 passando pelo departamento usando regex', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.colaboradores = colaboradoresMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        class FakeUsuarioFacade {
            static obterPorId(id) { 
                return new FakeModel().colaboradores.find(u => u._id == id)
            }
        }
        const consultaRequest = {
            pagina: 1,
            limite: 10,
            departamento: "liga"
        }
        const response = {
            exibindo: `2 de 2`,
            total_de_paginas: 1,
            total_de_colaboradores: 2,
            paginaAtual: 1,
            colaboradores: new FakeModel().colaboradores.slice(0, 2)
        }
        const colaboradores = await colaboradorUsecase
            .todos(new FakeModel(), consultaRequest, FakeUsuarioFacade)

        expect(colaboradores).toEqual(JSON.parse(JSON.stringify(response)))
    });

    test('devo obter 1 passando pela matricula sem regex', async () => {
        const instituicaoId = "12345"
        const liderancaId = "12345"
        class FakeModel {
            constructor() { this.colaboradores = colaboradoresMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        class FakeUsuarioFacade {
            static obterPorId(id) { 
                return new FakeModel().colaboradores.find(u => u._id == id)
            }
        }

        const consultaRequest = {
            pagina: 1,
            limite: 10,
            matricula: "123456"
        }
        const response = {
            exibindo: `1 de 1`,
            total_de_paginas: 1,
            total_de_colaboradores: 1,
            paginaAtual: 1,
            colaboradores: [colaboradoresMock[1]]
        }
        const colaboradores = await colaboradorUsecase
            .todos(new FakeModel(), consultaRequest, FakeUsuarioFacade)

        expect(colaboradores).toEqual(JSON.parse(JSON.stringify(response)))
    });

    describe('Erros', () => {
        test('devo obter um erro - passando uma query que nao existe', async () => {
            const instituicaoId = "12345"
            const liderancaId = "12345"
            class FakeModel {
                constructor() { this.colaboradores = colaboradoresMock, this._id = instituicaoId }
                async save() {
                    return this
                }
                static findById() {
                    return new this()
                }
            }
            class FakeUsuarioFacade {
                static obterPorId(id) { 
                    return new FakeModel().colaboradores.find(u => u._id == id)
                }
            }

            const consultaRequest = {
                pagina: 1,
                limite: 10,
                bairro: "Pavuna"
            }

            try {
                await colaboradorUsecase
                    .todos(new FakeModel(), consultaRequest, FakeUsuarioFacade)

            } catch (error) {
                expect(error.message).toEqual("Nenhum resutlado encontrado para a query");
            }
        });

        test('devo obter um erro - passando uma pagina que nao possui colaboradores', async () => {
            const instituicaoId = "12345"
            const liderancaId = "12345"
            class FakeModel {
                constructor() { this.colaboradores = colaboradoresMock, this._id = instituicaoId }
                async save() {
                    return this
                }
                static findById() {
                    return new this()
                }
            }
            class FakeUsuarioFacade {
                static obterPorId(id) { 
                    return new FakeModel().colaboradores.find(u => u._id == id)
                }
            }
            const consultaRequest = {
                pagina: 10,
                limite: 10,
                bairro: "Pavuna"
            }

            try {
                await colaboradorUsecase
                    .todos(new FakeModel(), consultaRequest, FakeUsuarioFacade)

            } catch (error) {
                expect(error.detalhes).toEqual("Nenhum resultado encontrado para a pagina");
            }
        });
    });
});


const colaboradoresMock = [
    {
        "usuario_id": "123",
        "_id": "123",
        "matricula": "123457",
        "departamento": "Liga da Justica",
        "cargo": "assistente do Batima",
        "status": "ATIVO"
    },
    {
        "usuario_id": "124",
        "_id": "124",
        "matricula": "123456",
        "departamento": "Liga da Justica",
        "cargo": "assistente do Batima",
        "status": "ATIVO"
    },
    {
        "usuario_id": "125",
        "_id": "125",
        "matricula": "22345",
        "departamento": "x-men",
        "cargo": "vilao",
        "status": "ATIVO"
    }
]