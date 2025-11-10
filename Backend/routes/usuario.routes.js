const getObjectOr404 = require('../middlewares/getObjectOr404.middleware')
const isJsonRequestValid = require('../middlewares/isJsonRequestValid.middleware')
const validationJson = require('../middlewares/validation.middleware')
const checkDuplicate = require('../middlewares/checkDuplicate.middleware')
const { validateUser } = require('../middlewares/validateUser.middleware')
const { loginSchema, registerSchema } = require('../validators/usuarioSchema')
const db = require('../models')

module.exports = app => {
    const router = require('express').Router()
    const usuarioController = require('../controllers/usuario.controller')

    router.post('/login', isJsonRequestValid, validationJson(loginSchema), usuarioController.login)

    router.post(
        '/register',
        isJsonRequestValid,
        validationJson(registerSchema),
        checkDuplicate(db.UsuarioModel, 'username'),
        usuarioController.register
    )

    router.get('/sorteo', validateUser, usuarioController.getSorteoByUsuarioId)

    router.get('/:id', getObjectOr404(db.UsuarioModel), usuarioController.getUsuarioById)
    router.put('/:id', usuarioController.updateUsuario)
    router.delete('/:id', usuarioController.deleteUsuario)

    app.use('/usuarios', router)
}
