import { configureStore } from '@reduxjs/toolkit'

import alertsSlice from './alertsSlice'
import usersSlice from './usersSlice'



// configureStore accepts object as parameter
const store = configureStore({
    // we can combine multiple reducers in reducers object as key-value pair
    reducer:{
        alerts : alertsSlice,
        users : usersSlice
    },
})


export default store