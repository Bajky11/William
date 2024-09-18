import {Divider, IconButton, Stack, Typography} from "@mui/material";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded";

export function ActiveTicket() {
    return (
        <Stack gap={1}>
            <Typography variant={'h5'}>Active Ticket</Typography>
            <Stack bgcolor={'black'} justifyContent={'space-between'} direction={'row'} alignItems={'center'} p={1}
                   borderRadius={1}>
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                    <Typography color={'text.white'}>Tickets name</Typography>
                    <Divider orientation={'vertical'} color={'white'} sx={{height: '20px'}}/>
                    <Typography color={'text.white'}>3h 21m</Typography>
                </Stack>
                <Stack direction={'row'} alignItems={'center'}>
                    <IconButton size={'small'}><PlayCircleRoundedIcon fontSize={'large'} color={'white'}/></IconButton>
                    <IconButton size={'small'}><PauseCircleRoundedIcon fontSize={'large'} color={'white'}/></IconButton>
                    <IconButton size={'small'}><StopCircleRoundedIcon fontSize={'large'} color={'white'}/></IconButton>
                </Stack>
            </Stack>
        </Stack>
    )
}