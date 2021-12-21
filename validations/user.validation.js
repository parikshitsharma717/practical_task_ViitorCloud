const Joi = require('joi')

const registerValidation = (data) => {
    const registerSchema = Joi.object({
        name: Joi.string()
        .required(),
        email: Joi.string()
        .email()
        .required(),
        password: Joi.string()
        .min(6)
        .required(),
        proPic: Joi.string()
        .required()
    })
    return registerSchema.validate(data)
}
const loginValidation = (data) => {
    const loginSchema = Joi.object({
        email: Joi.string()
        .email()
        .required(),
        password: Joi.string()
        .required()
    })
    return loginSchema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation