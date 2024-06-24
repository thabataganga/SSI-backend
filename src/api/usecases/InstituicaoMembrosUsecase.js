const { NestedCollection, BaseCrud } = require("../services/utils/Crud")
const ServiceError = require("../err/ServiceError")
const UsuarioFacade = require("../facade/UsuariosFacade")()
const UsuarioModel = require("../models/UsuariosModel")
const crud = new BaseCrud("instituicao")
const POPULATE = "associados"
module.exports = class InstituicaoMembrosUsecase {

    /**
     * 
     * @param {entidade} instituicao instituicao já encontrada pelo id
     * @param {Request} associado 
     * @returns 
     */
    static async criar(instituicao, associado, usuarioModel = UsuarioModel) {
        try {
            // valida se o usuario existe no banco
            await crud.obterPorId(usuarioModel, associado._id)

            const associados = crud.populate.adicionar(instituicao, POPULATE, associado, ["usuario_id"])

            instituicao.associados = associados

            await instituicao.save()

            return associado

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
     * @param {Request} associado 
     * @returns 
     */
    static async atualizar(instituicao, usuarioId, associado) {

        try {
            
            associado._id = usuarioId
            associado.usuario_id = usuarioId

            const associados = crud
                .populate
                .atualizar(instituicao, POPULATE, usuarioId, associado)

            instituicao[POPULATE] = associados

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

            const associados = crud
                .populate
                .remover(instituicao, POPULATE, usuarioId)

            instituicao[POPULATE] = associados

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
            const associado = crud.populate
                .obterPorId(instituicao, POPULATE, usuarioId)

            const { foto } = await usuarioFacade.obterPorId(usuarioId, true)

            associado.foto = foto

            return associado

        } catch (error) {
            throw new ServiceError(
                error.message || error,
                404,
                "Associado não encontrado."
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

            const associadosCollection = crud.populate
                .collection(instituicao, POPULATE)

            const usuarioDados = await Promise
                .all(associadosCollection
                    .map(
                        async (usuario) => await usuarioFacade.obterPorId(usuario._id, true)
                    )
                )

            const associados = associadosCollection.map((associado, index) => {
                associado = JSON.parse(JSON.stringify(associado))

                const usuario = usuarioDados[index]

                if (!usuario) return associado

                associado.foto = usuario.foto

                return associado
            })


            if (associados.slice(inicio, inicio + limite).length == 0) {
                throw new ServiceError(
                    "nenhum resultado encotrado para a requisicao. " +
                    "Total de associados: " + associados.length,
                    "400",
                    "Nenhum resultado encontrado para a pagina"
                )
            }

            const associadosFiltrados = Comando.consultar(associados, consultaRequest)
            const totalFiltrado = associadosFiltrados.length

            if (totalFiltrado == 0) {
                throw new ServiceError(
                    "Nenhum resutlado encontrado para a query",
                    "404",
                    "Nenhum resultado encontrado para a busca"
                )
            }

            const associadosPaginados = associadosFiltrados.slice(inicio, inicio + limite)

            return {
                exibindo: `${inicio + associadosPaginados.length} de ${totalFiltrado}`,
                total_de_paginas: Math.ceil(totalFiltrado / limite),
                total_de_associados: associadosPaginados.length,
                paginaAtual: pagina,
                associados: associadosPaginados
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

    static consultar(associados, queryRequest) {

        const propertys = new CommandQuery(queryRequest)

        for (const property in propertys) {
            const [value, regex] = propertys[property]
            if (value != null) {
                associados = query(associados, property, value, regex)
            }
        }

        return associados
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
        area_de_atuacao = null,
        local_de_trabalho = null,
        cargo = null,
        doacao = null,
    }) {
        this.status = Comando.buildQuery(status, false)
        this.usuario_id = Comando.buildQuery(usuario_id, false)
        this._id = Comando.buildQuery(usuario_id, false)
        this.matricula = Comando.buildQuery(matricula, false)
        this.area_de_atuacao = Comando.buildQuery(area_de_atuacao, true)
        this.local_de_trabalho = Comando.buildQuery(local_de_trabalho, true)
        this.cargo = Comando.buildQuery(cargo, true)
        this.doacao = Comando.buildQuery(doacao, false)
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