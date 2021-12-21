const jwt = require('jsonwebtoken')
const User = require('../models/user')

const checkJwt = async (req, res, next) => {
    try {
        let token = req.header('Authorization')
        if (token) {
            token = token.replace('Bearer ', '')
        } else {
            throw new Error()
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decode._id, token: token })
        if(!user){
            throw new Error()
        }
        req.user = user
        next()
        
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
}

module.exports = checkJwt