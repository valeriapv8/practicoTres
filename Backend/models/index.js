const { sequelize } = require('../config/db.config')

const ParticipantesModel = require('./participantes')(sequelize)
const SorteosModel = require('./sorteo')(sequelize)
const UsuarioModel = require('./usuario')(sequelize)
const AuthToken = require('./authToken')(sequelize)
const DeseosModel = require('./deseo')(sequelize)

UsuarioModel.hasMany(AuthToken, { foreignKey: 'idUsuario', as: 'authTokens' })
AuthToken.belongsTo(UsuarioModel, { foreignKey: 'idUsuario', as: 'usuario' })

SorteosModel.belongsTo(UsuarioModel, { foreignKey: 'idUsuario', as: 'usuario' })
UsuarioModel.hasMany(SorteosModel, { foreignKey: 'idUsuario', as: 'sorteos' })

ParticipantesModel.belongsTo(SorteosModel, { foreignKey: 'idSorteo', as: 'sorteo' })
SorteosModel.hasMany(ParticipantesModel, { foreignKey: 'idSorteo', as: 'participantes' })

ParticipantesModel.belongsTo(ParticipantesModel, { as: 'amigoAsignado', foreignKey: 'idParticipanteAsignado' })

ParticipantesModel.hasMany(DeseosModel, { foreignKey: 'idParticipante', as: 'deseos' })
DeseosModel.belongsTo(ParticipantesModel, { foreignKey: 'idParticipante', as: 'participante' })

// --- Asociaciones: ejecutar sólo si `db` ya existe ---
try {
  if (typeof db !== 'undefined' && db) {
    if (db.Usuario && db.Sorteo) {
      db.Usuario.hasMany(db.Sorteo, { foreignKey: 'idUsuario', as: 'sorteos' });
      db.Sorteo.belongsTo(db.Usuario, { foreignKey: 'idUsuario', as: 'usuario' });
    }

    if (db.Sorteo && db.Participante) {
      db.Sorteo.hasMany(db.Participante, { foreignKey: 'idSorteo', as: 'participantes' });
      db.Participante.belongsTo(db.Sorteo, { foreignKey: 'idSorteo', as: 'sorteo' });
    }

    if (db.Participante && db.Deseo) {
      db.Participante.hasMany(db.Deseo, { foreignKey: 'idParticipante', as: 'deseos' });
      db.Deseo.belongsTo(db.Participante, { foreignKey: 'idParticipante', as: 'participante' });
    }

    if (db.Usuario && db.AuthToken) {
      db.Usuario.hasMany(db.AuthToken, { foreignKey: 'idUsuario', as: 'authTokens' });
      db.AuthToken.belongsTo(db.Usuario, { foreignKey: 'idUsuario', as: 'usuario' });
    }
  } else {
    console.warn('Warning: `db` not available to setup associations (models/index.js)');
  }
} catch (e) {
  console.error('Error setting up associations', e);
}

module.exports = {
  ParticipantesModel,
  SorteosModel,
  UsuarioModel,
  authToken: AuthToken,
  DeseosModel,
  sequelize,
  Sequelize: sequelize.Sequelize
}
