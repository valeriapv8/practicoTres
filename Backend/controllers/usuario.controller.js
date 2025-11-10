const db = require('../models')
const bcrypt = require('bcrypt')
const { generateAuthToken } = require('../utilities/text.utilities')

exports.login = async (req, res) => {
    const { username, password } = req.body
    try {
        const usuario = await db.UsuarioModel.findOne({ where: { username } })
        if (!usuario) return res.status(401).json({ error: 'Username o contraseña incorrectos' })
        const ok = await bcrypt.compare(password, usuario.password)
        if (!ok) return res.status(401).json({ error: 'Username o contraseña incorrectos' })
        const authToken = await generateAuthToken(usuario.username)
        const nuevoToken = await db.authToken.create({ token: authToken, idUsuario: usuario.id })
        res.json({ token: nuevoToken.token })
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud' })
    }
}

exports.register = async (req, res) => {
    const { username, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const nuevoUsuario = await db.UsuarioModel.create({ username, password: hashedPassword })
        res.status(201).json({ id: nuevoUsuario.id, username: nuevoUsuario.username })
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud' })
    }
}

exports.getUsuarioById = async (req, res) => {
    try {
        const usuario = req.obj
        res.json({ id: usuario.id, username: usuario.username })
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud' })
    }
}

exports.getSorteoByUsuarioId = async (req, res) => {
    try {
        const usuario = req.user
        const sorteos = await db.SorteosModel.findAll({ where: { idUsuario: usuario.id } })
        res.json(sorteos)
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud' })
    }
}

exports.updateUsuario = async (req, res) => {
    const { id } = req.params
    const payload = req.body
    try {
        const usuario = await db.UsuarioModel.findByPk(id)
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' })
        Object.assign(usuario, payload)
        await usuario.save()
        res.json(usuario)
    } catch (error) {
        console.error('updateUsuario error:', error)
        res.status(500).json({ error: 'Error al actualizar usuario' })
    }
}

exports.deleteUsuario = async (req, res) => {
    const { id } = req.params
    try {
        const usuario = await db.UsuarioModel.findByPk(id)
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' })
        await db.UsuarioModel.destroy({ where: { id } })
        res.json({ message: 'Usuario eliminado' })
    } catch (error) {
        console.error('deleteUsuario error:', error)
        res.status(500).json({ error: 'Error al eliminar usuario' })
    }
}
