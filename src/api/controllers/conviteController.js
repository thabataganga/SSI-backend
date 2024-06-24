const conviteService = require("../services/ConviteService")();

module.exports = {
  async interceptor(req, res, next, convite_id) {
    try {
      const convite = await conviteService.obterPorId(convite_id);
      req.locals.entidade = convite;
      next();
    } catch (error) {
      next(error);
    }
  },

  async obterPorId(req, res, next) {
    res.status(200).json(req.locals.entidade);
  },
};
