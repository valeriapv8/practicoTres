const Joi = require("joi");

const participanteSchema = Joi.object({
    nombre: Joi.string().min(2).max(120).required(),
});

const deseoSchema = Joi.object({
    texto: Joi.string().min(1).max(500).required(),
});

module.exports = { participanteSchema, deseoSchema };
