const { Participante } = require('../models');

async function validateParticipanteByLink(req, res, next) {
    try {
        const { linkBolillo } = req.params;
    if (!linkBolillo) return res.status(400).json({ message: 'Link inválido' });
        const participante = await Participante.findOne({ where: { linkBolillo } });
    if (!participante) return res.status(404).json({ message: 'Participante no encontrado' });

    req.participante = participante;
    next();
    } catch (err) {
        console.error('validateParticipanteByLink error', err);
        res.status(500).json({ message: 'Error de autenticación de participante' });
        }
}

module.exports = { validateParticipanteByLink };
