import { useState } from 'react';

/*
const {formData, errors, handleChange, handleSubmit} = useForm(
    {email: 'adsadasd@gmail.com', password: 'asdfdsfasdf'},
    async (formData) => {
        await handleLogin(formData.email, formData.password);
    }
);
 */

export const useForm = (initialValues, onSubmit) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        onSubmit(formData);
    };

    const setFieldError = (fieldName, errorMsg) => {
        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldName]: errorMsg
        }));
    };

    return {
        formData,
        errors,
        handleChange,
        handleSubmit,
        setFieldError,
    };
};
