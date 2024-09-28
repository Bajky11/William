import "@/styles/globals.css";
import "../styles/globals.css";
import type {AppProps} from "next/app";
import {Provider, useDispatch, useSelector} from "react-redux";
import {RootState, store} from "@/utils/redux/store";
import {ThemeProvider} from '@mui/material/styles';
import theme from "@/utils/mui/theme";
import Navbar from "@/modules/shared/components/Navbar";
import {Box, Dialog, DialogContent, Divider, IconButton, Stack, Typography} from "@mui/material";
import {useDrawer} from "@/modules/shared/hooks/useDrawer";
import {closeModal} from "@/utils/redux/slices/modalSlice";
import {DialogHeader} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React from "react";

export default function App({Component, pageProps}: AppProps) {
    const {toggleDrawer, CustomDrawer} = useDrawer()

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                {CustomDrawer}
                <Navbar openDrawer={toggleDrawer}/>
                <Box bgcolor={"background.default"} sx={{height: '100dvw'}}>
                    <Component {...pageProps} />
                    <GlobalModal/>
                </Box>
            </ThemeProvider>
        </Provider>
    );
}

function GlobalModal() {
    const dispatch = useDispatch();
    const modalState = useSelector((state:RootState) => state.modal);

    const handleCloseModal = () => {
        dispatch(closeModal());
    };

    return modalState.open && modalState.ModalBody? (
        <Dialog open={modalState.open}>
            <Box p={4} pt={2}>
                <DialogHeader>
                    <Stack pb={3}>
                        <Stack direction={"row"} alignItems={'center'} justifyContent={'space-between'} pb={1}>
                            <Typography variant={'h5'}>{modalState.heading}</Typography>
                            <IconButton
                                sx={{
                                    position: 'relative',
                                    right: '-12px', // Posun o pár pixelů doprava
                                }}
                                onClick={() => handleCloseModal()}>
                                <CloseRoundedIcon/>
                            </IconButton>
                        </Stack>
                        <Divider/>
                    </Stack>
                </DialogHeader>
                {React.createElement(modalState.ModalBody, { closeModal: handleCloseModal, ...modalState.modalProps })}
            </Box>
        </Dialog>
    ) : null;
}
