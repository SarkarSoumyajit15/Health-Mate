import { createSlice } from "@reduxjs/toolkit";



const loadingSlice  = createSlice({
    name : 'loading',
    initialState : {loading : false},
    reducers:{
        setLoading : (state)=>{
            state.loading = true;
        },
        unsetLoading : (state)=>{
            state.loading = false;
        },
    }
})


export default loadingSlice;
export const loadingActions = loadingSlice.actions;


