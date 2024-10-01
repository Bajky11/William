import { Box, IconButton } from "@mui/material";
import React from "react";

export const ActionIcon = ({ onClick, IconComponent, ariaLabel, color }) => {
    return (
        <Box>
            <IconButton
                size="small"
                aria-label={ariaLabel}
                onClick={onClick}
                sx={{ color: color || '#000' }}
            >
                <IconComponent fontSize="small" />
            </IconButton>
        </Box>
    );
};
