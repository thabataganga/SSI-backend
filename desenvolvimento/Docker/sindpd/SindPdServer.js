
const server = require("express")()
const sindpd = require("./SindPdUsuariosMock")

console.log("oioioioioi")

server.use((req, res, next) => { // fake auth
        const { authorization } = req.headers

        // if (!authorization) return res.stauts(401).send()

        console.log(req.headers)

        next()
})

server.get("/usuarios/", (req, res) => res.status(200).json(sindpd))
server.get("/usuario/:id", (req, res) => {
        const usuario = sindpd
                .map((u, i) => Object.assign(u, { id: i }))
                .find(u => u.id == req.params.id)

        console.log(usuario)

        res.status(200).json(usuario)
})


server.listen(8081, () => console.log("sind pd simulador rodando na porta 8081"))


