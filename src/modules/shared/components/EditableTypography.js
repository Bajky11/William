import {Box, IconButton, Stack, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {ActionIcon} from "@/modules/shared/components/ActionIcon";
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import {styled} from "@mui/material/styles";


const ColoredTextField = styled(TextField)(({theme, textColor, borderColor}) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: borderColor || '#ff0000', // Výchozí barva okraje
        },
        '&:hover fieldset': {
            borderColor: borderColor || '#00ff00', // Barva při hoveru
        },
        '&.Mui-focused fieldset': {
            borderColor: borderColor || '#0000ff', // Barva okraje při focusu
        },
    },
    '& .MuiInputBase-input': {
        color: textColor || '#000', // Barva textu
    },
    '& .MuiInputLabel-root': {
        color: textColor || '#000', // Barva labelu
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: borderColor || '#0000ff', // Barva labelu při focusu
    }
}));

export function EditableTypography({text, variant = 'body1', onEditSave, textColor, iconColor}) {
    const [newText, setNewText] = useState(text);
    const [editMode, setEditMode] = useState(false)

    return (
        !editMode ? (
            <Stack direction={"row"} alignItems={'center'} spacing={1}>
                <Typography color={textColor ? textColor : '#000'} variant={variant}>{text}</Typography>
                <Box>
                    <ActionIcon
                        IconComponent={EditRoundedIcon}
                        onClick={() => setEditMode(true)}
                        color={iconColor}
                    />
                </Box>
            </Stack>
        ) : (
            <Stack width={'100%'}>
                <ColoredTextField
                    fullWidth
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    multiline
                    rows={1}
                    variant="outlined"
                    textColor="#fff" // Dynamická barva textu
                    borderColor="#fff" // Dynamická barva okraje
                />
                <Stack gap={1} direction={"row"}>
                    <ActionIcon
                        IconComponent={SaveRoundedIcon}
                        onClick={() => {
                            onEditSave(newText)
                            setEditMode(false);
                        }}
                        color={iconColor}
                    />
                    <ActionIcon
                        IconComponent={CancelRoundedIcon}
                        onClick={() => setEditMode(false)}
                        color={iconColor}
                    />
                </Stack>
            </Stack>
        )
    )
}