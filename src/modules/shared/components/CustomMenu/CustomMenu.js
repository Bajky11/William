import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { useState } from "react";

export default function CustomMenu({ menuItems }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleMenuItemClick = (event, onClick) => {
        onClick(event);  // Volání původní onClick funkce
        handleClose(event);  // Zavření menu
    };

    return (
        <div>
            <IconButton onClick={handleClick}>
                <MoreVertRoundedIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems.map((menuItem, index) => (
                    <MenuItem
                        key={index}
                        onClick={(event) => handleMenuItemClick(event, menuItem.onClick)}
                    >
                        {menuItem.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}