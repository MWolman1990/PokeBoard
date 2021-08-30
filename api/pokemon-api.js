const express = require('express')
const router = express.Router()
const request = require('request')
const axios = require('axios')

router.get('/all', (req, res) => {
    request.get('https://pokeapi.co/api/v2/pokemon', (err, resp, body) => {
        const parsed = JSON.parse(body)
        const { results, count } = parsed
        const pokeUrls = results.map(e => axios.get(e.url))
        
        axios.all(pokeUrls)
            .then(con => {
                const arr = con.map(item => item.data)
                res.send({ pokemon: arr, count })
            })
            .catch(err => console.log(err))
    })
})

router.get('/', (req, res) => {
    const { offset } = req.query
    const convert = Number(offset)
    const totalOffset = (Number(offset) * 20) - 20
    
    axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${totalOffset}`)
        .then(response => {
            const { data } = response
            const { results } = data
            const pokeUrls = results.map(e => axios.get(e.url))
        
            axios.all(pokeUrls)
                .then(con => {
                    const arr = con.map(item => item.data)

                    res.send({ pokemon: arr })
                })
                .catch(err => res.send(err))
        })
        .catch(err => res.send(err))
})

module.exports = router