const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const Router = require('./routes')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use('/public',express.static(path.join(__dirname, 'public')))
if(process.env.NODE_ENV === 'dev')
app.use(morgan('dev'))
app.use("/", Router)


const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(MONGO_URL, options)
.then(()=> {
    console.log('Database connected successfully')
    app.listen(PORT, () => {
        console.log(`Server running on port ${ PORT }`)
    })
})
.catch((error) => console.log("Database Error: "+error))
