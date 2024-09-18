import {Drawer, Stack, List, ListItemButton, ListItemText} from "@mui/material";
import {useState} from "react";
import {useRouter} from "next/router";

export function useDrawer() {
    const [open, setOpen] = useState(false);
    const router = useRouter()

    const toggleDrawer = (newOpen) => {
        setOpen(newOpen);
    };

    const menuItems = [
        {name: 'Projects', location: '/projects'}
    ]

    const CustomDrawer = (
        <Drawer open={open} onClose={() => toggleDrawer(false)}>
            <Stack sx={{width: 250}}>
                <List>
                    {
                        menuItems.map(item => {
                            return (
                                <ListItemButton key={item.name} onClick={() => {
                                    router.push(item.location)
                                    toggleDrawer(false)
                                }}>
                                    <ListItemText primary={item.name}/>
                                </ListItemButton>
                            )
                        })
                    }
                </List>
            </Stack>
        </Drawer>
    );

    return {toggleDrawer, CustomDrawer};
}
