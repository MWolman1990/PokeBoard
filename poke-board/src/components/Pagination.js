import './Pagination.css'
import { v4 as uuidv4 } from 'uuid'

const Pagination = (props) => {
    const { pokemonCount, changePage, currentPage } = props
    const numOfPages = Math.ceil(pokemonCount / 20)
    const arr = new Array(numOfPages).fill('')
    
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center m-0 flex-wrap p-3">
                <li className={`page-item ${currentPage===numOfPages-(numOfPages-1) && 'disabled'}`}>
                    <button className="page-link" tabIndex="-1" onClick={() => changePage(currentPage-1)}>Previous</button>
                </li>
                {
                    arr.length > 0 && arr.map((e, i) =>
                        <li className={`page-item ${currentPage===i+1 && 'active'}`} onClick={() => changePage(i+1)} key={uuidv4()}>
                            <button className="page-link">
                                {i+1}
                            </button>
                        </li>
                    )
                }
                <li className={`page-item ${currentPage===numOfPages && 'disabled'}`}>
                    <button className="page-link" onClick={() => changePage(currentPage+1)}>Next</button>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination