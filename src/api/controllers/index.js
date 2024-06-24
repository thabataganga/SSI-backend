const appCache = require("../cache/appCache") 

module.exports = {
  start(req, res) {
    res.status(200).json({ msg: `API do IDook inicializada` });
  },

  ListaNoticias(req, res, next) {
    const NoticiasInCache = appCache.get("noticias_sindpd")
    if (NoticiasInCache) {
      return res.status(200).json(NoticiasInCache);
    }
    next(new Error("Servico temporariamente indisponivel"))
  },
};
