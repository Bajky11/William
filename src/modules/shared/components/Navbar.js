import {Avatar, IconButton, Stack, Typography} from "@mui/material";
import {useRouter} from "next/router";
import LogoutIcon from '@mui/icons-material/Logout';
import {useSelector} from "react-redux";
import {useLogout} from "@/modules/frontend/pages/loginPage/hooks/useLogout";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

export default function Navbar({openDrawer}) {
    const router = useRouter()
    const loggedUser = useSelector(state => state.loggedUser);
    const {handleLogout} = useLogout();

    return (
        <Stack bgcolor={'black'} p={1} justifyContent={'space-between'} alignItems={'center'} direction={'row'}>
            <Stack direction={'row'} alignItems={'center'} gap={1}>
                <Stack direction={'row'} alignItems={'center'} gap={1} onClick={() => router.push('/')}>

                    <Logo/>
                    <Typography color={"text.white"}>William</Typography>
                </Stack>
                {
                    loggedUser && (
                        <IconButton color={"white"} onClick={() => openDrawer(true)}>
                            <MenuRoundedIcon/>
                        </IconButton>
                    )
                }
            </Stack>
            <Stack direction={"row"}>
                {
                    loggedUser && (
                        <Stack gap={1} direction={'row'} alignItems={'center'}>
                            <Typography color={"text.white"}>{loggedUser.name}</Typography>
                            <Avatar sx={{width: 32, height: 32}}/>
                            <IconButton color={"white"} onClick={() => handleLogout()}><LogoutIcon/></IconButton>
                        </Stack>
                    )
                }
                <IconButton color={"white"} onClick={() => handleLogout()}><LogoutIcon/></IconButton>
            </Stack>
        </Stack>
    )
}

function Logo() {
    return (
        <Stack borderRadius={10} alignItems={'center'} justifyContent={'center'} bgcolor={'white.main'}
               sx={{width: '30px', height: '30px'}}>
            <Typography fontWeight={'bold'}>W</Typography>
        </Stack>
    )
}