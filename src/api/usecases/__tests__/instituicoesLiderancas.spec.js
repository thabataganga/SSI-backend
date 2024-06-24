const liderancaUsecase = require("../InstituicaoLiderancasCrud")

describe('Instituicao - LIDERENCAS', () => {
    test('deve criar uma lideranca', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.liderancas = [], this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        const novoLideranca = {
            "nome": "Luffy",
            "titulo": "Rei dos Piratas",
            "_id": "1234"
        }

        const lideranca = await liderancaUsecase
            .criar(new FakeModel(), novoLideranca)

        expect(lideranca).toEqual(novoLideranca);
    });

    test('deve atualizar um lideranca', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() {
                this.liderancas = [
                    {
                        "nome": "Luffy",
                        "titulo": "Homen de Borracha",
                        "_id": "1234"
                    }
                ], this._id = instituicaoId
            }
            async save() {
                this.liderancas.map(a => a._id = "1234")
                return this
            }
            static findById() {
                return new this()
            }
        }
        const liderancaAtualizado = {
            "nome": "Luffy",
            "titulo": "Rei dos Piratas",
            "_id": "1234"
        }

        const lideranca = await liderancaUsecase
            .atualizar(new FakeModel(), "1234", liderancaAtualizado)

        expect(liderancaAtualizado).toEqual(lideranca);
    });

    test('deve deletar um lideranca', async () => {
        const instituicaoId = "12345"
        const liderancaId = "1234"
        class FakeModel {
            constructor() {
                this.liderancas = [
                    {
                        "nome": "Luffy",
                        "titulo": "Rei dos Piratas",
                        "_id": "1234"
                    }
                ], this._id = instituicaoId
            }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }

        const lideranca = await liderancaUsecase
            .deletar(new FakeModel(), liderancaId)

        expect(lideranca).toEqual(null);
    });

    test('deve deletar todos os liderancas', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.liderancas = liderancasMock; this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }

        const lideranca = await liderancaUsecase
            .deletarTodos(new FakeModel())

        expect(lideranca).toEqual(null);
    });


    test('devo obter todos', async () => {
        const instituicaoId = "12345"
        const liderancaId = "12345"
        class FakeModel {
            constructor() { this.liderancas = liderancasMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }

        const response = {
            exibindo: `6 de 6`,
            total_de_paginas: 1,
            total_de_liderancas: 6,
            paginaAtual: 1,
            liderancas: new FakeModel().liderancas
        }
        const liderancas = await liderancaUsecase.todos(new FakeModel(), {})

        expect(liderancas).toEqual(JSON.parse(JSON.stringify(response)))
    });

    test('devo obter 1 passando paginacao e limite', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.liderancas = liderancasMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        const consultaRequest = {
            pagina: 1,
            limite: 1,
        }
        const response = {
            exibindo: `1 de 6`,
            total_de_paginas: 6,
            total_de_liderancas: 1,
            paginaAtual: 1,
            liderancas: [new FakeModel().liderancas[0]]
        }
        const liderancas = await liderancaUsecase
            .todos(new FakeModel(), consultaRequest)

        expect(liderancas).toEqual(JSON.parse(JSON.stringify(response)))
    });

    test('devo obter 2 passando pelo nome usando regex', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.liderancas = liderancasMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        const consultaRequest = {
            pagina: 1,
            limite: 10,
            nome: "lu"
        }
        const response = {
            exibindo: `2 de 2`,
            total_de_paginas: 1,
            total_de_liderancas: 2,
            paginaAtual: 1,
            liderancas: new FakeModel().liderancas.slice(0, 2)
        }
        const liderancas = await liderancaUsecase
            .todos(new FakeModel(), consultaRequest)

        expect(liderancas).toEqual(JSON.parse(JSON.stringify(response)))
    });

    test('devo obter 2 passando pelo titulo sem regex', async () => {
        const instituicaoId = "12345"
        const liderancaId = "12345"
        class FakeModel {
            constructor() { this.liderancas = liderancasMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        const consultaRequest = {
            pagina: 1,
            limite: 10,
            titulo: "Rei dos Piratas"
        }
        const response = {
            exibindo: `2 de 2`,
            total_de_paginas: 1,
            total_de_liderancas: 2,
            paginaAtual: 1,
            liderancas: liderancasMock.filter(l => l.titulo=="Rei dos Piratas")
        }
        const liderancas = await liderancaUsecase
            .todos(new FakeModel(), consultaRequest)

        expect(liderancas).toEqual(JSON.parse(JSON.stringify(response)))
    });

    describe('Erros', () => {
        test('devo obter um erro - passando uma query que nao existe', async () => {
            const instituicaoId = "12345"
            const liderancaId = "12345"
            class FakeModel {
                constructor() { this.liderancas = liderancasMock, this._id = instituicaoId }
                async save() {
                    return this
                }
                static findById() {
                    return new this()
                }
            }
            const consultaRequest = {
                pagina: 1,
                limite: 10,
                bairro: "Pavuna"
            }

            try {
                await liderancaUsecase
                    .todos(new FakeModel(), consultaRequest)

            } catch (error) {
                expect(error.message).toEqual("Nenhum resutlado encontrado para a query");
            }
        });

        test('devo obter um erro - passando uma pagina que nao possui liderancas', async () => {
            const instituicaoId = "12345"
            const liderancaId = "12345"
            class FakeModel {
                constructor() { this.liderancas = liderancasMock, this._id = instituicaoId }
                async save() {
                    return this
                }
                static findById() {
                    return new this()
                }
            }
            const consultaRequest = {
                pagina: 10,
                limite: 10,
                bairro: "Pavuna"
            }

            try {
                await liderancaUsecase
                    .todos(new FakeModel(), consultaRequest)

            } catch (error) {
                expect(error.detalhes).toEqual("Nenhum resultado encontrado para a pagina");
            }
        });
    });
});


const liderancasMock = [
    {
        "nome": "Luffy",
        "titulo": "Rei dos Piratas",
        "_id" : "1234"
    },
    {
        "nome": "Luffy",
        "titulo": "Homen Borracha",
        "_id" : "1234"
    },
    {
        "nome": "Dragon",
        "titulo": "Revolucionario",
        "_id" : "1234"
    },
    {
        "nome": "Zoro",
        "titulo": "Caçador de Piratas",
        "_id" : "1234"
    },
    {
        "nome": "Roger",
        "titulo": "Rei dos Piratas",
        "_id" : "1234"
    },
    {
        "nome": "Garp",
        "titulo": "Heroi da Marinha",
        "_id" : "1234"
    }
]