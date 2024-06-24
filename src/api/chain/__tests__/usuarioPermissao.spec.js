const USUARIO_ASSINATURA = "519d56fe-f1a8-4a9f-942b-966bfcd31464"
const handle = require("../usuarioPermissao")

describe('RABC -  Autorização dos usuarios', () => {

    describe('convite', () => {

        test('deve receber autorização como convite instituicao ', () => {
            const client = {
                id: "123"
            }
            const method = "POST"
            const roles = {
                assinatura: USUARIO_ASSINATURA
            }
            const params = {
                usuario_id: "123",
                codigo: "1234"
            }
            const PATH = "/convite/" + params.codigo

            const request = simularRequest({ client, roles, params }, method, PATH)

            expect(request.locals.access).toBe("CONVITE_INTITUICAO")
        });

    });

    describe('acesso', () => {

        test('deve receber autorização como USUARIO', () => {
            const client = {
                id: "123"
            }
            const method = "POST"
            const roles = {
                assinatura: USUARIO_ASSINATURA
            }
            const params = {
                usuario_id: "123",
            }
            const PATH = "/usuario/123"

            const request = simularRequest({ client, roles, params }, method, PATH)

            expect(request.locals.access).toBe("USUARIO")
        });

    });

    describe('acesso admin', () => {

        test('deve receber autorização como idook', () => {
            const client = {
                id: "123"
            }
            const method = "POST"
            const roles = {
                assinatura: USUARIO_ASSINATURA
            }
            const params = {
                id: "123",
            }
            const PATH = "/usuario/123"
            const access = "IDOOK"

            const request = simularRequest({ client, roles, params, access }, method, PATH)

            expect(request.locals.access).toBe(access)
        });


        test('deve receber autorização como instituicao master', () => {
            const client = {
                id: "123"
            }
            const method = "POST"
            const roles = {
                assinatura: USUARIO_ASSINATURA
            }
            const params = {
                id: "123",
            }
            const PATH = "/usuario/123"
            const access = "INSTITUICAO"

            const request = simularRequest({ client, roles, params, access }, method, PATH)

            expect(request.locals.access).toBe(access)
        });

        test('deve receber autorização como instituicao admin', () => {
            const client = {
                id: "123"
            }
            const method = "POST"
            const roles = {
                assinatura: USUARIO_ASSINATURA
            }
            const params = {
                id: "123",
            }
            const PATH = "/usuario/123"
            const access = "INSTITUICAO_ADMIN"

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