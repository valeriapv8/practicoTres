const db = require('../models')

const checkDuplicate = (model, column) => {
    return async (req, res, next) => {
        try {
            if (!model || typeof model.findOne !== 'function') {
                return res.status(500).json({ error: 'Modelo no válido en checkDuplicate' })
            }
            if (!column || !model.rawAttributes || !model.rawAttributes[column]) {
                return res.status(500).json({ error: 'Columna no válida en checkDuplicate' })
            }

            const value = req.body?.[column]
            if (value === undefined || value === null || value === '') {
                return res.status(400).json({ error: `El campo ${column} es obligatorio` })
            }

            const pk = model.primaryKeyAttribute || 'id'

            const duplicate = await model.findOne({
                attributes: [pk],
                where: db.Sequelize.where(
                    db.Sequelize.fn('LOWER', db.Sequelize.col(column)),
                    value.toString().toLowerCase()
                )
            })

            if (duplicate) {
                return res.status(400).json({ error: `El valor del campo ${column} ya existe` })
            }

            next()
        } catch (error) {
            console.error('checkDuplicate error:', error)
            res.status(500).json({ error: 'Error al verificar duplicados' })
        }
    }
}

module.exports = checkDuplicate
