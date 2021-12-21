const TipsRouter = require('express').Router()
const TipController = require('../controllers/tip.controller')

TipsRouter.post('/calculate', TipController.calculate)
TipsRouter.get('/', TipController.analytics)

module.exports = TipsRouter