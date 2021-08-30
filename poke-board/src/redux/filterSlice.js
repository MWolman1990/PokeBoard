import { createSlice } from '@reduxjs/toolkit'

export const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        filters: {
            types: [],
            filteredTypes: []
        }
    },
    reducers: {
        setTypes: (state, action) => {
            state.filters.types = action.payload
        },
        setFilteredTypes: (state, action) => {
            if (state.filters.filteredTypes.indexOf(action.payload) === -1) {
                state.filters.filteredTypes.push(action.payload)
            } else {
                state.filters.filteredTypes = state.filters.filteredTypes.filter(e => e !== action.payload)
            }
        }
    }
})

export const { setTypes, setFilteredTypes } = filterSlice.actions

export default filterSlice.reducer