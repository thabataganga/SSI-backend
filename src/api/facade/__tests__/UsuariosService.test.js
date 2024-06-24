require('dotenv').config()
const usuarioFacade = require('../UsuariosFacade')()
const { ConviteModel, InstituicaoModel, UsuariosModel } = require("../../models")
const moogose = require('mongoose')

describe('Testes de integracao - Usuario', () => {
    let dbConnect;
    beforeAll(async () => {
        const dbConnect = await moogose.connect(process.env.MONGO_DATABASE_URI)

    })

    afterAll(async () => {
        await clearDatabase()
        await moogose.disconnect()
    })
    test('deve criar um usuario', async () => {
        const instituicao = await setupInstituicao()

        const usuario = {
            "email": "test4@gmail.com",
            "tipo_de_usuario": "COLABORADOR",
            "cpf": "123.456.789-10",
            "status": "ATIVO",
            "senha": "123",
            "comApi": false,
            "privacidade": {
                "termos_de_uso": true,
                "receber_email": true
            },
            "instituicoes": {
                instituicao_id: instituicao._id,
                instituicao_tipo: instituicao.tipo,
                vinculo: "COLABORADOR"
            }
        }
        const id = moogose.Types.ObjectId()

        const usuarioNovo = await usuarioFacade.criar(usuario, id)

        expect(usuarioNovo.email).toBe("test4@gmail.com")
        expect(usuarioNovo.status).toBe("ATIVO")
    });

    test('não deve criar um usuario', async () => {
        const instituicao = await setupInstituicao()

        const usuario = {
            "email": "test4@gmail.com",
            "tipo_de_usuario": "COLABORADOR",
            "cpf": "123.456.789-10",
            "status": "ATIVO",
            "senha": "123",
            "comApi": false,
            "privacidade": {
                "termos_de_uso": true,
                "receber_email": true
            },
            "instituicoes": {
                instituicao_id: instituicao._id,
                instituicao_tipo: instituicao.tipo,
                vinculo: "COLABORADOR"
            }
        }
        const id = moogose.Types.ObjectId()

        try {
            await usuarioFacade.criar(usuario, id)
        } catch (error) {
            expect(error.status).toBe(409);
        }
    });

    describe('Convite Service', () => {
        describe('tipo -> EMAIL', () => {

            test('deve gerar um convite para um usuario do tipo membro', async () => {
                const instituicao = await setupInstituicao()

                const convite = {
                    "email": "test1@gmail.com",
                    "tipo_de_usuario": "MEMBRO",
                    "geradoPor": "test@instituicao.com",
                    "criadorId": "12345678",
                    "tipo": "EMAIL",
                    "instituicaoId": instituicao._id,
                    "cpf": "123.456.789-35"
                }

                const conviteResultado = await usuarioFacade.convite(convite)

                expect(conviteResultado.tipo).toBe("EMAIL");
                expect(conviteResultado.usuarioTipo).toBe("MEMBRO")
                expect(conviteResultado.status).toBe("ATIVACAO_PENDENTE")
                expect(conviteResultado.codigo.length).toBe(6)
                expect(conviteResultado._id).not.toBe(null)
            });

            test('deve criar um convite para usuario tipo admistrador', async () => {
                const instituicao = await setupInstituicao()
                // adicionar regra de cpf
                const convite = {
                    "email": "test2@gmail.com",
                    "geradoPor": "test@instituicao.com",
                    "cpf": "123.456.789-17",
                    "tipo_de_usuario": "COLABORADOR",
                    "criadorId": "123456",
                    "tipo": "EMAIL",
                    "instituicaoId": instituicao._id
                }

                const conviteResultado = await usuarioFacade.convite(convite)

                expect(conviteResultado.tipo).toBe("EMAIL");
                expect(conviteResultado.usuarioTipo).toBe("ADMIN")
                expect(conviteResultado.status).toBe("ATIVACAO_PENDENTE")
                expect(conviteResultado.codigo.length).toBe(6)
                expect(conviteResultado.token).not.toBe(null)
                expect(conviteResultado._id).not.toBe(null)
            });

            test('deve criar um usuario a partir de um convite', async () => {
                const instituicao = await setupInstituicao()

                const convite = {
                    "email": "test3@gmail.com",
                    "geradoPor": "test@instituicao.com",
                    "tipo_de_usuario": "COLABORADOR",
                    "instituicaoId": instituicao._id.toString(),
                    "criadorId": "12345678",
                    "tipo": "EMAIL",
                    "cpf": "123.456.789-14"
                }
                const conviteResultado = await usuarioFacade.convite(convite)
                const usuario = {
                    "email": "test3@gmail.com",
                    "geradoPor": "test@instituicao.com",
                    "criadorId": "12345678",
                    "tipo_de_usuario": "COLABORADOR",
                    "cpf": "123.456.789-14",
                    "status": "ATIVO",
                    "senha": "123",
                    "comApi": false,
                    "privacidade": {
                        "termos_de_uso": true,
                        "receber_email": true
                    }
                }

                const usuarioNovo = await usuarioFacade.criarComConvite(
                    Object.assign({
                        codigo: conviteResultado.codigo,
                        token: conviteResultado.token
                    }, usuario)
                )

                expect(usuarioNovo.email).toBe("test3@gmail.com")
                expect(usuarioNovo.status).toBe("ATIVO")
                expect(usuarioNovo._id).not.toBe(conviteResultado._id)
            });


        });
        describe('tipo -> LINK', () => {
            test('deve gerar um convite para um usuario do tipo membro', async () => {
                const instituicao = await setupInstituicao()

                const convite = {
                    "tipo_de_usuario": "MEMBRO",
                    "geradoPor": "test@instituicao.com",
                    "criadorId": "12345678",
                    "instituicaoId": instituicao._id,
                    "tipo": "LINK",
                    "conviteUri": "teste"
                }

                const conviteResultado = await usuarioFacade.convite(convite)

                expect(conviteResultado.tipo).toBe("LINK");
                expect(conviteResultado.usuarioTipo).toBe("MEMBRO")
                expect(conviteResultado.status).toBe("HABILITADO")
                expect(conviteResultado.codigo.length).toBe(6)
                expect(conviteResultado._id).not.toBe(null)
            });

            test('deve criar um usuario a partir de um convite', async () => {
                const instituicao = await setupInstituicao()

                const convite = {
                    "email": "test4@gmail.com",
                    "geradoPor": "test@instituicao.com",
                    "tipo_de_usuario": "MEMBRO",
                    "instituicaoId": instituicao._id.toString(),
                    "tipo": "LINK",
                    "criadorId": "12345678",
                    "cpf": "123.456.789-11",
                    "conviteUri": "teste"
                }
                const conviteResultado = await usuarioFacade.convite(convite)
                const usuario = {
                    "email": "test7@gmail.com",
                    "geradoPor": "test@instituicao.com",
                    "criadorId": "12345678",
                    "tipo_de_usuario": "COLABORADOR",
                    "cpf": "123.456.789-11",
                    "status": "ATIVO",
                    "senha": "123",
                    "comApi": false,
                    "privacidade": {
                        "termos_de_uso": true,
                        "receber_email": true
                    }
                }

                const usuarioNovo = await usuarioFacade.criarComConvite(
                    Object.assign({
                        codigo: conviteResultado.codigo
                    }, usuario)
                )

                expect(usuarioNovo.email).toBe("test7@gmail.com")
                expect(usuarioNovo.status).toBe("ATIVO")
                expect(usuarioNovo._id).not.toBe(conviteResultado._id)
            });


        });
        test('não deve gerar um convite para um usuario', async () => {
            const instituicao = await setupInstituicao()

            const convite = {
                "tipo_de_usuario": "MEMBRO",
                "geradoPor": "test@instituicao.com",
                "criadorId": "12345678",
                "instituicaoId": instituicao._id,
                "tipo": "LINK",
                "conviteUri": "teste",
                "email" : "test2@gmail.com"
            }
            
            try {
                const conviteResultado = await usuarioFacade.convite(convite)
            } catch (error) {
                expect(error).not.toEqual(null);
            }
        });
    })

});

