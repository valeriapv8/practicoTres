const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const AuthToken = sequelize.define(
        'AuthToken',
        {
            token: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true
            },
            idUsuario: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        }
    );
    return AuthToken;
};
