import {Box, IconButton} from "@mui/material";
import React from "react";

export const ActionIcon = ({onClick, IconComponent, ariaLabel}) => {
    return (
        <Box>
            <IconButton size="small" aria-label={ariaLabel} onClick={onClick}>
                <IconComponent fontSize="small"/>
            </IconButton>
        </Box>
    );
};
