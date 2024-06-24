


class ServiceError extends Error {
    /**
     * 
     * @param {string} message mensagem técnica
     * @param {number} status http status code
     * @param {string} detalhes mensagem agravadel para o frontend
     */
    constructor(message, status, detalhes) {
        super()
        this.message = message
        this.detalhes = detalhes
        this.status = status
    }
}

module.exports = ServiceError 