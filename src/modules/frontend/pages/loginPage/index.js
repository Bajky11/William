import React from 'react';
import {TextField, Button, Container, Typography, Stack} from '@mui/material';
import {useLogin} from './hooks/useLogin';
import {useForm} from "@/modules/shared/hooks/useForm";
import {useRouter} from "next/router";

const LoginPage = () => {
    const router = useRouter();
    const {error, handleLogin} = useLogin();
    const {formData, errors, handleChange, handleSubmit} = useForm(
        {email: 'lukin.bajer@gmail.com', password: 'tajneHeslo'},
        async (formData) => {
            await handleLogin(formData.email, formData.password);
        }
    );

    return (
        <Container maxWidth="sm">
            <Stack
                direction={'column'}
                alignItems={'center'}
                pt={8}
                gap={2}
            >
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{mt: 2}}
                    >
                        Login
                    </Button>
                </form>
                {error && <Typography color="error" sx={{mt: 2}}>{error.message}</Typography>}
                <Stack>
                    <Typography underline={'none'}>Dont have an account?</Typography>
                    <Button onClick={() => router.push('/register')}>Create account</Button>
                </Stack>
            </Stack>
        </Container>
    );
};

export default LoginPage;
