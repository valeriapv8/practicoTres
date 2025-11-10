const db = require('../models')

const validateUser = async (req, res, next) => {
    try {
        const bearerToken = req.headers['authorization']
        if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        const token = bearerToken.split(' ')[1]
        if (!token) return res.status(401).json({ error: 'Unauthorized' })
        const userToken = await db.authToken.findOne({ where: { token }, include: [{ model: db.UsuarioModel, as: 'usuario' }] })
        if (!userToken || !userToken.usuario) return res.status(401).json({ error: 'Unauthorized' })
        req.user = userToken.usuario
        next()
    } catch (_) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
}

const validateParticipante = async (req, res, next) => {
    try {
        const bearerToken = req.headers['authorization']
        if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        const token = bearerToken.split(' ')[1]
        if (!token) return res.status(401).json({ error: 'Unauthorized' })
        const participante = await db.ParticipantesModel.findOne({ where: { linkParticipante: token }, include: [{ model: db.DeseosModel, as: 'deseos' }] })
        if (!participante) return res.status(401).json({ error: 'Unauthorized' })
        req.participante = participante
        next()
    } catch (_) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
}

module.exports = { validateUser, validateParticipante }
