const { error } = require('console');
const db = require('../models');
const crypto = require('crypto');


exports.addParticipantebySorteoLink = async (req, res) => {
    const { link } = req.params;
    const { nombre } = req.body;
    try {
        const sorteo = await db.SorteosModel.findOne({ where: { link } });
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }

        const identificadorUnico = Math.floor(100000 + Math.random() * 900000).toString();
        const token = crypto.randomBytes(16).toString("hex");


        const participante = await db.ParticipantesModel.create({
            nombre,
            identificadorUnico,
            linkParticipante: token,
            idSorteo: sorteo.id,
            idParticipanteAsignado: null
        });


        res.status(201).json({ participante });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar participante' });
    }
};

exports.createWishlistItem = async (req, res) => {
    const { linkParticipante } = req.params;
    const { wishlist } = req.body;

    try {
        const participante = await db.ParticipantesModel.findOne({ where: { linkParticipante } });
        if (!participante) {
            return res.status(404).json({ error: 'Participante no encontrado' });
        }

        if (!Array.isArray(wishlist)) {
            wishlist = [wishlist];
        }

        const deseos = wishlist.map(item => ({
            wishlist: item,
            idParticipante: participante.id
        }));

        await db.DeseosModel.bulkCreate(deseos);

        const participanteConDeseos = await db.ParticipantesModel.findOne({
            where: { id: participante.id },
            include: [{ model: db.DeseosModel, as: 'deseos' }]
        });

        res.status(201).json({ participante: participanteConDeseos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar deseos' });
    }
}




exports.getParticipantesBySorteoLink = async (req, res) => {
    const { link } = req.params;
    try {
        const sorteo = await db.SorteosModel.findOne({ where: { link } });
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }
        const participantes = await db.ParticipantesModel.findAll({ where: { idSorteo: sorteo.id } });
        res.status(200).json(participantes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener participantes' });
    }
};



exports.getAllParticipantes = async (req, res) => {
    try {
        const participantes = await db.ParticipantesModel.findAll();
        res.status(200).json(participantes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los participantes' });
    }
};




exports.asignarParticipantes = async (req, res) => {
    const { id } = req.params;
    try {
        const participantes = await db.ParticipantesModel.findAll({ where: { idSorteo: id } });
        if (participantes.length < 3) {
            return res.status(400).json({ error: 'No hay suficientes participantes para asignar, espere que se inscriban al menos un 3 parcipantes' });
        }
        const copias = [...participantes];
        let participantesMezclados = copias.sort(() => Math.random() - 0.5);

        let asignacionValida = true;


        for (let i = 0; i < participantes.length; i++) {
            if (participantes[i].id === participantesMezclados[i].id) {
                console.log("Reasignando debido a asignación inválida");
                console.log("Participante original:", participantes[i].id, "Asignado a sí mismo.", participantesMezclados[i].id);
                asignacionValida = false;
                i = -1; // Reiniciar el ciclo
                participantesMezclados = participantesMezclados.sort(() => Math.random() - 0.5);
                console.log("reiniciando")
            }
            asignacionValida = true;
        }

        if (asignacionValida) {
            console.log("Asignación válida");
            const actualizaciones = participantes.map((participante, i) => {
                return participante.update({
                    idParticipanteAsignado: participantesMezclados[i].id
                });
            });

            await Promise.all(actualizaciones);
        }
        const participantesActualizados = await db.ParticipantesModel.findAll({ where: { idSorteo: id } });

        res.status(200).json({ participantesActualizados });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al asignar participantes' });
    }
};



exports.getParticipanteByToken = async (req, res) => {
    const { linkParticipante } = req.params;

    console.log("ENTRO")
    
    try {
        const host = req.get('host');
        const participante = await db.ParticipantesModel.findOne(
            { 
                where: { linkParticipante },
                include: [{ model: db.DeseosModel, as: 'deseos' }]
            }
        );

        if (!participante) {
            return res.status(404).json({ error: 'Participante no encontrado' });
        }

        const participanteAsignado = await db.ParticipantesModel.findByPk(participante.idParticipanteAsignado, {
            include: [{ model: db.DeseosModel, as: 'deseos' }]
        });



        const resultado = {
            participante,
            participanteAsignado
        };

        res.status(200).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el participante' });
    }
}



exports.loginParticipante = async (req, res) => {
    const { link } = req.params;
    const { identificadorUnico } = req.body;
    try {
        const sorteo = await db.SorteosModel.findOne({ where: { link } });
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }

        const participante = await db.ParticipantesModel.findOne({
            where: { idSorteo: sorteo.id, identificadorUnico },
            include: [{ model: db.DeseosModel, as: 'deseos' }]
        });

        if (!participante) {
            return res.status(401).json({ error: 'Código incorrecto' });
        }

        // Buscar participante asignado si existe
        let participanteAsignado = null;
        if (participante.idParticipanteAsignado) {
            participanteAsignado = await db.ParticipantesModel.findByPk(participante.idParticipanteAsignado, {
                include: [{ model: db.DeseosModel, as: 'deseos' }]
            });
        }

        res.status(200).json({
            participante,
            participanteAsignado,
            linkParticipante: participante.linkParticipante
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al autenticar participante' });
    }
};
