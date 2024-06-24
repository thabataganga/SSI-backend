const axios = require('axios')

const externalApi = axios.create({
    headers : {}
})

module.exports = externalApi