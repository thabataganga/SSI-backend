const noticiaUsecase = require("../InstituicaoNoticiasCrudUsecase")

describe('Instituicao - NOTICIAS', () => {
    test('deve criar uma noticia', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.noticias = [], this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }
        const novaNoticia = {
            titulo: "Anunciado o Quinto imperador do mar",
            subtitulo: "Luffy seria o candidato mais forte a ser tornar o proximo rei dos piratas?",
            imagem: "eupoderiacolocarumaurlvalidamaspqnao.png",
            texto: "luffy é o rei dos piratas e é sobre isso",
            status: true,
            autor_id: "12345",
            _id: "1234"
        }

        const noticia = await noticiaUsecase
            .criar(new FakeModel(), novaNoticia)

        expect(noticia).toEqual(novaNoticia);
    });

    test('deve atualizar um noticia', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() {
                this.noticias = [
                    {
                        titulo: "Anunciado o Quinto imperador do mar",
                        subtitulo: "Luffy seria o candidato mais forte a ser tornar o proximo rei dos piratas?",
                        imagem: "eupoderiacolocarumaurlvalidamaspqnao.png",
                        texto: "luffy é o rei dos piratas e é sobre isso",
                        status: true,
                        autor_id: "12345",
                        _id: "1234"
                    }
                ], this._id = instituicaoId
            }
            async save() {
                this.noticias.map(a => a._id = "1234")
                return this
            }
            static findById() {
                return new this()
            }
        }
        const noticiaAtualizada = {
            titulo: "Decretado o novo imperador",
            subtitulo: "Novo imperador mais novo",
            imagem: "eupoderiacolocarumaurlvalidamaspqnao.png",
            texto: "luffy é o rei dos piratas.",
            status: true,
            autor_id: "12345",
            _id: "1234"
        }

        const noticia = await noticiaUsecase
            .atualizar(new FakeModel(), "1234", noticiaAtualizada)

        expect(noticiaAtualizada).toEqual(noticia);
    });

    test('deve deletar um noticia', async () => {
        const instituicaoId = "12345"
        const noticiaId = "1234"
        class FakeModel {
            constructor() {
                this.noticias = [
                    {
                        titulo: "Anunciado o Quinto imperador do mar",
                        subtitulo: "Luffy seria o candidato mais forte a ser tornar o proximo rei dos piratas?",
                        imagem: "eupoderiacolocarumaurlvalidamaspqnao.png",
                        texto: "luffy é o rei dos piratas e é sobre isso",
                        status: true,
                        autor_id: "12345",
                        _id: "1234"
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

        const noticia = await noticiaUsecase
            .deletar(new FakeModel(), noticiaId)

        expect(noticia).toEqual(null);
    });

    test('deve deletar todos os noticias', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.noticias = noticiasMock; this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }

        const noticia = await noticiaUsecase
            .deletarTodos(new FakeModel())

        expect(noticia).toEqual(null);
    });


    test('devo obter todos', async () => {
        const instituicaoId = "12345"
        const noticiaId = "12345"
        class FakeModel {
            constructor() { this.noticias = noticiasMock, this._id = instituicaoId }
            async save() {
                return this
            }
            static findById() {
                return new this()
            }
        }

        const response = {
            exibindo: `4 de 4`,
            total_de_paginas: 1,
            total_de_noticias: 4,
            paginaAtual: 1,
            noticias: new FakeModel().noticias
        }
        const noticias = await noticiaUsecase.todos(new FakeModel(), {})

        expect(noticias).toEqual(JSON.parse(JSON.stringify(response)))
    });

    test('devo obter 1 passando paginacao e limite', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.noticias = noticiasMock, this._id = instituicaoId }
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
            exibindo: `1 de 4`,
            total_de_paginas: 4,
            total_de_noticias: 1,
            paginaAtual: 1,
            noticias: [new FakeModel().noticias[0]]
        }
        const noticias = await noticiaUsecase
            .todos(new FakeModel(), consultaRequest)

        expect(noticias).toEqual(JSON.parse(JSON.stringify(response)))
    });

    test('devo obter 2 passando pelo texto usando regex', async () => {
        const instituicaoId = "12345"
        class FakeModel {
            constructor() { this.noticias = noticiasMock, this._id = instituicaoId }
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
            texto: "rei"
        }
        const response = {
            exibindo: `2 de 2`,
            total_de_paginas: 1,
            total_de_noticias: 2,
            paginaAtual: 1,
            noticias: new FakeModel().noticias.slice(0, 2)
        }
        const noticias = await noticiaUsecase
            .todos(new FakeModel(), consultaRequest)

        expect(noticias).toEqual(JSON.parse(JSON.stringify(response)))
    });

    test('devo obter 4 passando pelo subtitulo', async () => {
        const instituicaoId = "12345"
        const noticiaId = "12345"
        class FakeModel {
            constructor() { this.noticias = noticiasMock, this._id = instituicaoId }
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
            subtitulo: "e"
        }
        const response = {
            exibindo: `4 de 4`,
            total_de_paginas: 1,
            total_de_noticias: 4,
            paginaAtual: 1,
            noticias: noticiasMock
        }
        const noticias = await noticiaUsecase
            .todos(new FakeModel(), consultaRequest)

        expect(noticias).toEqual(JSON.parse(JSON.stringify(response)))
    });

    describe('Erros', () => {
        test('devo obter um erro - passando uma query que nao existe', async () => {
            const instituicaoId = "12345"
            const noticiaId = "12345"
            class FakeModel {
                constructor() { this.noticias = noticiasMock, this._id = instituicaoId }
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
                await noticiaUsecase
                    .todos(new FakeModel(), consultaRequest)

            } catch (error) {
                expect(error.message).toEqual("Nenhum resutlado encontrado para a query");
            }
        });

        test('devo obter um erro - passando uma pagina que nao possui noticias', async () => {
            const instituicaoId = "12345"
            const noticiaId = "12345"
            class FakeModel {
                constructor() { this.noticias = noticiasMock, this._id = instituicaoId }
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
                await noticiaUsecase
                    .todos(new FakeModel(), consultaRequest)

            } catch (error) {
                expect(error.detalhes).toEqual("Nenhum resultado encontrado para a pagina");
            }
        });
    });
});


