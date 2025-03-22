import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loadingSlice from "./loadingState";
import userSlice from "./userState";
import doctorSlice from "./doctorState";







const rootReducer = combineReducers({
    loading : loadingSlice.reducer,
    user:userSlice.reducer,
    doctor : doctorSlice.reducer,
})



const reduxStore = configureStore({
    reducer : rootReducer,
})

export default reduxStore;