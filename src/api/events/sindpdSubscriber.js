const noticiasWork = require('../services/apiNoticias')
const appCache = require('../cache/appCache')
const log = require('../log')

module.exports = (event) => {
    noticiasWork()
    event.on("noticias_sindpd", (noticias) => {
        log.info('salvando noticias em cache...')
        appCache.set("noticias_sindpd", noticias)

        const noticiasCache = appCache.get("noticias_sindpd")
        if (!noticiasCache) log.error('falha ao salvar o cache das noticias')
        else log.sucess('sucesso ao savar o cache das noticias')
    })
}