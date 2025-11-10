const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Usuario = sequelize.define(
        'Usuario',
        {
            username: {
                type: DataTypes.STRING(60),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(120),
                allowNull: false,
            },
        }
    );
    return Usuario;
};
