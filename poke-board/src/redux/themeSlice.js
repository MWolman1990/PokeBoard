import { createSlice } from '@reduxjs/toolkit'

export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        theme: 'light'
    },
    reducers: {
        
        
    }
})

export const { setPokemon, setPokemonCount } = pokemonSlice.actions

export default pokemonSlice.reducer