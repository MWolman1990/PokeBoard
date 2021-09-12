const express = require('express')
const router = express.Router()
const axios = require('axios')

router.post('/filtered/onlyonetype', async (req, res) => {
    const { data } = req.body
    const { filteredTypes, offset } = data
    console.log('made it', filteredTypes, offset)
    try {
        const targetType = filteredTypes[0]
        const allTypeCalls = new Array(18)
        .fill(0)
        .map((e, i) =>
            axios.get(`https://pokeapi.co/api/v2/type/${i+1}/`)
        )
        const execAllTypeCalls = await axios.all(allTypeCalls)
        const typeObj = {}
        const targetTypeArray = []
        const allOtherTypes = []

        // Create object that has every pokemon and the amount of times they occur
        // Trying to get names of pokemon that only have 1 type

        const nameCount = {}
        const singleNoFilter = []

        execAllTypeCalls.forEach(r => {
            const pokeNames = r.data.pokemon.map(p => p.pokemon.name)
            typeObj[r.data.name] = r.data.pokemon.map(p => p.pokemon.name)

            pokeNames.forEach(na => {
                nameCount[na] = nameCount[na] || 0
                ++nameCount[na]
            })

            switch (r.data.name) {
                case targetType:
                    targetTypeArray.push(...r.data.pokemon.map(p => p.pokemon.name))
                    break
                default:
                    allOtherTypes.push(...r.data.pokemon.map(p => p.pokemon.name))
                    break
            }
        })
        Object.keys(nameCount).forEach(k => {
            if (nameCount[k] === 1) {
                singleNoFilter.push(k)
            }
        })
        const getPokemon = []
        const finalArray = targetTypeArray.filter(t => allOtherTypes.indexOf(t) === -1)
        let totalPokemonCount

        if (filteredTypes.length === 0) {
            getPokemon.push(...singleNoFilter.splice(offset, 20))
            totalPokemonCount = singleNoFilter.length
        } else {
            getPokemon.push(...finalArray.splice(offset, 20))
            totalPokemonCount = finalArray.length
        }
        
        const pokeApiCalls = getPokemon.map(n => axios.get(`https://pokeapi.co/api/v2/pokemon/${n}`))
        const callAll = await axios.all(pokeApiCalls)
        const pokeData = callAll.map(e => e.data)
        
        res.send({ pokeData, count: totalPokemonCount })
        // Split into two arrays, the target type array and an array of the pokemon names of all the other types
    } catch (e) {
        console.log(e)
        res.send(e)
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

    const matchedNames = Object.keys(dataMap).filter(e => (dataMap[e] === 2))
    const pokemonCount = matchedNames.length
    const dataBuffer4 = matchedNames.map(el => axios.get(`https://pokeapi.co/api/v2/pokemon/${el}`))
    const limited2 = dataBuffer4.splice(offset, 20)
    const apiCall5 = await axios.all(limited2)
    const mappedData = apiCall5.map(elem => elem.data)

    res.send({ pokemon: mappedData, count: pokemonCount })
})

router.get('/calculate/relations/:id', async (req, res) => {
    const { id } = req.params
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const { data } = response
    const { types, name } = data
    const apiUrl = types.map(type => type.type.url)
    const proxyCalls = apiUrl.map(url => axios.get(url))
    const typeResponse = await axios.all(proxyCalls)
    const typeData= typeResponse.map(resp => resp.data)
    const damageRelations = typeData.map(item => item.damage_relations)
    const damageFrom = {}
    const combined = new Set()
    
    // console.log(combined, name)
    damageRelations.map(dr => {
        const keys = Object.keys(dr)
        
        keys.forEach(key => {
            if (key.search('from') !== -1) {
                damageFrom[key] = damageFrom[key] || []
                damageFrom[key].push(...dr[key])
            }
        })
    })

    const damageFromKeys = Object.keys(damageFrom)
    
    const convertedToNumbers = {}
    damageFromKeys.forEach(key => {
        if (key === 'double_damage_from') {
            damageFrom[key].forEach(type2 => {
                convertedToNumbers[type2.name] = convertedToNumbers[type2.name] || 1
                convertedToNumbers[type2.name] *= 2
            })
        } else if (key === 'half_damage_from') {
            damageFrom[key].forEach(type2 => {
                convertedToNumbers[type2.name] = convertedToNumbers[type2.name] || 1
                convertedToNumbers[type2.name] *= .5
            })
        } else if (key === 'no_damage_from') {
            damageFrom[key].forEach(type2 => {
                convertedToNumbers[type2.name] = convertedToNumbers[type2.name] || 1
                convertedToNumbers[type2.name] *= 0
            })
        }
        
    })

    const finalResults = {
        superStrong: [],
        strong: [],
        even: [],
        weak: [],
        superWeak: [],
        noDamage: []
    }
    const ctnKeys = Object.keys(convertedToNumbers)

    ctnKeys.forEach(key => {
        switch(convertedToNumbers[key]) {
            case 4:
                finalResults.superWeak.push(key)
                break
            case 2:
                finalResults.weak.push(key)
                break
            case 1:
                finalResults.even.push(key)
                break
            case .5:
                finalResults.strong.push(key)
                break
            case .25:
                finalResults.superStrong.push(key)
                break
            case 0:
                finalResults.noDamage.push(key)
                break
            default:
                break
        }
    })

    res.send(finalResults)
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

router.get('/', async (req, res) => {
    const results = await axios.get('https://pokeapi.co/api/v2/type')
    
    res.send(results.data)
})

module.exports = router