const UserRouter = require('express').Router()
const UserController = require('../controllers/user.controller')

UserRouter.post("/signup", UserController.register)
UserRouter.post("/login", UserController.login)

module.exports = UserRouter