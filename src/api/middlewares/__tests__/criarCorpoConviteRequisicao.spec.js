const UsuarioFacadeMock = {
    obterPorId: async mock => ({
        email: "alerquina@gmail.com",
        _id: "123"
    })
}

const AdminServiceMock = {
    obterPorId: async mock => ({
        email: "idook@idook.com",
        _id: "123"
    })
}

const InstituicaoFacadeMock = {
    obterPorId: async mock => ({
        email: "as.meninas.super.poderozas@sbt.com",
        _id: "123"
    })
}

const middleware = require("../criarCorpoConviteRequisicao")(
    InstituicaoFacadeMock, UsuarioFacadeMock, AdminServiceMock
)

const INSTITUICAO_ASSINATURA = "5127062e-6f19-4432-96f7-5ea4fe45fd51"
const USUARIO_ASSINATURA = "519d56fe-f1a8-4a9f-942b-966bfcd31464"
const IDOOK_ASSINATURA = "82217e95-8d27-48a5-9b3c-e55316e86b9d"

describe('Convite Middlware Request', () => {
    test('deve gerar um body request assinado como idook', async () => {
        const method = "POST"
        const roles = { assinatura: IDOOK_ASSINATURA }
        const body = {
            email: "cliente@instituicao.com",
            instituicaoId: "12345"
        }
        const client = { email: "idook@idook.com", _id: "123" }
        const bodyEsperado = {
            email: "cliente@instituicao.com",
            geradoPor: "idook@idook.com",
            instituicaoId: "12345"
        }
        const PATH = "/convite"

        const request = await simularRequestAsync({ client, roles, body }, method, PATH)

        expect(request.body).toEqual(bodyEsperado)
    });

    test('deve gerar um body request assinado como  instituicao master', async () => {
        const method = "POST"
        const roles = { assinatura: INSTITUICAO_ASSINATURA }
        const body = {
            email: "cliente@instituicao.com",
            instituicaoId: "123"
        }
        const client = { email: "as.meninas.super.poderozas@sbt.com", id: "123" }
        const bodyEsperado = {
            email: "cliente@instituicao.com",
            geradoPor: "as.meninas.super.poderozas@sbt.com",
            instituicaoId: "123"
        }
        const PATH = "/convite"

        const request = await simularRequestAsync({ client, roles, body }, method, PATH)

        expect(request.body).toEqual(bodyEsperado)
    });

    test('deve gerar um body request assinado como  instituicao admin', async () => {
        const method = "POST"
        const roles = { assinatura: INSTITUICAO_ASSINATURA }
        const body = {
            email: "cliente@instituicao.com",
            instituicaoId: "123"
        }
        const client = { 
            email: "alerquina@gmail.com", 
            id: "123567",
            instituicaoId: "123"
         }
        const bodyEsperado = {
            email: "cliente@instituicao.com",
            geradoPor: "alerquina@gmail.com",
            instituicaoId: "123"
        }
        const PATH = "/convite"

        const request = await simularRequestAsync({ client, roles, body }, method, PATH)

        expect(request.body).toEqual(bodyEsperado)
    });

    test('não deve logar devido a acesso invalido', async () => {
        const method = "POST"
        const roles = { assinatura: INSTITUICAO_ASSINATURA }
        const body = {
            email: "cliente@instituicao.com",
            instituicaoId: "12378"
        }
        const client = { 
            email: "alerquina@gmail.com", 
            id: "123567",
            instituicaoId: "12223443"
         }
        const serviceError = {
            status: 401,
            message: "O usuario não possui permissao para essa ação",
            detalhes: "Não autorizado."
        }
        const PATH = "/convite"

        try {
            const request = await simularRequestAsync({ client, roles, body }, method, PATH)
        } catch (error) {
            expect(error).toEqual(serviceError)
        }
        

        
    });
});


const simularRequestAsync = async (
    { client, roles, body, access = null },
    method, path, next = () => null
) => {
    const request = {
        locals: { client, roles, access },
        body,
        params: {},
        method,
        path
    }

    await middleware(request, null, next)
    return request
}