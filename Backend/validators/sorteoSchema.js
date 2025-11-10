const Joi = require("joi");

const sorteoSchema = Joi.object({
    nombre: Joi.string().required(),
    fecha: Joi.date().required(),
});

module.exports = { sorteoSchema };
