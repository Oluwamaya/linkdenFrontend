import { createSlice } from "@reduxjs/toolkit";

export const findUser = createSlice({
    name:"addfriend",
    initialState:{
        isAdding: false,
        added: [],
        addingError: null 
    },
    reducers:{
        fetchingfriends:(state)=>{
            state.isAdding = true
            state.added = []
            state.addingError = false
        },
        fetchedFriends : (state , action)=>{
            state.isAdding = false
            state.added = action.payload
            state.addingError = false
        },
        fetchingError : (state, action)=>{
            state.isAdding = false
            state.added = []
            state.addingError = action.payload
        }
    }
})
export default findUser.reducer

export const { fetchingfriends,fetchedFriends , fetchingError,} = findUser.actions