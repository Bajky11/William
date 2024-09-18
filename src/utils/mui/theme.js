import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#000000', // Černá
        },
        secondary: {
            main: '#dc004e', // Růžová
        },
        error: {
            main: '#f44336', // Červená
        },
        warning: {
            main: '#ffa726', // Oranžová
        },
        info: {
            main: '#2196f3', // Modrá
        },
        success: {
            main: '#4caf50', // Zelená
        },
        background: {
            default: '#f5f5f5', // Světle šedá pro pozadí
        },
        text: {
            main: '#212121', // Tmavě šedá pro text
            secondary: '#757575', // Světlejší šedá pro vedlejší text
            white: '#ffffff', // Bíla
            action: '#1565c0'
        },
        action: {
            main: '#1565c0' // Tmavší modrá pro akce
        },
        white:{
            main: '#ffffff' // Bílá
        },
    },
    typography: {
        fontSize: 14, // Základní velikost písma

        // Breakpointy pro různá zařízení (mobil vs. desktop)
        h1: {
            fontSize: '2.25rem', // Na mobilu
            '@media (min-width:600px)': {
                fontSize: '3rem', // Na desktopu
            },
        },
        h2: {
            fontSize: '1.75rem', // Na mobilu
            '@media (min-width:600px)': {
                fontSize: '2.5rem', // Na desktopu
            },
        },
        body1: {
            fontSize: '1rem', // Běžný text na mobilu
            '@media (min-width:600px)': {
                fontSize: '1.125rem', // Na desktopu
            },
        },
        button: {
            fontSize: '0.875rem', // Tlačítka na mobilu
            '@media (min-width:600px)': {
                fontSize: '1rem', // Tlačítka na desktopu
            },
            textTransform: 'none', // Zamezení automatického velkého písma na tlačítkách
        },
        textField: {
            fontSize: '1rem', // TextField velikost písma na mobilu
            '@media (min-width:600px)': {
                fontSize: '1.125rem', // Na desktopu
            },
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    fontSize: '1rem', // TextField specifické přepsání
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: '0.875rem', // Tlačítka specifické přepsání
                },
            },
        },
    },
});

export default theme;
