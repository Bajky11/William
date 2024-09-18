import { useState } from 'react';

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
