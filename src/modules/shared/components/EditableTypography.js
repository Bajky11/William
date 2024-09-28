import {Box, IconButton, Stack, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {ActionIcon} from "@/modules/shared/components/ActionIcon";
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

export function EditableTypography({text, onEditSave}) {
    const [newText, setNewText] = useState(text);
    const [editMode, setEditMode] = useState(false)

    return (
        !editMode ? (
            <Stack direction={"row"}>
                <Typography>{text}</Typography>
                <Box>
                    <ActionIcon
                        IconComponent={EditRoundedIcon}
                        onClick={() => setEditMode(true)}
                    />
                </Box>
            </Stack>
        ) : (
            <Stack width={'100%'}>
                <TextField
                    fullWidth
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    multiline
                    rows={2}
                    variant="outlined"
                />
                <Stack gap={1} direction={"row"}>
                    <ActionIcon
                        IconComponent={SaveRoundedIcon}
                        onClick={() => onEditSave(newText)}
                    />
                    <ActionIcon
                        IconComponent={CancelRoundedIcon}
                        onClick={() => setEditMode(false)}
                    />
                </Stack>
            </Stack>
        )
    )
}