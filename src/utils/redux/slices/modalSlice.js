import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        open: false,
        ModalBody: 'empty modal',
        heading: '',
        modalProps: {}
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
            state.ModalBody ='empty modal';
            state.heading = '';
            state.modalProps = {};
        }
    }
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
