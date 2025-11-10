const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Sorteo = sequelize.define(
        'Sorteo',
        {
            nombre: {
                type: DataTypes.STRING(120),
                allowNull: false,
            },
            fecha: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            iniciado: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            linkAcceso: {
                type: DataTypes.STRING(200),
                allowNull: false,
                unique: true,
            },
            estado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            link: {
                type: DataTypes.STRING(200),
                allowNull: true,
                unique: true
            },
            idUsuario: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        }
    );
    return Sorteo;
};
