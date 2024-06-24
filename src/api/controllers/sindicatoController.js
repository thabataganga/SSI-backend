// const service = require("../services/sindicatoService")

// module.exports = {
//     interceptor: async (req, res, next) => {
//       const { id } = req.params
//       try {
//         const entidade = await service.obterPorId(id)
//         req.locals.entidade = entidade
//         next()
//       } catch (error) {
//         return next(error)
//       }
//     },
    
//     listarTodos: async (req, res, next) => {
//       try {
//         const todos = await service.todos(req.body)
//         return res.status(200).json(todos);
//       } catch (error) {
//         return next(error)
//       }
//     },
    
//     listarUm: async (req, res, next) => {
//       const { entidade } = req.locals
//       return res.status(200).json(entidade);
//     },
    
//     listarUmRecurso: async (req, res, next) => {
//       const { entidade } = req.locals
//       const recurso = entidade[req.params.recurso]
    
//       if (!recurso) {
//         return res.status(404).json({
//           message: "Not Found",
//           detalhes: "Recurso não encontrado!",
//           code: 404
//         })
//       }
    
//       return res.status(200).json(recurso);
//     },
    
    
//     inserirUm: async(req, res, next) => {
//       try {
//         const novoCriado = await service.criar(req.body)
        
//         return res.status(201).json(novoCriado);
//       } catch (error) {
//           next(error)
//       }
//     },
    
//     editarUm: async(req, res, next) => {
//       const { entidade } = req.locals;
//       const novasInfos = req.body;
//       try {
//         await service.atualizar(novasInfos, entidade)
//         return res.status(200).json(novasInfos);
//       } catch (error) {
//         return next(error)
//       }
//     },
    
//     deletarUm: async (req, res, next) => {
//       const { entidade } = req.locals;
//       try {
//         const message = await service.deletar(entidade)
//         return res.status(200).json(message);
//       } catch (error) {
//         return next(error)
//       }
//     }

//   }
  