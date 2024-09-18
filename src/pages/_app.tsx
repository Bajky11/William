import "@/styles/globals.css";
import "../styles/globals.css";
import type {AppProps} from "next/app";
import {Provider} from "react-redux";
import {store} from "../utils/redux/store";
import {ThemeProvider} from '@mui/material/styles';
import theme from "@/utils/mui/theme";
import Navbar from "@/modules/shared/components/Navbar";
import {Box} from "@mui/material";

export default function App({Component, pageProps}: AppProps) {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Navbar/>
                <Box bgcolor={"background.default"} sx={{height: '100dvw'}}>
                    <Component {...pageProps} />
                </Box>
            </ThemeProvider>
        </Provider>
    );
}
