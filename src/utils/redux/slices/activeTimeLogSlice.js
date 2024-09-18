import {createSlice} from "@reduxjs/toolkit";

const activeTimeLog = createSlice({
    name: 'activeTimeLog',
    initialState: null,
    reducers: {
        setActiveTimeLog: (state, action) => {
            return action.payload;
        },
        removeActiveTimeLog: () => {
            return null
        },
        setTimeLogState:(state, action) => {

        }
    }
})
export const {setLoggedUser, removeLoggedUser} = loggedUserSlice.actions
export default loggedUserSlice.reducer;