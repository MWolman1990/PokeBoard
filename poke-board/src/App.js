import logo from './logo.svg';
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
  const [ doubleOption, setDoubleOption ] = useState(false)
  const dispatch = useDispatch()
  const displayPokemon = useSelector(state => state.pokemon)['pokemon']
  const pokemonCount = useSelector(state => state.pokemon.count)
  const filteredTypes = useSelector(state => state.filter.filters).filteredTypes
  
  useEffect(() => {
    axios.get('/api/pokemon/all')
      .then(res => {
        dispatch(setPokemon(res.data.pokemon))
        dispatch(setPokemonCount(res.data.count))
      })
      .catch(err => console.log(err))
  }, [dispatch])
  
  const changePage = async (pageNum) => {
    setCurrentPage(pageNum)
    if (doubleOption) {
      const apiCall2 = await axios.post(`/api/type/filtered/onlyboth`, { data: { filteredTypes, offset: ((pageNum*20)-20) } })
      dispatch(setPokemon(apiCall2.data.pokemon))
      dispatch(setPokemonCount(apiCall2.data.count))
    } else {
      const apiCall1 = await axios.post(`/api/type/filtered`, { data: { filteredTypes, offset: ((pageNum*20)-20) } })
      
      dispatch(setPokemon(apiCall1.data.pokemon))
      dispatch(setPokemonCount(apiCall1.data.count))
    }
  }

  return (
    <div className="App container-fluid">
      <div className="row header-row border-bottom">
        <div className="col bg-light">
          <nav className="navbar navbar-expand-md navbar-light bg-light">
            <div className="container-fluid">
              <span className="navbar-brand text-primary">PokeBoard</span>
            </div>
          </nav>
        </div>
      </div>
      <div className="main row">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} doubleOption={doubleOption} setDoubleOption={setDoubleOption}/>
        <div className="col-md-10 display-container p-0">
          <div className="main-display overflow-auto center d-flex justify-content-between flex-wrap px-3">
            {
              displayPokemon.length > 0 &&
              displayPokemon.map((pokeData, i) => <PokeCard key={pokeData.id} data={pokeData}></PokeCard>)
            }
            <div className="card my-3 invisible">
                <div className="card-body">
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="btn btn-primary">Go somewhere</a>
                </div>
            </div>
          </div>
          <div className="pagination-bar d-flex align-items-center overflow-auto border-top">
            <Pagination pokemonCount={pokemonCount} changePage={changePage} currentPage={currentPage} doubleOption={doubleOption}/>
          </div>
        </div>
      </div>
      <div className="row header-row border-top">
        <nav className="navbar navbar-expand-md navbar-light bg-light">
            <div className="container-fluid justify-content-end">
              <span className="">CodeToad, LLC.</span>
            </div>
          </nav>
      </div>
    </div>
  );
}

export default App;
