const path = require('path');
const fs = require('fs');

module.exports = {
    "ADMIN": {
        secretOrPrivateKey: fs.readFileSync(path.join(__dirname, 'admin_private.pem'), "utf-8"),
        secretOrPublicKey: fs.readFileSync(path.join(__dirname, 'admin_public.pem'), "utf-8"),
    },
    "ISTITUICAO": {
        secretOrPrivateKey: fs.readFileSync(path.join(__dirname, 'istituicao_private.pem'), "utf-8"),
        secretOrPublicKey: fs.readFileSync(path.join(__dirname, 'istituicao_public.pem'), "utf-8"),
    },

    "USUARIO": {
        secretOrPrivateKey: fs.readFileSync(path.join(__dirname, 'usuario_private.pem'), "utf-8"),
        secretOrPublicKey: fs.readFileSync(path.join(__dirname, 'usuario_public.pem'), "utf-8"),
    },

    get(roles) {
        const keys = roles && this[roles];
        if (!keys) throw "secretOrPublic key is invalid to role";
        return this[roles];
    }
}
