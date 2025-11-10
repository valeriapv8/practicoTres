const crypto = require('crypto');
const db = require('../models');

// --- detectar modelos con nombres posibles en db ---
const SorteoModel = db.Sorteo || db.SorteosModel || db.Sorteos || db.SorteoModel;
const UsuarioModel = db.Usuario || db.UsuarioModel || db.Usuarios || db.Usuario;
const ParticipanteModel = db.Participante || db.ParticipantesModel || db.Participantes || db.Participante;

// Al crear sorteo, asegurar que se genera link y se guarda idUsuario si existe
exports.createSorteo = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!SorteoModel) {
      console.error('Sorteo model not found in db object', Object.keys(db || {}));
      return res.status(500).json({ error: 'Modelo Sorteo no disponible' });
    }

    const { nombre, fecha } = req.body;
    const idUsuario = req.user.id;
    const token = crypto.randomBytes(16).toString('hex');

    // crear valores para ambos campos: link y linkAcceso (compatibilidad con el modelo actual)
    const nuevo = await SorteoModel.create({
      nombre,
      fecha,
      estado: true,
      link: token,
      linkAcceso: token, // <-- agregado para evitar notNull violation
      idUsuario
    });

    const usuario = UsuarioModel ? await UsuarioModel.findByPk(idUsuario) : null;
    const usuarioNombre = usuario ? (usuario.username || usuario.nombre || null) : null;

    res.status(201).json({
      id: nuevo.id,
      nombre: nuevo.nombre,
      fecha: nuevo.fecha,
      estado: nuevo.estado,
      link: nuevo.link || nuevo.linkAcceso || null,
      usuario: usuarioNombre
    });
  } catch (error) {
    console.error('createSorteo error:', error);
    res.status(500).json({ error: 'Error al crear el sorteo' });
  }
};

exports.getAllSorteos = async (req, res) => {
    try {
        if (!SorteoModel) return res.status(500).json({ error: 'Modelo Sorteo no disponible' });
        const sorteos = await SorteoModel.findAll();
        res.status(200).json(sorteos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los sorteos' });
    }
}

exports.getSorteoByLink = async (req, res) => {
    const { link } = req.params;
    try {
        if (!SorteoModel) return res.status(500).json({ error: 'Modelo Sorteo no disponible' });
        const sorteo = await SorteoModel.findOne({ where: { link } });
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        } 
        const usuario = UsuarioModel ? await UsuarioModel.findByPk(sorteo.idUsuario) : null;
        const participantes = ParticipanteModel ? await ParticipanteModel.findAll({ where: { idSorteo: sorteo.id } }) : [];

        const nuevoSorteo = {
            id: sorteo.id,
            nombre: sorteo.nombre,
            fecha: sorteo.fecha,
            estado: sorteo.estado,
            link: sorteo.link || sorteo.linkAcceso,
            usuario: usuario ? (usuario.nombre || usuario.username) : null,
            participantes
        };
        res.status(200).json(nuevoSorteo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el sorteo' });
    }
};


exports.shareSorteoLink = async (req, res) => {
    const { id } = req.params;
    try {
        if (!SorteoModel) return res.status(500).json({ error: 'Modelo Sorteo no disponible' });
        const sorteo = await SorteoModel.findOne({ where: { id } });
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }
        const link = sorteo.link || sorteo.linkAcceso;
        const host = req.get('host');
        const fullLink = `http://${host}/sorteos/${link}`;
        res.status(200).json({ message: 'Link del sorteo compartido', link: fullLink });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al compartir el link del sorteo' });
    }
};


exports.updateSorteo = async (req, res) => {
    const { link } = req.params;
    const { nombre, fecha } = req.body;
    try {
        if (!SorteoModel) return res.status(500).json({ error: 'Modelo Sorteo no disponible' });
        const sorteo = await SorteoModel.findOne({ where: { link } });
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }

        sorteo.nombre = nombre;
        sorteo.fecha = fecha;
        await sorteo.save();

        res.status(200).json({ message: 'Sorteo actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el sorteo' });
    }
};

exports.habilitarSorteo = async (req, res) => {
    const { link } = req.params;
    try {
        if (!SorteoModel) return res.status(500).json({ error: 'Modelo Sorteo no disponible' });
        const sorteo = await SorteoModel.findOne({ where: { link } });
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }
        sorteo.estado = true;
        await sorteo.save();

        res.status(200).json({ message: 'Sorteo habilitado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al habilitar el sorteo' });
    }
};

exports.desHabilitarSorteo = async (req, res) => {
    const { link } = req.params;
    try {
        if (!SorteoModel) return res.status(500).json({ error: 'Modelo Sorteo no disponible' });
        const sorteo = await SorteoModel.findOne({ where: { link } });
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }

        sorteo.estado = false;
        await sorteo.save();

        res.status(200).json({ message: 'Sorteo deshabilitado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al deshabilitar el sorteo' });
    }
};

exports.deleteSorteo = async (req, res) => {
    const { link } = req.params;

    try {
        if (!SorteoModel) return res.status(500).json({ error: 'Modelo Sorteo no disponible' });
        const sorteo = await SorteoModel.findOne({ where: { link } });
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }

        await SorteoModel.destroy({ where: { link } });
        res.status(200).json({ message: 'Sorteo eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el sorteo' });
    }
};
