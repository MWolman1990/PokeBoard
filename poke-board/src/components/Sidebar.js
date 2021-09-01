import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { setTypes, setFilteredTypes } from '../redux/filterSlice'
import { setPokemon, setPokemonCount } from '../redux/pokemonSlice'

const Sidebar = (props) => {
    const { currentPage, setCurrentPage, doubleOption, setDoubleOption } = props
    const dispatch = useDispatch()
    const types = useSelector(state => state.filter.filters).types
    const filteredTypes = useSelector(state => state.filter.filters).filteredTypes

    useEffect(async () => {
        const results = await axios.get('/api/type', { data: types })
        
        dispatch(setTypes(results.data.results))
    }, [])

    const handleChange = (name) => dispatch(setFilteredTypes(name))
    
    const toggleOption = e => setDoubleOption(!doubleOption)

    useEffect(async () => {
        if (doubleOption === true) {
            const results2 = await axios.post(`/api/type/filtered/onlyboth`, { data: { filteredTypes, offset: ((currentPage*20)-20) } })
            dispatch(setPokemon(results2.data.pokemon))
            dispatch(setPokemonCount(results2.data.count))
            setCurrentPage(1)
        } else {
            const results = await axios.post(`/api/type/filtered`, { data: { filteredTypes, offset: ((currentPage*20)-20) } })
            dispatch(setPokemon(results.data.pokemon))
            dispatch(setPokemonCount(results.data.count))
            setCurrentPage(1)
        }
    }, [filteredTypes, doubleOption])

    return (
        <div className="col-md-2 border-end side overflow-auto container-fluid">
            <div className="typeSection p-3 row">
                {
                    types.length > 0 &&
                    types.map((t, i) => 
                        <div class="form-check form-switch float-left col m-1 flex-wrap">
                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onClick={() => handleChange(t.name)}/>
                            <label class="form-check-label" for="flexSwitchCheckDefault">{t.name}</label>
                        </div>
                    )
                }
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={toggleOption}/>
                    <label class="form-check-label" for="flexCheckDefault">
                        Only show double-types
                    </label>
                </div>
            </div>
            
        </div>
    )
}

export default Sidebar