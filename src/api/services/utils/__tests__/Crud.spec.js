const { LoginCrud, NestedCollection } = require("../Crud")
const bcrypt = require("bcrypt")
const moogose = require("mongoose")

class fakeEvent {
    static emit() {

    }

    static on() {

    }
}

describe('BaseCrud CRUD', () => {
    test('deve adicionar um objeto', async () => {
        class FakeDb {
            async save() { return this.obj }
            constructor(obj) { this.obj = obj }
        }
        const pessoa = {
            nome: "mamonas assasinas",
            _id: moogose.Types.ObjectId()
        }
        const crud = new LoginCrud("teste")

        const result = await crud.criar(FakeDb, pessoa, fakeEvent)

        expect(result).toEqual(pessoa)
    });

    test('deve atualizar um objeto', async () => {
        const _id = moogose.Types.ObjectId()
        const pessoa = {
            nome: "imagine Dragons",
            _id
        }
        const pessoaAtualizada = {
            nome: "Ludimila",
            _id
        }
        const crud = new LoginCrud("teste")
        const fakeDb = { findByIdAndUpdate: () => pessoaAtualizada }

        const result = await crud.atualizar(fakeDb, pessoaAtualizada, pessoa, fakeEvent)

        expect(result).toEqual(pessoaAtualizada)
    });

    test('deve deletar um objeto', async () => {
        const crud = new LoginCrud("teste")
        const fakeEntity = { delete: () => null }

        const result = await crud.deletar(null, fakeEntity, fakeEvent)

        expect(result).toEqual({ "message": "registro teste deletado com sucesso!" })
    });


    test('deve encontrar por id', async () => {
        const crud = new LoginCrud("teste")
        const OiOiOi = {
            "cantor": "Latino",
            "_id": "1234"
        }
        const fakeDb = { findById: () => OiOiOi }

        const result = await crud.obterPorId(fakeDb, "1234")

        expect(result).toEqual(OiOiOi)
    });


    test('deve encontrar por email', async () => {
        const crud = new LoginCrud("teste")
        const PonteParaCa = {
            "_id": "1234",
            "email": "racionais@email.com"
        }
        const fakeDb = { findOne: () => PonteParaCa }

        const result = await crud.obterPorEmail(fakeDb, "1234")

        expect(result).toEqual(PonteParaCa)
    });

    test('deve encontrar por filtro', async () => {
        const crud = new LoginCrud("teste")
        const filtro = {
            "_id": "1234",
            "email": "racionais@email.com"
        }
        const fakeDb = { findOne: () => filtro }

        const result = await crud.obterPorFiltro(fakeDb, filtro)

        expect(result).toEqual(filtro)
    });

    test('o usuario deve logar', async () => {
        const crud = new LoginCrud("teste")
        const hashSenha = bcrypt.hashSync("12345", 10)
        const fakeJwt = {
            generate() { return "eyToken" },
            decode: () => ({
                payload: { exp: "11223344" },
                header: { typ: "Jwt" }
            })
        }
        const SorrisoMaroto = {
            "futuroPrometido": "Me olha nos olhos e diz....",
            "senha": hashSenha,
            "email": "email@emai.com",
            "_id": "12345"
        }
        const { email } = SorrisoMaroto
        const fakeDb = {
            findOne: () => SorrisoMaroto
        }
        const payloadEsperado = {
            "acessType": "teste",
            "expiresAt": "11223344",
            "token": "eyToken",
            "token_prefix": "Baerer",
            "type": "Jwt",
        }

        const payload = await crud.entrar(fakeDb, fakeJwt, email, "12345")

        delete payload.generate
        expect(payload).toEqual(payloadEsperado)
    })



    describe('Erros', () => {

        test('deve dar um erro quando não encontra um recurso', async () => {
            const crud = new LoginCrud("teste")
            const fakeDb = {
                findById: () => null
            }

            try {
                await crud.obterPorId(fakeDb, null, fakeEvent)
            } catch (error) {
                expect(error.detalhes).toBe("Nenhum resultado encontrado para o id null")
                expect(error.status).toBe(400)
            }
        });


        test('deve dar error atualizar um objeto', async () => {
            const _id = moogose.Types.ObjectId()
            const pessoa = {
                nome: "Xote de Alegria",
                _id
            }
            const pessoaAtualizada = {
                nome: null,
                _id
            }
            const crud = new LoginCrud("teste")
            const fakeDb = { findByIdAndUpdate: () => { throw "" } }

            try {
                await crud.atualizar(fakeDb, pessoaAtualizada, pessoa, fakeEvent)
            } catch (error) {
                expect(error.detalhes).toBe("Não foi possivel atualizar")
                expect(error.status).toBe(400)
            }
        });

        
        test('deve dar error quando não encontrar por filtro', async () => {
            const crud = new LoginCrud("teste")
            const filtro = {
                "_id": "1234",
                "email": "racionais@email.com"
            }
            const fakeDb = { findOne: () => null }
    
            try {
                const result = await crud.obterPorFiltro(fakeDb, filtro)
            } catch (error) {
                expect(error.detalhes).toBe("Nenhum resultado encontrado para os parametros")
                expect(error.status).toBe(400)
            }
        });

        describe("Login erros", () => {

            test('deve dar erro quando o email for invalido', async () => {
                const crud = new LoginCrud("teste")
                const fakeJwt = { generate() { return "token" } }
                const fakeDb = { findOne: () => null }

                try {
                    await crud.entrar(fakeDb, fakeJwt, "email@email.com", "1234")
                } catch (error) {
                    expect(error.detalhes).toBe("Usuario ou senha invalida")
                    expect(error.status).toBe(404)
                }
            });

            test('deve dar erro quando a senha for invalida', async () => {
                const crud = new LoginCrud("teste")
                const hashSenha = bcrypt.hashSync("12345", 10)
                const fakeJwt = {  }
                const tempoPerdido = {
                    "futuroPrometido": "Me olha nos olhos e diz....",
                    "senha": hashSenha,
                    "email": "email@emai.com",
                    "_id": "12345"
                }
                const { email } = tempoPerdido
                const fakeDb = {
                    findOne: () => tempoPerdido
                }

                try {
                    await crud.entrar(fakeDb, fakeJwt, email, "1234")
                } catch (error) {
                    expect(error.detalhes).toBe("Usuario ou senha invalida")
                    expect(error.status).toBe(404)
                }
            });
        })
    });


})

