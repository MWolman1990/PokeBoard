import { createSlice } from '@reduxjs/toolkit'

export const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState: {
        pokemon: [],
        count: 0
    },
    reducers: {
        setPokemon: (state, action) => {
            state.pokemon = action.payload
        },
        setPokemonCount: (state, action) => {
            state.count = action.payload
        }
    }
})

export const { setPokemon, setPokemonCount } = pokemonSlice.actions

export default pokemonSlice.reducer