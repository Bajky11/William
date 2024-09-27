import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        open: false,
        ModalBody: null,
        heading: null,
        modalProps: null
    },
    reducers: {
        openModal: (state, action) => {
            state.open = true;
            state.ModalBody = action.payload.ModalBody;
            state.heading = action.payload.heading;
            state.modalProps = action.payload.modalProps;
        },
        closeModal: (state) => {
            state.open = false;
            state.ModalBody = null;
            state.heading = null;
            state.modalProps = null;
        }
    }
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
