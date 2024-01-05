import { createSlice } from "@reduxjs/toolkit";
import User from "../Component/User";

export const userSlice = createSlice({
    name : "UserInfo",
    initialState :{
    isUpdating : false,
    User:{},
    userError: false
    },
    reducers:{
     isFetchingUser : (state)=>{
       state.isUpdating = true
        state.User = {}
        state.userError = false
     },
     fetchedUser :(state, action)=>{
        state.isUpdating = false
        state.User = action.payload
        state.userError = false
     },
     fetchingError: (state, action)=>{
        state.isUpdating = false
        state.User = {}
        state.userError = action.payload
     }
    }
}) 
export default userSlice.reducer
export const {isFetchingUser, fetchedUser, fetchingError} = userSlice.actions