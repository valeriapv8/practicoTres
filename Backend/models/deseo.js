const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Deseo = sequelize.define(
        'Deseo',
        {
            texto: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            wishlist: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            idParticipante: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }
    );
    return Deseo;
};
