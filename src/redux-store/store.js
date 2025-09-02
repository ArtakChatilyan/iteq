import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import filterReducer from './filterSlice'

export default configureStore({
  reducer: {userReducer, filterReducer}
})
