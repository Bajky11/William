import React from 'react';
import {TextField, Button, Container, Typography, Stack} from '@mui/material';
import { useRegister } from './hooks/useRegister';
import { useForm} from "@/modules/shared/hooks/useForm";
import {useRouter} from "next/router";

const RegisterPage = () => {
    const router = useRouter();
    const { error, handleRegistration } = useRegister();
    const { formData, errors, handleChange, handleSubmit, setFieldError } = useForm(
        {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        async (formData) => {
            if (formData.password !== formData.confirmPassword) {
                setFieldError('confirmPassword', 'Passwords do not match');
                return;
            }
            await handleRegistration(formData.firstName, formData.lastName, formData.email, formData.password);
        }
    );

    return (
        <Container maxWidth="sm">
            <Stack
                direction={'column'}
                alignItems={'center'}
                gap={2}
                pt={8}
            >
                <Typography variant="h4" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                    />
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
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{ mt: 2 }}
                    >
                        Register
                    </Button>
                </form>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error.message}</Typography>}
                <Stack>
                    <Typography underline={'none'}>Already have an account?</Typography>
                    <Button onClick={() => router.push("/login")}>Log in</Button>
                </Stack>
            </Stack>
        </Container>
    );
};

export default RegisterPage;
