import "@/styles/globals.css";
import "../styles/globals.css";
import type {AppProps} from "next/app";
import {Provider} from "react-redux";
import {store} from "@/utils/redux/store";
import {ThemeProvider} from '@mui/material/styles';
import theme from "@/utils/mui/theme";
import Navbar from "@/modules/shared/components/Navbar";
import {Box} from "@mui/material";
import {useDrawer} from "@/modules/shared/hooks/useDrawer";

export default function App({Component, pageProps}: AppProps) {
    const {toggleDrawer, CustomDrawer} = useDrawer()

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                {CustomDrawer}
                <Navbar openDrawer={toggleDrawer}/>
                <Box bgcolor={"background.default"} sx={{height: '100dvw'}}>
                    <Component {...pageProps} />
                </Box>
            </ThemeProvider>
        </Provider>
    );
}
