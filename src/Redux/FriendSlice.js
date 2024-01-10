import { createSlice } from "@reduxjs/toolkit";

export const friendSlice = createSlice({
    name: "friendsInfo",
    initialState : {
        isfetching : false,
        allFriend: [],
        isfetchingError : false,
    },
    reducers:{
    isfetchingFriend : (state)=>{
        state.isfetching = true
        state.allFriend=[]
        state.isfetchingError = false
    },
    fetchedAllFriends : (state,action)=>{
        state.isfetching = false
        state.allFriend = action.payload
        state.isfetchingError = false
    },
    fetchingError: (state,action)=>{
     state.isfetching = false
     state.allFriend = []
     state.isfetchingError = action.payload
    }
    }
})
export default friendSlice.reducer
export const  {isfetchingFriend, fetchedAllFriends, fetchingError } = friendSlice.actions