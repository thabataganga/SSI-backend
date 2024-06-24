const associadoUsecase = require("../InstituicaoMembrosUsecase")

describe('Instituicao - Associados(membros)', () => {
    test('deve criar um associado', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() {
                this.associados = []
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
            "area_de_atuacao": "Liga da Justica",
            "local_de_trabalho": "Liga da Justica",
            "cargo": "assistente do Batima",
            "status": "ATIVO"
        }

        const usuario = await associadoUsecase
            .criar(new FakeModel(), novoColaborador, FakeModel)

        expect(usuario).toEqual(novoColaborador);
    });

    test('deve atualizar um associado', async () => {
        const instituicaoId = "12345"
        const usuario_id = "1234"
        const associado = {
            "usuario_id": usuario_id,
            "_id": usuario_id,
            "matricula": "123456",
            "area_de_atuacao": "Liga da Justica",
            "local_de_trabalho": "Liga da Justica",
            "cargo": "assistente do Batima",
            "status": "ATIVO"
        }

        class FakeModel {
            constructor() {
                this.associados = [associado]
                this._id = instituicaoId
            }
            async save() {
                this.associados.map(a => a._id = "1234")
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
            "area_de_atuacao": "Liga da Justica",
            "local_de_trabalho": "Liga da Justica",
            "cargo": "assistente do Flash",
            "status": "ATIVO"
        }

        const usuario = await associadoUsecase
            .atualizar(new FakeModel(), usuario_id, usuarioAtualizado)

        expect(usuarioAtualizado).toEqual(usuario);
    });

    test('deve deletar um associado', async () => {
        const instituicaoId = "12345"
        const usuario_id = "1234"
        const associado = {
            "usuario_id": usuario_id,
            "_id": usuario_id,
            "matricula": "123456",
            "area_de_atuacao": "Liga da Justica",
            "local_de_trabalho": "Liga da Justica",
            "cargo": "assistente do Batima",
            "status": "ATIVO"
        }
        class FakeModel {
            constructor() {
                this.associados = [associado]
                this._id = instituicaoId
            }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }

        const usuario = await associadoUsecase
            .deletar(new FakeModel(), usuario_id)

        expect(usuario).toEqual(null);
    });

    test('deve deletar todos os associados', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() {
                this.associados = associadosMock;
                this._id = instituicaoId
            }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }

        const usuario = await associadoUsecase
            .deletarTodos(new FakeModel())

        expect(usuario).toEqual(null);
    });

    test('deve obter um associado por id', async () => {
        const instituicaoId = "12345"
        const usuario_id = "1234"
        const associado = {
            "usuario_id": usuario_id,
            "_id": usuario_id,
            "matricula": "123456",
            "area_de_atuacao": "Liga da Justica",
            "local_de_trabalho": "Liga da Justica",
            "cargo": "assistente do Batima",
            "status": "ATIVO",
            "foto" : "asdasd.png"
        }
        class FakeModel {
            constructor() {
                this.associados = [associado]
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
                return associado
            }
        }
        const associadoEsperado = {
            "usuario_id": usuario_id,
            "_id": usuario_id,
            "matricula": "123456",
            "area_de_atuacao": "Liga da Justica",
            "local_de_trabalho": "Liga da Justica",
            "cargo": "assistente do Batima",
            "status": "ATIVO",
            "foto" : "asdasd.png"
        }

        const usuario = await associadoUsecase
            .obterPorId(new FakeModel(), usuario_id, FakeUsuarioFacade)

        expect(usuario).toEqual(associadoEsperado);
    });

    test('devo obter todos', async () => {
        const instituicaoId = "12345"
        const liderancaId = "12345"
        class FakeModel {
            constructor() {
                this.associados = associadosMock,
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
                return new FakeModel().associados.find(u => u._id == id)
            }
        }
        const response = {
            exibindo: `3 de 3`,
            total_de_paginas: 1,
            total_de_associados: 3,
            paginaAtual: 1,
            associados: new FakeModel().associados
        }
        const associados = await associadoUsecase.todos(new FakeModel(), {}, FakeUsuarioFacade)

        expect(JSON.parse(JSON.stringify(associados))).toEqual(JSON.parse(JSON.stringify(response)))
    });

    test('devo obter 1 passando paginacao e limite', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.associados = associadosMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        class FakeUsuarioFacade {
            static obterPorId(id) { 
                return new FakeModel().associados.find(u => u._id == id)
            }
        }
        const consultaRequest = {
            pagina: 1,
            limite: 1,
        }
        const response = {
            exibindo: `1 de 3`,
            total_de_paginas: 3,
            total_de_associados: 1,
            paginaAtual: 1,
            associados: [new FakeModel().associados[0]]
        }
        const associados = await associadoUsecase
            .todos(new FakeModel(), consultaRequest, FakeUsuarioFacade)

        expect(JSON.parse(JSON.stringify(associados))).toEqual(response)
    });

    test('devo obter 2 passando pelo area_de_atuacao usando regex', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.associados = associadosMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        class FakeUsuarioFacade {
            static obterPorId(id) { 
                return new FakeModel().associados.find(u => u._id == id)
            }
        }
        const consultaRequest = {
            pagina: 1,
            limite: 10,
            area_de_atuacao: "liga"
        }
        const response = {
            exibindo: `2 de 2`,
            total_de_paginas: 1,
            total_de_associados: 2,
            paginaAtual: 1,
            associados: new FakeModel().associados.slice(0, 2)
        }
        const associados = await associadoUsecase
            .todos(new FakeModel(), consultaRequest, FakeUsuarioFacade)

        expect(JSON.parse(JSON.stringify(associados))).toEqual(response)
    });

    test('devo obter 2 passando por doacao sem regex', async () => {
        const instituicaoId = "12345"
        const liderancaId = "12345"
        class FakeModel {
            constructor() { this.associados = associadosMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        class FakeUsuarioFacade {
            static obterPorId(id) { 
                return new FakeModel().associados.find(u => u._id == id)
            }
        }
        const consultaRequest = {
            pagina: 1,
            limite: 10,
            doacao: true
        }
        const response = {
            exibindo: `2 de 2`,
            total_de_paginas: 1,
            total_de_associados: 2,
            paginaAtual: 1,
            associados: associadosMock.filter(a => a.doacao === true)
        }
        const associados = await associadoUsecase
            .todos(new FakeModel(), consultaRequest, FakeUsuarioFacade)

        expect(JSON.parse(JSON.stringify(associados))).toEqual(response)
    });

    test('devo obter 1 passando pelo local_de_atuacao e doacao', async () => {
        const instituicaoId = "12345"
        const liderancaId = "12345"
        class FakeModel {
            constructor() { this.associados = associadosMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        class FakeUsuarioFacade {
            static obterPorId(id) { 
                return new FakeModel().associados.find(u => u._id == id)
            }
        }
        const consultaRequest = {
            pagina: 1,
            limite: 10,
            doacao: true,
            local_de_trabalho : "instituto"
        }
        const response = {
            exibindo: `1 de 1`,
            total_de_paginas: 1,
            total_de_associados: 1,
            paginaAtual: 1,
            associados: associadosMock.filter(a => 
                a.doacao == true && a.local_de_trabalho == "instituto"
                )
        }
        const associados = await associadoUsecase
            .todos(new FakeModel(), consultaRequest, FakeUsuarioFacade)

        expect(JSON.parse(JSON.stringify(associados))).toEqual(response)
    });


    describe('Erros', () => {
        test('devo obter um erro - passando uma query que nao existe', async () => {
            const instituicaoId = "12345"
            const liderancaId = "12345"
            class FakeModel {
                constructor() { this.associados = associadosMock, this._id = instituicaoId }
                async save() {
                    return this
                }
                static findById() {
                    return new this()
                }
            }
            class FakeUsuarioFacade {
                static obterPorId(id) { 
                    return new FakeModel().associados.find(u => u._id == id)
                }
            }
            const consultaRequest = {
                pagina: 1,
                limite: 10,
                bairro: "Pavuna"
            }

            try {
                await associadoUsecase
                    .todos(new FakeModel(), consultaRequest, FakeUsuarioFacade)

            } catch (error) {
                expect(error.message).toEqual("Nenhum resutlado encontrado para a query");
            }
        });

        test('devo obter um erro - passando uma pagina que nao possui associados', async () => {
            const instituicaoId = "12345"
            const liderancaId = "12345"
            class FakeModel {
                constructor() { this.associados = associadosMock, this._id = instituicaoId }
                async save() {
                    return this
                }
                static findById() {
                    return new this()
                }
            }
            class FakeUsuarioFacade {
                static obterPorId(id) { 
                    return new FakeModel().associados.find(u => u._id == id)
                }
            }
            const consultaRequest = {
                pagina: 10,
                limite: 10,
                bairro: "Pavuna"
            }

            try {
                await associadoUsecase
                    .todos(new FakeModel(), consultaRequest, FakeUsuarioFacade)

            } catch (error) {
                expect(error.detalhes).toEqual("Nenhum resultado encontrado para a pagina");
            }
        });
    });
});


const associadosMock = [
    {
        "usuario_id": "123",
        "_id": "123",
        "matricula": "123457",
        "area_de_atuacao": "Liga da Justica",
        "cargo": "assistente do Batima",
        "local_de_trabalho": "Liga da Justica",
        "status": "ATIVO",
        "doacao" : true,
    },
    {
        "usuario_id": "124",
        "_id": "124",
        "matricula": "123456",
        "area_de_atuacao": "Liga da Justica",
        "cargo": "assistente do Batima",
        "local_de_trabalho": "Liga da Justica",
        "status": "ATIVO",
        "doacao" : false,
    },
    {
        "usuario_id": "125",
        "_id": "125",
        "matricula": "22345",
        "area_de_atuacao": "x-men",
        "local_de_trabalho": "instituto",
        "cargo": "vilao",
        "status": "ATIVO",
        "doacao" : true
    }
]