import {IconButton} from "@mui/material";

export function ActionIconButton({Icon, onClick, disabled, color}) {
    return (
        <IconButton
            size={'small'}
            color={color ? color : 'white'}
            onClick={onClick}
            disabled={disabled}
            style={{
                color: disabled ? '#888888' : (color ? color : 'white'),
            }}
        >
            {Icon}
        </IconButton>
    )
}