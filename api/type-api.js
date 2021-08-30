const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/', async (req, res) => {
    const results = await axios.get('https://pokeapi.co/api/v2/type')
    
    res.send(results.data)
})

router.post('/filtered', async (req, res) => {
    const { data } = req.body
    const { filteredTypes, offset } = data
    
    let callArr
    let results
    let allPokemon = []

    if (filteredTypes.length === 0) {
        const apiCall = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`)
        const apiBuffer = apiCall.data.results.map(item => axios.get(item.url))
        const apiCall2 = await axios.all(apiBuffer)
        const dataBuffer = apiCall2.map(item2 => item2.data)
        res.send({ pokemon: dataBuffer, count: apiCall.data.count })
        // res.send({ pokemon: apiCall2})
    } else {
        const apiBuffer2 = filteredTypes.map((e) => axios.get(`https://pokeapi.co/api/v2/type/${e}`))
        const apiCall3 = await axios.all(apiBuffer2)
        const combineArray = []
        Object.keys(apiCall3).map(key => combineArray.push(...apiCall3[key].data.pokemon))
        
        const dataBuffer3 = await combineArray.map(q => axios.get(q.pokemon.url))
        const limited = dataBuffer3.splice(offset, 20)
        const apiCall4 = await axios.all(limited)
        const dataChange = apiCall4.map(item => item.data)
        
        res.send({ pokemon: dataChange, count: dataBuffer3.length })
        
    }
})

router.post('/filtered/onlyboth', async (req, res) => {
    const { data } = req.body
    const { filteredTypes, offset } = data

    const apiBuffer2 = filteredTypes.map((e) => axios.get(`https://pokeapi.co/api/v2/type/${e}`))
    const apiCall3 = await axios.all(apiBuffer2)
    const combineArray = []
    Object.keys(apiCall3).map(key => combineArray.push(...apiCall3[key].data.pokemon))
    
    const dataBuffer3 = await combineArray.map(q => axios.get(q.pokemon.url))
    const justNames = combineArray.map(item => item.pokemon.name)
    
    const dataMap = function (justNames) {
        const obj = {}

        justNames.forEach(name => {
            obj[name] = obj[name] || 0
            ++obj[name]
        })

        return obj
    }(justNames)

    console.log(' ')
    const matchedNames = Object.keys(dataMap).filter(e => (dataMap[e] === 2))
    const pokemonCount = matchedNames.length
    const dataBuffer4 = matchedNames.map(el => axios.get(`https://pokeapi.co/api/v2/pokemon/${el}`))
    const limited2 = dataBuffer4.splice(offset, 20)
    const apiCall5 = await axios.all(limited2)
    const mappedData = apiCall5.map(elem => elem.data)

    res.send({ pokemon: mappedData, count: pokemonCount })
})

module.exports = router