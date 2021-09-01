const express = require('express')
const app = express()
const cors = require('cors')
const request = require('request')
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const pokemonRouter = require('./api/pokemon-api')
const typeRouter = require('./api/type-api')
app.use('/api/pokemon', pokemonRouter)
app.use('/api/type', typeRouter)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))