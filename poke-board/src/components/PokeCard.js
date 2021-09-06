import { useSelector } from 'react-redux'
import './PokeCard.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import fireLogo from '../resources/type-icons/fire.svg'
import typeImgs from '../resources/typeIconExport'

const PokeCard = (props) => {
    const [imgUrl, setImgUrl] = useState('')
    const [typeRelations, setTypeRelations] = useState({})
    const { name, sprites, stats, id, types } = props.data

    const goShiny = () => {
        setImgUrl(sprites.front_shiny)
    }

    const goDefault = () => {
        setImgUrl(sprites.front_default)
    }

    useEffect(() => {
        axios.get(`/api/type/calculate/relations/${id}`)
            .then(res => setTypeRelations(res.data))
            .catch(err => console.log(err))
    }, [axios])
    
    const transformRelationLabel = (label) => {
        switch (label) {
            case 'superStrong':
                return 'super strong'
            case 'superWeak':
                return 'super weak'
            case 'noDamage':
                return 'immune to'
            case
                'strong',
                'weak',
                'even':
                    return label
            default:
                return label
        }

    }

    return (
        <div className="card my-3 align-self-start">
            <img src={`${imgUrl !== '' ? imgUrl : sprites.front_default}`} className="card-img-top" alt="..." onMouseOver={goShiny} onMouseOut={goDefault}/>
            <div className="card-body">
                <h4 className="card-title display-6 mb-3">{name}</h4>
                <div className="d-flex">
                    {
                        types.length > 0 &&
                        types.map(ty => 
                            <div className={`circle-container box-50px ${ty.type.name}-bg me-3`}>
                                <img className={`${ty.type.name}-bg box-60pct`} src={typeImgs[`${ty.type.name}`]} alt={`${ty.type.name}`} title={`${ty.type.name}`}/>    
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="accordion" id={`accordionExample${id}`}>
                    <div className="accordion-item">
                        <h4 className="accordion-header" id={`headingOne${id}`}>
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseOne${id}`} aria-expanded="false" aria-controls={`collapseOne${id}`}>stats</button>
                        </h4>
                        <div id={`collapseOne${id}`} className="accordion-collapse collapse p-3" aria-labelledby={`headingOne${id}`} data-bs-parent={`#accordionExample${id}`}>
                            <table className="table">
                                <tbody>
                                    {
                                        stats.map(stat =>
                                            <tr>
                                                <td width="50%">{stat.stat.name.replace("-", " ")}</td>
                                                <td className="text-start">{stat.base_stat}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h4 className="accordion-header" id={`typeAdvantadgeHeading${id}`}>
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#typeAdvantadgeBody${id}`} aria-expanded="false" aria-controls={`typeAdvantadgeBody${id}`}>type advantadges</button>
                        </h4>
                        <div id={`typeAdvantadgeBody${id}`} className="accordion-collapse collapse p-3" aria-labelledby={`typeAdvantadgeHeading${id}`} data-bs-parent={`#accordionExample${id}`}>
                            <table className="table" width="100%">
                                <tbody>
                                    {
                                        Object.keys(typeRelations).length > 0 && 
                                        Object.keys(typeRelations).map(key =>
                                            <tr>
                                                <td width="50%">{transformRelationLabel(key)}</td>
                                                <td width ="50%">
                                                    <div className="d-flex space-evenly flex-wrap">
                                                        {
                                                            typeRelations[key].map(t => 
                                                                <div className={`circle-container box-30px ${t}-bg m-2`}>
                                                                    <img 
                                                                        className={`${t}-bg box-60pct`} 
                                                                        src={typeImgs[`${t}`]} 
                                                                        alt={`${t}`} 
                                                                        title={`${t}`}
                                                                    />
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default PokeCard