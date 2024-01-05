import { configureStore } from '@reduxjs/toolkit'
import  findUser  from './Slice'
import Userslice from './Userslice'

export default configureStore({
  reducer: {
    findUser,
    Userslice
  }
})