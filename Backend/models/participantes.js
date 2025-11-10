const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Participante = sequelize.define(
        'Participante',
        {
            nombre: {
                type: DataTypes.STRING(120),
                allowNull: false,
            },
            identificadorUnico: {
                type: DataTypes.STRING(64),
                allowNull: true
            },
            identificado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            idParticipanteAsignado: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            linkParticipante: {
                type: DataTypes.STRING(200),
                allowNull: true,
                unique: true
            },
            idSorteo: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }
    );
    return Participante;
};
