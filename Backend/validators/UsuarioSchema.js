const Joi = require('joi')

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(60).required(),
    password: Joi.string().min(4).max(60).required()
})

module.exports = { loginSchema, registerSchema }
