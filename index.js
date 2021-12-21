const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${ PORT }`)
})