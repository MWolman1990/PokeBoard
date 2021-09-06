const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const path = require('path')
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const pokemonRouter = require('./api/pokemon-api')
const typeRouter = require('./api/type-api')
app.use('/api/pokemon', pokemonRouter)
app.use('/api/type', typeRouter)
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'poke-board/build')));
        
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'poke-board/build', 'index.html'));
    });
}
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))