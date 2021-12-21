const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    proPic: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String,
        required: true
    }
})
userSchema.pre('save', async function(next){
    const user  = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

userSchema.statics.findByCredentials = async(email, password) => {

    const user = await User.findOne({ email })
    if(user){
        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch){
            return user
        }
    }
    throw new Error("email or password incorrect")
}
const User = mongoose.model('User', userSchema)

module.exports = User