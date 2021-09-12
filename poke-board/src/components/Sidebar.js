import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { setTypes, setFilteredTypes, setNameSearch } from '../redux/filterSlice'
import { setPokemon, setPokemonCount } from '../redux/pokemonSlice'
import { v4 as uuidv4 } from 'uuid'

const Sidebar = (props) => {
    const { 
        currentPage, 
        setCurrentPage, 
        doubleOption, 
        setDoubleOption, 
        singleOption, 
        setSingleOption 
    } = props
    const dispatch = useDispatch()
    const types = useSelector(state => state.filter.filters).types
    const filteredTypes = useSelector(state => state.filter.filters).filteredTypes
    const nameFilter = useSelector(state => state.filter.filters.nameSearch)

    useEffect(() => {
        async function getData() {
            const results = await axios.get('/api/type', { data: types })
        
            dispatch(setTypes(results.data.results))
        }
        getData()
    }, [])

    const handleChange = (name) => {
        console.log(name)
        dispatch(setFilteredTypes(name))
    }
    
    const toggleOption = e => {
        setDoubleOption(!doubleOption)
    }

    const toggleSingleOption = e => {
        setSingleOption(!singleOption)
    }

    useEffect(async () => {
        if (doubleOption === true) {
            const results2 = await axios.post(`/api/type/filtered/onlyboth`, { data: { filteredTypes, offset: ((currentPage*20)-20) } })
            dispatch(setPokemon(results2.data.pokemon))
            dispatch(setPokemonCount(results2.data.count))
            setCurrentPage(currentPage)
        } else if (singleOption === true && filteredTypes.length === 1) {
            const apiCall3 = await axios.post(`/api/type/filtered/onlyonetype`, { data: { filteredTypes, offset: ((currentPage*20)-20) } })
            dispatch(setPokemon(apiCall3.data.pokeData))
            dispatch(setPokemonCount(apiCall3.data.count))
            setCurrentPage(currentPage)
            console.log('Sidebar.js, 55')
        } else if (singleOption === true && filteredTypes.length === 0) {
            const apiCall4 = await axios.post(`/api/type/filtered/onlyonetype`, { data: { filteredTypes, offset: ((currentPage*20)-20) } })
            dispatch(setPokemon(apiCall4.data.pokeData))
            dispatch(setPokemonCount(apiCall4.data.count))
            setCurrentPage(currentPage)
            console.log('Sidebar.js, 61')
        } else {
            const results = await axios.post(`/api/type/filtered`, { data: { filteredTypes, offset: ((currentPage*20)-20) } })
            dispatch(setPokemon(results.data.pokemon))
            dispatch(setPokemonCount(results.data.count))
            setCurrentPage(currentPage)
        }
    }, [doubleOption, singleOption, filteredTypes])

    const searchByNameChange = (e) => {
        dispatch(setNameSearch(e.target.value))
    }

    useEffect(async () => {

        const resp = await axios.post('/api/pokemon/searchbyname', { nameFilter, offset: ((currentPage*20)-20) })
        console.log(resp.data.finalPokeData)
        dispatch(setPokemon(resp.data.finalPokeData))
        dispatch(setPokemonCount(resp.data.count))
    }, [nameFilter])

    return (
        <div className="col-md-2 border-end side overflow-auto container-fluid">
            <div className="row nameSection my-3 p-1 d-flex align-items-center justify-content-evenly">
                Search: <input type="text" className="form-control form-control-sm w-60" onChange={searchByNameChange}/>
            </div>
            <div className="typeSection row mb-3 p-1">
                {
                    types.length > 0 &&
                    types.map(t =>
                        <div className="type-item-col" key={t.name}>
                            <div class="form-check form-switch float-left m-1">
                                <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onClick={() => handleChange(t.name)}/>
                                <label class="form-check-label" htmlFor="flexSwitchCheckDefault">{t.name}</label>
                            </div>
                        </div>
                    )
                }
            </div>
            <div className="row mb-3 p-1">
                <div className="col">
                    <div className="form-check m-1">
                            {
                                singleOption ? 
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={toggleOption} disabled/> :
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={toggleOption}/>
                            }
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                Only show double-type pokemon
                            </label>
                    </div>
                </div>
                <div className="col">
                    <div className="form-check m-1">
                        {
                            doubleOption ?
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={toggleSingleOption} disabled/> : 
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={toggleSingleOption}/>
                        }
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Only show single-type pokemon
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar