import './App.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setPokemon, setPokemonCount } from './redux/pokemonSlice'
import axios from 'axios'
import PokeCard from './components/PokeCard'
import Pagination from './components/Pagination'
import Sidebar from './components/Sidebar'

function App() {
  const [currentPage, setCurrentPage] = useState(1)
  const [doubleOption, setDoubleOption] = useState(false)
  const [singleOption, setSingleOption] = useState(false)
  const [fetching, setFetching] = useState(true)
  
  const dispatch = useDispatch()
  const displayPokemon = useSelector(state => state.pokemon)['pokemon']
  const pokemonCount = useSelector(state => state.pokemon.count)
  const filteredTypes = useSelector(state => state.filter.filters).filteredTypes
  
  useEffect(() => {
    axios.get('/api/pokemon/all')
    .then(res => {
      dispatch(setPokemon(res.data.pokemon))
      dispatch(setPokemonCount(res.data.count))
      setCurrentPage(1)
    })
    .catch(err => console.log(err))
  }, [dispatch])

  const changePage = async (pageNum) => {
      setCurrentPage(pageNum)
      setFetching(true)
  }

  useEffect(async () => {
    console.log(currentPage, fetching)
    const zeroFilter = ((currentPage*20)-20)
    if (doubleOption) {
      const doubleOptionResponse = await axios.post(`/api/type/filtered/onlyboth`, { data: { filteredTypes, offset: zeroFilter } })

      dispatch(setPokemon(doubleOptionResponse.data.pokemon))
      dispatch(setPokemonCount(doubleOptionResponse.data.count))
      setFetching(false)
    } else if (singleOption) {
      let singleOptionResponse = await axios.post(`/api/type/filtered/onlyonetype`, { data: { filteredTypes, offset: zeroFilter } })
      console.log(singleOptionResponse)
      dispatch(setPokemon(singleOptionResponse.data.pokeData))
      dispatch(setPokemonCount(singleOptionResponse.data.count))
      setFetching(false)
    } else {
      const noOptionResponse = await axios.post(`/api/type/filtered`, { data: { filteredTypes, offset: zeroFilter } })

      dispatch(setPokemon(noOptionResponse.data.pokemon))
      dispatch(setPokemonCount(noOptionResponse.data.count))
      setFetching(false)
    }
  }, [currentPage])

  const parentSingleOptions = async () => {
    console.log('this ran')
    setFetching(true)
    if (doubleOption) {
      const apiCall2 = await axios.post(`/api/type/filtered/onlyboth`, { data: { filteredTypes, offset: ((currentPage*20)-20) } })
      dispatch(setPokemon(apiCall2.data.pokemon))
      dispatch(setPokemonCount(apiCall2.data.count))
      setCurrentPage(currentPage)
      setFetching(false)
    } else if (singleOption && filteredTypes.length > 0) {
      setCurrentPage(currentPage)
      setFetching(false)
    } else {
      const apiCall1 = await axios.post(`/api/type/filtered`, { data: { filteredTypes, offset: ((currentPage*20)-20) } })
      dispatch(setPokemon(apiCall1.data.pokemon))
      dispatch(setPokemonCount(apiCall1.data.count))
      setCurrentPage(currentPage)
      setFetching(false)
    }
  }

  return (
    <div className="App container-fluid">
      <div className="row header-row border-bottom">
        <div className="col bg-light">
          <nav className="navbar navbar-expand-md navbar-light bg-light">
            <div className="container-fluid">
              <span className="navbar-brand">PokeBoard</span>
            </div>
          </nav>
        </div>
      </div>
      <div className="main row">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          doubleOption={doubleOption} 
          setDoubleOption={setDoubleOption}
          singleOption={singleOption}
          setSingleOption={setSingleOption}
          parentSingleOptions={parentSingleOptions}
        />
        <div className="col-md-10 display-container p-0">
          <div className="main-display overflow-auto center d-flex flex-wrap p-3">
            {
              fetching && displayPokemon ? 
              <div className="fixed-5050">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div> : displayPokemon.length > 0 &&
              displayPokemon.map((pokeData, i) => <PokeCard key={pokeData.id} data={pokeData} currentPage={currentPage}></PokeCard>)
            }
            <div className="card my-3 invisible">
                <div className="card-body">
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
          </div>
          <div className="pagination-bar d-flex overflow-auto border-top">
            <Pagination pokemonCount={pokemonCount} changePage={changePage} currentPage={currentPage} doubleOption={doubleOption}/>
          </div>
        </div>
      </div>
      <div className="row header-row border-top">
        <nav className="navbar navbar-expand-md navbar-light bg-light">
            <div className="container-fluid justify-content-end">
              <span className="">CodeToad</span>
            </div>
          </nav>
      </div>
    </div>
  );
}

export default App;
