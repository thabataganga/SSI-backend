const ServiceError = require("../api/err/ServiceError")


module.exports = (req, res, next) => {
    next(new ServiceError("Not found", 404, "Endereco da api invalido"))
}