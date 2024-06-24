require('dotenv').config()

const instituicaoFacade = require('../InstituicaoFacade')()
const usuarioFacade = require('../UsuariosFacade')()
const { InstituicaoModel, UsuariosModel } = require("../../models")
const instituicaoAssinatura = require("../../../config/privilegios/instituicao_assinatura").assinatura
const jwt = require('jsonwebtoken')
const moongose = require("mongoose")

describe('Testes de integração - Instituicao', () => {
    let dbConnect;
    beforeAll(async () => {
        const dbConnect = await moongose.connect(process.env.MONGO_DATABASE_URI)
    })

    afterAll(async () => {
        await clearDatabase()
        await moongose.disconnect()
    })

    test('deve criar uma instituicao', async () => {
        const instituicao = {
            "nome_fantasia": "desenvolvimento_test",
            "cnpj": "35.691.772/0002-00",
            "email": "email@email.com",
            "tipo": "SINDICATO",
            "senha": "senha",
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
            },
            "redes_sociais": {
            },
            "api_dados": {

            },
            "api_noticias": {

            },
            "tipos_de_usuarios": {
            },
            "liderancas": [],
            "colaboradores": [],
            "associados": [],
            "alertas": [],
            "noticias": []
        }

        const newInstituicao = await instituicaoFacade.criar(instituicao)

        expect(newInstituicao).not.toBe(null)
    });

    test('deve retornar todos os convites', async () => {
        const instituicao = await setupInstituicao()
        const convite1 = {
            "email": "test10@gmail.com",
            "geradoPor" : "test@instituicao.com",
            "cpf" : "123.456.789-12",
            "tipo_de_usuario": "COLABORADOR",
            "criadorId": "123456",
            "tipo" : "EMAIL",
            "instituicaoId": instituicao._id,
        }
        const convite2 = {
            "tipo_de_usuario": "MEMBRO",
            "geradoPor" : "test@instituicao.com",
            "criadorId" : "12345678",
            "instituicaoId": instituicao._id,
            "tipo" : "LINK",
            "conviteUri" : "teste" 
        }
        await Promise.all([
            usuarioFacade.convite(convite1),
            usuarioFacade.convite(convite2)
        ])

        const response = {
            exibindo: `2 de 2`,
            total_de_paginas: 1,
            total_de_convites: 2,
            paginaAtual: 1,
        }

        const convites = await instituicaoFacade.todosOsConvites(instituicao._id)

        expect(convites.exibindo).toEqual(`2 de 2`)
    });
});


const clearDatabase = async () => {
    try {
        await UsuariosModel.collection.drop()
        await InstituicaoModel.collection.drop()
    } catch (error) {
        console.error(error)
    }
}

const setupInstituicao = async (
    email = "dev3@idook.com",
    senha = "1135813#",
    id = moongose.Types.ObjectId()
) => {
    const newInstituicao = await instituicaoFacade.criar({
        "nome_fantasia": "desenvolvimento",
        "cnpj": "35.691.772/0002-00",
        "email": email,
        "tipo": "SINDICATO",
        "senha": senha,
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
        "colaboradores": [],
        "associados": [],
        "alertas": [],
        "noticias": [],
        "__v": 0
    }, id)
    return newInstituicao
}