const noticiasMock = [
    {
        titulo: "Anunciado o Quinto imperador do mar",
        subtitulo: "Luffy seria o candidato mais forte a ser tornar o proximo rei dos piratas?",
        imagem: "eupoderiacolocarumaurlvalidamaspqnao.png",
        texto: "luffy é o rei dos piratas e é sobre isso",
        status: true,
        autor_id: "12345",
        _id: "1234"
    },
    {
        titulo: "Chooper o futuro melhor medico e mais fofinho",
        subtitulo: "Chopper seria o unico mugawara com recompensa inferior a 1500?",
        imagem: "eupoderiacolocarumaurlvalidamaspqnao.png",
        texto: "Medico dos reis dos piratas",
        status: true,
        autor_id: "12345",
        _id: "1235"
    },
    {
        titulo: "Zoro perdido como sempre",
        subtitulo: "No especial de 20 anos de dragonball, zoro tava solando o sulong",
        imagem: "eupoderiacolocarumaurlvalidamaspqnao.png",
        texto: "Zoro mata sulong pensando que era o Kaidou",
        status: true,
        autor_id: "12345",
        _id: "1236"
    },
    {
        titulo: "Realmente precisa?",
        subtitulo: "Sanji melhor cozinheiro do mundo",
        imagem: "eupoderiacolocarumaurlvalidamaspqnao.png",
        texto: "Zoro e sandy s2",
        status: true,
        autor_id: "12345",
        _id: "1237"
    }
]