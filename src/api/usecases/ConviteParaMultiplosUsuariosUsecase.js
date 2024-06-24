
const usuarioService = require("../facade/UsuariosFacade")()
const ServiceError = require("../err/ServiceError")
const log = require("../log")

const MultiplosConvitesUseCase = ({ usuariosInstituicao, instituicaoId, criadorId, geradoPor }) => {

    log.info("[CONVITE] gerando multiplos convites instituicao: " + instituicaoId)
    try {
        const usuariosCommand = prepararUsuarioParaConvite(
            instituicaoId, criadorId, geradoPor, usuariosInstituicao
        )

        return fila.gerarConvites(usuariosCommand)

    } catch (error) {
        log.error(error)
        throw new ServiceError(error.message || error, 400, "Não foi possivel gerar uma lista de convites")
    }
}



const prepararUsuarioParaConvite = (instituicaoId, criadorId, geradoPor, usuarios) => {
    return usuarios
        .map(usuario => {
            return new UsuarioConviteCommand(instituicaoId, criadorId, geradoPor, usuario)
        })
}


class UsuarioConviteCommand {
    constructor(instituicaoId, criadorId, geradoPor, { email, cpf, tipo_de_usuario }) {

        if (!email) throw "O email é requirido para gerar o convite"
        this.email = email

        if (!cpf) throw "O cpf é requirido para gerar o convite"
        this.cpf = cpf
        this.tipo_de_usuario = tipo_de_usuario
        this.instituicaoId = instituicaoId
        this.criadorId = criadorId
        this.geradoPor = geradoPor
        this.tipo = "EMAIL"
    }
}


class FilaConvites extends Array {
    constructor() {
        super()
        this.sucesso = []
        this.falhas = []

    }

    gerarConvites(usuarios) {

        this.push(...usuarios)

        log.info("[CONVITE] adicionando usuarios a fila de convites as " +
            new Date().toISOString() + " tamanho da fila atual " + this.length
        )

        Promise
            .all(this.map((convite, i) => this.convite(i)))
            .then((values) => {
                this.relatorio()
            }).catch(error => {
                console.log(this.falhas)
            })

        return this
    }

    convite(indice) {
        return new Promise((reject, resolve) => {
            const usuario = this[indice]
            log.info(`[CONVITE][FILA] gerando convite para o usuario...${usuario.email}`)

            usuarioService.convite(usuario)
                .then(() => resolve(this.sucesso.push(usuario.email)))
                .catch(() => reject(this.falhas.push(usuario.email)))
        })
    }

    relatorio() {
        const total = this.sucesso.length + this.falhas.length
        log.info(`processamento concluido... total: (${total})`)
        log.info(`total de convites gerados com sucesso: ${this.sucesso.length}`)
        log.info(`total de convites que falharam ao gerar ${this.falhas.length}`)
        this.sucesso = []
        this.falhas = []
        this.splice(0, total)
    }


}

const MINUTOS = 3
const fila = new FilaConvites()


module.exports = MultiplosConvitesUseCase