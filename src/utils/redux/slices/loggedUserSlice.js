import {createSlice} from "@reduxjs/toolkit";

const loggedUserSlice = createSlice({
    name: 'loggedUser',
    initialState: null,
    reducers: {
        setLoggedUser: (state, action) => {
            return action.payload;
        },
        removeLoggedUser: () => {
            return null
        }
    }
})
export const {setLoggedUser, removeLoggedUser} = loggedUserSlice.actions
export default loggedUserSlice.reducer;