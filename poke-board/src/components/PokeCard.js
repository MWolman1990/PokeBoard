import { useSelector } from 'react-redux'
import './PokeCard.css'
import { useEffect, useState } from 'react'

const PokeCard = (props) => {
    const [imgUrl, setImgUrl] = useState('')
    const { name, sprites } = props.data
    
    const goShiny = () => {
        setImgUrl(sprites.front_shiny)
    }

    const goDefault = () => {
        setImgUrl(sprites.front_default)
    }

    return (
        <div className="card my-3">
            <img src={`${imgUrl !== '' ? imgUrl : sprites.front_default}`} className="card-img-top" alt="..." onMouseOver={goShiny} onMouseOut={goDefault}/>
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
            </div>
        </div>
    )
}

export default PokeCard