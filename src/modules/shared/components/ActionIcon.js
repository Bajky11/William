import {Box, IconButton} from "@mui/material";
import React from "react";

export const ActionIcon = ({onClick, IconComponent, ariaLabel, white}) => {
    return (
        <Box>
            <IconButton color={white ? 'white' : 'black'} size="small" aria-label={ariaLabel} onClick={onClick}>
                <IconComponent fontSize="small" />
            </IconButton>
        </Box>
    );
};
