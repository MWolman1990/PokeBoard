import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './filterSlice'
import pokemonReducer from './pokemonSlice'

export default configureStore({
  reducer: {
    filter: filterReducer,
    pokemon: pokemonReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  })
})