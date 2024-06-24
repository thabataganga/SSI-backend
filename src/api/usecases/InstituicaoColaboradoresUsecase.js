const { NestedCollection, BaseCrud } = require("../services/utils/Crud")
const ServiceError = require("../err/ServiceError")
const UsuarioModel = require("../models/UsuariosModel")
const UsuarioFacade = require('../facade/UsuariosFacade')()
const crud = new BaseCrud("instituicao")
const POPULATE = "colaboradores"
module.exports = class InstituicaoColaboradores {

    /**
     * 
     * @param {entidade} instituicao instituicao já encontrada pelo id
     * @param {Request} colaborador 
     * @returns 
     */
    static async criar(instituicao, colaborador, usuarioModel = UsuarioModel) {
        try {
            // valida se o usuario existe no banco
            await crud.obterPorId(usuarioModel, colaborador._id)

            const colaboradores = crud.populate.adicionar(instituicao, POPULATE, colaborador, "usuario_id")

            instituicao.colaboradores = colaboradores

            await instituicao.save()

            return colaborador

        } catch (error) {

            if (error instanceof ServiceError) throw error

            throw new ServiceError(
                error.message || error,
                400,
                "Não foi possivel salvar"
            )
        }

    }

    /**
     * 
     * @param {entidade} instituicao instituicao já encontrada pelo id
     * @param {ObjectId} usuarioId 
     * @param {Request} colaborador 
     * @returns 
     */
    static async atualizar(instituicao, usuarioId, colaborador) {

        try {
            colaborador._id = usuarioId

            const colaboradores = crud
                .populate
                .atualizar(instituicao, POPULATE, usuarioId, colaborador)

            instituicao[POPULATE] = colaboradores

            await instituicao.save()

            return crud.populate.obterPorId(instituicao, POPULATE, usuarioId)

        } catch (error) {
            throw new ServiceError(
                error.message || error,
                400,
                "Não foi possivel atualizar..."
            )
        }
    }
    /**
     * 
     * @param {entidade} instituicao instituicao já encontrada pelo id
     * @param {*} usuarioId 
     * @returns 
     */
    static async deletar(instituicao, usuarioId) {
        try {

            const colaboradores = crud
                .populate
                .remover(instituicao, POPULATE, usuarioId)

            instituicao[POPULATE] = colaboradores

            await instituicao.save()

            return null

        } catch (error) {
            throw new ServiceError(
                error.message || error,
                400,
                "Não foi possivel deletar..."
            )
        }
    }

    static async deletarTodos(instituicao) {
        try {
            instituicao[POPULATE] = []

            await instituicao.save()

            return null
        } catch (error) {
            throw new ServiceError(
                error.message || error,
                400,
                "Não foi possivel deletar..."
            )
        }
    }
    /**
     * 
     * @param {entidade} instituicao instituicao já encontrada pelo id
     * @param {*} usuarioId 
     * @returns 
     */
    static async obterPorId(instituicao, usuarioId, usuarioFacade = UsuarioFacade) {
        try {
            const colaborador = crud.populate
                .obterPorId(instituicao, POPULATE, usuarioId)

            const { foto } = await usuarioFacade.obterPorId(usuarioId, true)

            colaborador.foto = foto

            return colaborador

        } catch (error) {
            throw new ServiceError(
                error.message || error,
                404,
                "Alerta não encontrado."
            )
        }
    }

    /**
  * 
  * @param {entidade} instituicao instituicao já encontrada pelo id
  * @param {QueryParams} consultaRequest 
  * @param {number} limite 
  * @param {number} pagina 
  * @returns 
  */
    static async todos(instituicao, consultaRequest, usuarioFacade = UsuarioFacade) {
        try {
            let { limite = 10, pagina = 1 } = consultaRequest
            limite = +limite
            pagina = +pagina

            const inicio = ((pagina - 1) * limite)

            const colaboradoresCollection = crud.populate
                .collection(instituicao, POPULATE)

            const usuarioDados = await Promise
                .all(colaboradoresCollection
                    .map(
                        async (usuario) => await usuarioFacade.obterPorId(usuario.id, true)
                    )
                )

            const colaboradores = colaboradoresCollection.map((colaborador, index) => {
                colaborador = JSON.parse(JSON.stringify(colaborador))

                const usuario = usuarioDados[index]

                if (!usuario) return colaborador

                colaborador.foto = usuario.foto

                return colaborador
            })

            if (colaboradores.slice(inicio, inicio + limite).length == 0) {
                throw new ServiceError(
                    "nenhum resultado encotrado para a requisicao. " +
                    "Total de colaboradores: " + colaboradores.length,
                    "400",
                    "Nenhum resultado encontrado para a pagina"
                )
            }

            const colaboradoresFiltrados = Comando.consultar(colaboradores, consultaRequest)
            const totalFiltrado = colaboradoresFiltrados.length

            if (totalFiltrado == 0) {
                throw new ServiceError(
                    "Nenhum resutlado encontrado para a query",
                    "404",
                    "Nenhum resultado encontrado para a busca"
                )
            }

            const colaboradoresPaginados = colaboradoresFiltrados.slice(inicio, inicio + limite)

            return {
                exibindo: `${inicio + colaboradoresPaginados.length} de ${totalFiltrado}`,
                total_de_paginas: Math.ceil(totalFiltrado / limite),
                total_de_colaboradores: colaboradoresPaginados.length,
                paginaAtual: pagina,
                colaboradores: colaboradoresPaginados
            }
        } catch (error) {
            if (error instanceof ServiceError) throw error
            throw new ServiceError(
                error.message || error,
                500,
                "O servidor está indisponivel no momento"
            )
        }
    }
}


class Comando {
    /**
     * 
     * @param {string} value 
     * @param {Boolean} regex 
     * @returns 
     */
    static buildQuery(value, regex) {
        return [value, regex]
    }

    static consultar(colaboradores, queryRequest) {

        const propertys = new CommandQuery(queryRequest)

        for (const property in propertys) {
            const [value, regex] = propertys[property]
            if (value != null) {
                colaboradores = query(colaboradores, property, value, regex)
            }
        }

        return colaboradores
    }
}
class CommandQuery {
    /**
     * 
     * @param {QueryParams} queryParams 
     */
    constructor({
        status = null,
        usuario_id = null,
        matricula = null,
        departamento = null,
        cargo = null,
    }) {
        this.status = Comando.buildQuery(status, false)
        this.usuario_id = Comando.buildQuery(usuario_id, false)
        this._id = Comando.buildQuery(usuario_id, false)
        this.matricula = Comando.buildQuery(matricula, false)
        this.departamento = Comando.buildQuery(departamento, true)
        this.cargo = Comando.buildQuery(cargo, true)
    }
}

const query = (arr, property, value, regex) => {
    if (!value) return arr
    if (regex) {
        return arr
            .filter(object => new RegExp(value, 'i')
                .test(object[property])
            )
    }
    return arr.filter(object => object[property] == value)
}