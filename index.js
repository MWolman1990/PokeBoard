const express = require('express')
const app = express()
const cors = require('cors')
const request = require('request')
require('dotenv').config()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const pokemonRouter = require('./api/pokemon-api')
const typeRouter = require('./api/type-api')
app.use('/api/pokemon', pokemonRouter)
app.use('/api/type', typeRouter)

app.get('/', (req, res) => {
    request.get('https://pokeapi.co/api/v2/type/fire', (err, resp, body) => {
        const parser = JSON.parse(body)
    })
    res.send('Request successful 2')
})

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))