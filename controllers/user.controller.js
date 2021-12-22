const User = require("../models/user")
const { isBase64, convertImageToBinary, sendMail } = require("../utils/helper")
const { registerValidation, loginValidation } = require("../validations/user.validation")
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const { error } = registerValidation(req.body)

    if(error){
        res.status(400).json({
            message: error.details[0].message
        })
    }

    try {
        if(!isBase64(req.body.proPic)){
            throw new Error("Invalid proPic")
        }
        const emailExists = await User.findOne({ email: req.body.email })
        if(emailExists){
            throw new Error("User already registered")
        }
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        const result = await convertImageToBinary(req.body.proPic, user._id.toString())
        if(!result){
            throw new Error("Bad Image")
        }
        const token = await jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
        user.proPic = user._id+".jpg"
        user.token = token
        const savedUser = await user.save()
        //await sendMail(user.email, user.name)
        res.status(201).json({
            name: savedUser.name,
            token: savedUser.token
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    const { error } = loginValidation(req.body)

    if(error){
        res.status(400).json({
            message: error.details[0].message
        })
    }
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
        user.token = token
        await user.save()

        res.status(200).json({
            name: user.name,
            token: user.token
        })
        
    } catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
}