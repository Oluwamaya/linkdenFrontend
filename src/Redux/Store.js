import { configureStore } from '@reduxjs/toolkit'
import  findUser  from './Slice'
import Userslice from './Userslice'
import FriendSlice from './FriendSlice'

export default configureStore({
  reducer: {
    findUser,
    Userslice,
    FriendSlice
    
  }
})