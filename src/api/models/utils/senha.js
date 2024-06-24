const bcrypt = require('bcrypt');
const SALT=7

const senha = {
    type: String,
    set: (value) => bcrypt.hashSync(value, SALT)
}

module.exports = senha