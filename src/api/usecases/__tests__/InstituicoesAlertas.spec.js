const alertaUsecase = require("../InstituicaoAlertaCrudUsecase")

describe('Instituicao - ALERTAS', () => {
    test('deve criar uma alerta', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.alertas = [], this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        const novoAlerta = {
            "texto": "Olá pessoal",
            "autor_id": "12345",
            "destinatario": {
                "tipo_de_usuario": "COLABORADOR",
                "uf": "SP",
                "localidade": "RIO DE JANEIRO",
                "bairro": "Flamengo",
                "area_de_atuacao": "ti",
                "local_de_trabalho": "Escritorio XXX",
                "cargo": "Aux. Admistrativo",
                "genero": "feminino",
                "doacao": true
            }
        }

        const alerta = await alertaUsecase
            .criar(new FakeModel(), novoAlerta)
        
        expect(alerta).toEqual(novoAlerta);
    });

    test('deve atualizar um alerta', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.alertas = [
                {
                    "texto": "Olá pessoal",
                    "autor_id": "12345",
                    "_id" : "12345",
                    "destinatario": {
                        "tipo_de_usuario": "COLABORADOR",
                        "uf": "SP",
                        "localidade": "RIO DE JANEIRO",
                        "bairro": "Flamengo",
                        "area_de_atuacao": "ti",
                        "local_de_trabalho": "Escritorio XXX",
                        "cargo": "Aux. Admistrativo",
                        "genero": "feminino",
                        "doacao": true
                    }
                }
            ], this._id = instituicaoId }
            async save() {
                this.alertas.map(a => a._id = "12345")
                return this
            }
            static findById() {
                return new this()
            }
        }
        const alertaAtualizado = {
            "texto": "Olá pessoal",
            "autor_id": "12345",
            "_id" : "12345",
            "destinatario": {
                "tipo_de_usuario": "COLABORADOR",
                "uf": "SP",
                "localidade": "RIO DE JANEIRO",
                "bairro": "Flamengo",
                "area_de_atuacao": "ti",
                "local_de_trabalho": "Escritorio XXX",
                "cargo": "Aux. Admistrativo",
                "genero": "feminino",
                "doacao": true
            }
        }
    
        const alerta = await alertaUsecase
            .atualizar(new FakeModel(), "12345", alertaAtualizado)
        
        expect(alertaAtualizado).toEqual(alerta);
    });

    test('deve deletar um alerta', async () => {
        const instituicaoId = "12345"
        const alertaId = "12345"
        class FakeModel {
            constructor() { this.alertas = [
                {
                    "texto": "Olá pessoal",
                    "autor_id": "12345",
                    "_id" : alertaId,
                    "destinatario": {
                        "tipo_de_usuario": "COLABORADOR",
                        "uf": "SP",
                        "localidade": "RIO DE JANEIRO",
                        "bairro": "Flamengo",
                        "area_de_atuacao": "ti",
                        "local_de_trabalho": "Escritorio XXX",
                        "cargo": "Aux. Admistrativo",
                        "genero": "feminino",
                        "doacao": true
                    }
                }
            ], this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }

        const alerta = await alertaUsecase
            .deletar(new FakeModel(), alertaId)
        
        expect(alerta).toEqual(null);
    });

    test('deve deletar todos os alertas', async () => {
        const instituicaoId = "12345"
        const alertaId = "12345"
        class FakeModel {
            constructor() { this.alertas = alertasMock; this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }

        const alerta = await alertaUsecase
            .deletarTodos(new FakeModel(), alertaId)
        
        expect(alerta).toEqual(null);
    });


    test('devo obter todos', async () => {
        const instituicaoId = "12345"
        const alertaId = "12345"
        class FakeModel {
            constructor() { this.alertas = alertasMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }

        const response = {
                exibindo: `5 de 5`,
                total_de_paginas: 1,
                total_de_alertas: 5,
                paginaAtual: 1,
                alertas: new FakeModel().alertas
        }
        const alertas = await alertaUsecase.todos(new FakeModel(), {})
        
        expect(alertas).toEqual(JSON.parse(JSON.stringify(response)))
    });

    test('devo obter 1 passando paginacao e limite', async () => {
        const instituicaoId = "12345"
        const alertaId = "12345"
        class FakeModel {
            constructor() { this.alertas = alertasMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        const consultaRequest = {
            pagina : 1,
            limite: 1,
        }
        const response = {
                exibindo: `1 de 5`,
                total_de_paginas: 5,
                total_de_alertas: 1,
                paginaAtual: 1,
                alertas: [new FakeModel().alertas[0]]
        }
        const alertas = await alertaUsecase
            .todos(new FakeModel(), consultaRequest)
        
        expect(alertas).toEqual(JSON.parse(JSON.stringify(response)))
    });
    
    test('devo obter 4 passando pelo texto usando regex', async () => {
        const instituicaoId = "12345"
        const alertaId = "12345"
        class FakeModel {
            constructor() { this.alertas = alertasMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        const consultaRequest = {
            pagina : 1,
            limite: 10,
            texto: "ola"
        }
        const response = {
                exibindo: `4 de 4`,
                total_de_paginas: 1,
                total_de_alertas: 4,
                paginaAtual: 1,
                alertas: new FakeModel().alertas.slice(0, 4)
        }
        const alertas = await alertaUsecase
            .todos(new FakeModel(), consultaRequest)
        
        expect(alertas).toEqual(JSON.parse(JSON.stringify(response)))
    });

    test('devo obter 1 passando pelo texto usando regex no nested', async () => {
        const instituicaoId = "12345"
        const alertaId = "12345"
        class FakeModel {
            constructor() { this.alertas = alertasMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        const consultaRequest = {
            pagina : 1,
            limite: 10,
            bairro: "lib"
        }
        const response = {
                exibindo: `1 de 1`,
                total_de_paginas: 1,
                total_de_alertas: 1,
                paginaAtual: 1,
                alertas: [new FakeModel().alertas[4]]
        }
        const alertas = await alertaUsecase
            .todos(new FakeModel(), consultaRequest)
        
        expect(alertas).toEqual(JSON.parse(JSON.stringify(response)))
    });

    describe('Erros', () => {
        test('devo obter um erro - passando uma query que nao existe', async () => {
            const instituicaoId = "12345"
            const alertaId = "12345"
            class FakeModel {
                constructor() { this.alertas = alertasMock, this._id = instituicaoId }
                async save() {
                    return this
                }
                static findById() {
                    return new this()
                }
            }
            const consultaRequest = {
                pagina : 1,
                limite: 10,
                bairro: "Pavuna"
            }

            try {
                await alertaUsecase
                .todos(new FakeModel(), consultaRequest)
            
            } catch (error) {
                expect(error.message).toEqual("Nenhum resutlado encontrado para a query");
            }
        });
    
        test('devo obter um erro - passando uma pagina que nao possui alertas', async () => {
            const instituicaoId = "12345"
            const alertaId = "12345"
            class FakeModel {
                constructor() { this.alertas = alertasMock, this._id = instituicaoId }
                async save() {
                    return this
                }
                static findById() {
                    return new this()
                }
            }
            const consultaRequest = {
                pagina : 10,
                limite: 10,
                bairro: "Pavuna"
            }

            try {
                await alertaUsecase
                .todos(new FakeModel(), consultaRequest)
            
            } catch (error) {
                expect(error.detalhes).toEqual("Nenhum resultado encontrado para a pagina");
            }
        });
    });
});


const alertasMock = [
    {
        "texto": "Ola pessoal e hoje vamos de sambo",
        "autor_id": "62565635b2fc9da331d2bac8",
        "destinatario": {
            "tipo_de_usuario": "COLABORADOR",
            "uf": "SP",
            "localidade": "RIO DE JANEIRO",
            "bairro": "Flamengo",
            "area_de_atuacao": "ti",
            "local_de_trabalho": "Escritorio XXX",
            "cargo": "Aux. Admistrativo",
            "genero": "feminino",
            "doacao": true,
            "_id": "625c59079f988260a7a283e6"
        },
        "_id": "625c59079f988260a7a283e7",
        "updatedAt": "2022-04-17T18:15:51.069Z"
    },
    {
        "texto": "Ola pessoal e hoje vamos de exaltasamba",
        "autor_id": "62565635b2fc9da331d2bac8",
        "destinatario": {
            "tipo_de_usuario": "COLABORADOR",
            "uf": "RJ",
            "localidade": "RIO DE JANEIRO",
            "bairro": "Flamengo",
            "area_de_atuacao": "ti",
            "local_de_trabalho": "Escritorio XXX",
            "cargo": "Aux. Admistrativo",
            "genero": "feminino",
            "doacao": true,
            "_id": "625c59169f988260a7a28402"
        },
        "_id": "625c59169f988260a7a28403",
        "updatedAt": "2022-04-17T18:15:51.069Z"
    },
    {
        "texto": "Ola pessoal e hoje vamos de exaltasamba",
        "autor_id": "62565635b2fc9da331d2bac8",
        "destinatario": {
            "tipo_de_usuario": "AFILIADO",
            "uf": "RJ",
            "localidade": "RIO DE JANEIRO",
            "bairro": "Flamengo",
            "area_de_atuacao": "sei la",
            "local_de_trabalho": "Escritorio XXX",
            "cargo": "Aux. Admistrativo",
            "genero": "feminino",
            "doacao": true,
            "_id": "625c59289f988260a7a28423"
        },
        "_id": "625c59289f988260a7a28424",
        "updatedAt": "2022-04-17T18:15:51.069Z"
    },
    {
        "texto": "Ola pessoal e hoje vamos de exaltasamba",
        "autor_id": "62565635b2fc9da331d2bac8",
        "destinatario": {
            "tipo_de_usuario": "AFILIADO",
            "uf": "RJ",
            "localidade": "RIO DE JANEIRO",
            "bairro": "Flamengo",
            "area_de_atuacao": "sei la",
            "local_de_trabalho": "Escritorio XXX",
            "cargo": "Aux. Admistrativo",
            "genero": "masculino",
            "doacao": true,
            "_id": "625c59389f988260a7a28449"
        },
        "_id": "625c59389f988260a7a2844a",
        "updatedAt": "2022-04-17T18:15:51.069Z"
    },
    {
        "texto": "Oi oi oi",
        "autor_id": "62565635b2fc9da331d2bac8",
        "destinatario": {
            "tipo_de_usuario": "AFILIADO",
            "uf": "SP",
            "localidade": "RIO DE JANEIRO",
            "bairro": "Liberdade",
            "area_de_atuacao": "sei la",
            "local_de_trabalho": "Escritorio XXX",
            "cargo": "Aux. Admistrativo",
            "genero": "masculino",
            "doacao": true,
            "_id": "625c59579f988260a7a28474"
        },
        "_id": "625c59579f988260a7a28475",
        "updatedAt": "2022-04-17T18:15:51.069Z"
    }
]