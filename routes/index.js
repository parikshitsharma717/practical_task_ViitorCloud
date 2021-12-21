const Router = require('express').Router()
const UserRouter = require('./user.routes')
const TipsRouter = require('./tips.routes')
const checkJwt = require('../middlewares/checkJwt')

Router.use("/user", UserRouter)
Router.use("/tip", checkJwt ,TipsRouter)

Router.use((req, res, next) => {
    const error = new Error("Not Found")
    error.status = 404
    next(error)
})

Router.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        message: error.message
    })
})

module.exports = Router