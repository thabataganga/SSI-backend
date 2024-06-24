const ServiceError = require("../err/ServiceError")


module.exports = (error, req, res, next) => {
         console.error(error)

        if (error instanceof ServiceError) {
            if (!(/[0-9]{3}/.test(error.status))) error.status = 500
            return res.status(error.status).json(error);
        }
      
        if (error instanceof String) {
            res.status(500).json({ 
                detalhes: "O servidor não está disponivel no momento, tente novamente mais tarde.",
                status: 500,
                message:  error
            });
        }
        res.status(500).json({ 
            detalhes: "O servidor não está disponivel no momento, tente novamente mais tarde.",
            status: 500,
            message: error.message
        });
} 