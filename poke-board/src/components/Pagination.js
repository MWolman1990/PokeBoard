import { useState } from 'react'
import './Pagination.css'

const Pagination = (props) => {
    const [pageDisplays, setPageDisplays] = useState()
    const { pokemonCount, changePage, currentPage } = props
    const numOfPages = Math.ceil(pokemonCount / 20)
    const arr = new Array(numOfPages).fill('')
    
    return (
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center m-0 flex-wrap p-3">
                <li class={`page-item ${currentPage===numOfPages-(numOfPages-1) && 'disabled'}`}>
                    <a class="page-link" href="#" tabindex="-1" onClick={() => changePage(currentPage-1)}>Previous</a>
                </li>
                {/* {
                    arr.length > 0 && arr.map((e, i) =>
                        (i+1) >= currentPage-1 &&
                        (i+1) <= currentPage+1 &&
                        <li class={`page-item ${currentPage===i+1 && 'active'}`}>
                            <a class="page-link">
                                {i+1}
                            </a>
                        </li>
                    )
                } */}
                {
                    arr.length > 0 && arr.map((e, i) =>
                        <li class={`page-item ${currentPage===i+1 && 'active'}`} onClick={() => changePage(i+1)}>
                            <a class="page-link">
                                {i+1}
                            </a>
                        </li>
                    )
                }
                <li class={`page-item ${currentPage===numOfPages && 'disabled'}`}>
                    <a class="page-link" href="#" onClick={() => changePage(currentPage+1)}>Next</a>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination