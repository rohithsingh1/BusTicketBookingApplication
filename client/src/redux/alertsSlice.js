import { createSlice } from '@reduxjs/toolkit'


// createSlice accepts object as argument
//createSlice is a higher order function that accepts an initial state, 
//an object full of reducer functions and a slice name. 
//It automatically generates action creators and action types that correspond to the reducers key-names

//Within createSlice, synchronous requests made to the store are handled in the reducers object 
//while extraReducers handles asynchronous requests.
const alertsSlice = createSlice({
    // name assigned to redux state
    name : 'alerts',
    // initialstate of the redux state
    initialState:{
        loading : false
    },
    reducers:{
        // here function/action creator with name => 'ordered' is created automatically
        ShowLoading : (state,action)=>{
            state.loading = true
        },
        // here function/action creator with name => 'restocked' is created automatically
        HideLoading : (state,action)=>{
            state.loading = false
        }
    }
})

// this module exports reducer function 
//Reducer function internally takes initialstate of redux as first argument 
//and action is of function/action creater as second argument
export default alertsSlice.reducer

//Action creators for the types of actions that are handled by the slice reducer.
// this module exports action creators i.e ordered , restocked function creators are exported
export const {ShowLoading,HideLoading} = alertsSlice.actions