const setupInstituicao = async () => {
    const fake = (Math.random() * 1).toString(32)
    const newInstituicao = new InstituicaoModel({
        "nome_fantasia": fake,
        "cnpj": fake + "35.691.772/0002-00",
        "email": fake + "@idook.com",
        "tipo": "SINDICATO",
        "senha": "1135813#",
        "status": "ATIVO",
        "telefone": "001522234355",
        "privacidade": {
            "termos_de_uso": true,
            "receber_email": false
        },
        "endereco": {
            "cep": "1122233444",
            "uf": "RJ",
            "localidade": "Rio de Janeiro",
            "bairro": "bairro",
            "logradouro": "rua Api",
            "numero": "05",
            "complemento": "AP 01"
        },
        "identidade_visual": {
            "logotipo": "http:img.com",
            "slogan": "",
            "calltoaction": "",
            "cor_pri": "",
            "cor_sec": "",
            "cor_ter": ""
        },
        "redes_sociais": {
            "whatsapp": "",
            "youtube": "",
            "instagram": "",
            "twitter": "",
            "facebook": "",
            "linkedin": "",
            "tiktok": "",
            "website": ""
        },
        "api_dados": {
            "link": "",
            "chave": ""
        },
        "api_noticias": {
            "link": "",
            "chave": ""
        },
        "tipos_de_usuarios": {
            "colaborador": "",
            "associado": ""
        },
        "liderancas": [],
        "adms": [],
        "colaboradores": [],
        "associados": [],
        "alertas": [],
        "noticias": [],
        "__v": 0
    })
    return await newInstituicao.save()
}



const clearDatabase = async () => {
    try {
        //await conviteModels.collection.drop()
        await InstituicaoModel.collection.drop()
        await UsuariosModel.collection.drop()
        await ConviteModel.collection.drop()
    } catch (error) {
        console.error(error)
    }
}