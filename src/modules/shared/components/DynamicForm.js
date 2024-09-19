import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
/*USAGE:

    const fields = [
            {fieldName: 'name', label: 'Project Name', type: 'text', required: true},
            {fieldName: 'description', label: 'Description', type: 'text', required: false},
        ];

    const handleSubmit = async (formData) => {};

     <DynamicForm fields={fields} onSubmit={handleSubmit}/>

 */
export const DynamicForm = ({ fields, onSubmit }) => {
    const [formValues, setFormValues] = useState(
        fields.reduce((acc, field) => {
            acc[field.fieldName] = '';
            return acc;
        }, {})
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formValues);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
                {fields.map((field) => (
                    <TextField
                        key={field.fieldName}
                        name={field.fieldName}
                        label={field.label}
                        type={field.type}
                        value={formValues[field.fieldName]}
                        onChange={handleChange}
                        required={field.required}
                    />
                ))}
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </Box>
        </form>
    );
};