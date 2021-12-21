const Joi = require('joi').extend(require('@joi/date'))

const calculateValidation = (data) => {
    const calculateSchema = Joi.object({
        place: Joi.string()
        .required(),
        totalAmount: Joi.number()
        .required(),
        tipPercentage: Joi.number()
        .max(100)
        .required()
    })
    return calculateSchema.validate(data)
}

const tipValidation = (data) => {
    const tipSchema = Joi.object({
        analyticsType: Joi.string()
        .valid('tipPercentage','mostVisitedPlaces'),
        startDate: Joi.date()
        .format('DD-MM-YYYY')
        .required(),
        endDate: Joi.date()
        .greater(Joi.ref('startDate'))
        .format('DD-MM-YYYY')
        .required()
    })
    return tipSchema.validate(data)
}
module.exports.calculateValidation = calculateValidation
module.exports.tipValidation = tipValidation