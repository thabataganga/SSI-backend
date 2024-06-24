const { NestedCollection } = require("../Crud")

describe('NestedCollection CRUD', () => {
    test('deve adicionar um objeto', () => {
        const pessoa = {
            nome: "jane",
            _id: "1235"
        }
        const model = {
            festaNoApe: [{
                nome: "beatriz",
                _id: "1234"
            }]
        }
        const collectionExpected = [
            {
                nome: "beatriz",
                _id: "1234"
            },
            pessoa
        ]

        const collection = NestedCollection.adicionar(model, "festaNoApe", pessoa)

        expect(collection.length).toEqual(2)
        expect(Array.isArray(collection)).toBe(true)
        expect(collection).toEqual(collectionExpected)
    });

    test('deve atualizar um objeto', () => {
        const pessoa = {
            nome: "jane",
            _id: "1234"
        }
        const model = {
            palpiteSambo: [{
                nome: "beatriz",
                _id: "1234"
            }]
        }
        const collectionExpected = [
            pessoa
        ]

        const collection = NestedCollection.atualizar(model, "palpiteSambo", "1234", pessoa)

        expect(collection.length).toEqual(1)
        expect(Array.isArray(collection)).toBe(true)
        expect(collection).toEqual(collectionExpected)
    });

    test('deve deletar um objeto', () => {
        const model = {
            bokaLouca: [{
                nome: "beatriz",
                _id: "1234"
            }]
        }
        const collectionExpected = []

        const collection = NestedCollection.remover(model, "bokaLouca", "1234")

        expect(collection.length).toEqual(0)
        expect(Array.isArray(collection)).toBe(true)
        expect(collection).toEqual(collectionExpected)
    });

    describe('Erros', () => {

        test('não deve adicionar um objeto com propriedade duplicada', () => {
            const pessoa = {
                nome: "beatriz",
                _id: "1235"
            }
            const model = {
                balaoMagico: [{
                    nome: "beatriz",
                    _id: "1234"
                }]
            }

            expect(Throw(() => {
                NestedCollection.adicionar(model, "balaoMagico", pessoa, "nome")
            })).toBe(true)
        });


        test('não deve adicionar um objeto quando não houver collection', () => {
            const pessoa = {
                nome: "beatriz",
                _id: "1235"
            }
            const model = {
                ilarieLarieEh: {
                    nome: "beatriz",
                    _id: "1234"
                }
            }

            expect(Throw(() => {
                NestedCollection.adicionar(model, "ilarieLarieEh", pessoa, "nome")
            })).toBe(true)
        });

        test('deve dar um erro quando não encontra um recurso', () => {
            const model = {
                tenteOutraVez: {
                    nome: "beatriz",
                    _id: "eu prefiro ser..."
                }
            }

            expect(Throw(() => {
                NestedCollection.obterPorId(model, "tenteOutraVez", "maluco beleza")
            })).toBe(true)
        });

    });


})


const Throw = (fn, expectedValue) => {
    try {
        fn()
    } catch (error) {
        if (!expectedValue) return true
        else return error.message || error == expectedValue
    }
}