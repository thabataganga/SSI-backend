const INSTITUICAO_ASSINATURA = "5127062e-6f19-4432-96f7-5ea4fe45fd51"
const handle = require("../instituicaoPermissao")({
    obterUsuarioAdmin: async (usuario) => usuario 
})

describe('RABC -  Autorização das instituicoes', () => {
    describe('acesso', () => {

        test('deve receber autorização como master', () => {
            const client = {
                id: "123"
            }
            const method = "POST"
            const roles = {
                assinatura: INSTITUICAO_ASSINATURA
            }
            const params = {
                id: "123",
            }
            const PATH = "/instituicao/123"

            const request = simularRequest({ client, roles, params }, method, PATH)

            expect(request.locals.access).toBe("INSTITUICAO")
        });

        test('deve receber autorização como admin', async () => {
            const client = {
                id: "32132321",
                instituicaoId: "12345"
            }
            const method = "POST"
            const roles = {
                assinatura: INSTITUICAO_ASSINATURA
            }
            const params = {
                id: "123",
            }
            const PATH = "/instituicao/123"

            const request = await simularRequestAsync({ client, roles, params }, method, PATH)

            expect(request.locals.access).toBe("INSTITUICAO_ADMIN")
        });

    });

    describe('acesso admin', () => {

        test('deve receber autorização como idook', () => {
            const client = {
                id: "123"
            }
            const method = "POST"
            const roles = {
                assinatura: INSTITUICAO_ASSINATURA
            }
            const params = {
                id: "123",
            }
            const PATH = "/usuario/123"
            const access = "IDOOK"

            const request = simularRequest({ client, roles, params, access }, method, PATH)

            expect(request.locals.access).toBe(access)
        });

    });

    describe('não autorizado!', () => {
        test('Não deve receber autorizacao', () => {
            const client = {
                id: "123"
            }
            const method = "POST"
            const roles = {
                assinatura: null
            }
            const params = {
                id: "123",
            }
            const PATH = "/usuario/123"

            const request = simularRequest({ client, roles, params }, method, PATH)

            expect(request.locals.access).toBe(null)
        })
    })
});

const simularRequest = (
    { client, roles, params, access = null },
    method, path, next = () => null
) => {
    const request = {
        locals: { client, roles, access },
        params,
        method,
        path
    }

    handle(request, null, next)
    return request
}

const simularRequestAsync = async (
    { client, roles, params, access = null },
    method, path, next = () => null
) => {
    const request = {
        locals: { client, roles, access },
        params,
        method,
        path
    }

    await handle(request, null, next)
    return request
}