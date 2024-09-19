import {supabase} from "../../../utils/supabase/supabaseConfig";
import {Divider, IconButton, Stack, Typography} from "@mui/material";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded";
import {useSelector} from "react-redux";
import {addTimeLog, TIME_LOGS_TABLE_NAME} from "../../../utils/redux/slices/slices";
import {useAsyncData} from "../../../utils/supabase/hooks/useAsyncData";
import {getUsersActiveTimeLog} from "../../backend/functions/getUsersActiveTimeLog";
import {setActiveTimeLog} from "../../../utils/redux/slices/activeTimeLogSlice";
import { DateTime } from 'luxon';

export function TimeLogActions({ticketId}) {
    const user = useSelector(state => state.loggedUser)

    const {data, loading, error} = useAsyncData(getUsersActiveTimeLog, [user?.id], [user?.id]);

    if (loading || !user) {
        return 'loading'
    }

    if (error) {
        return 'error'
    }

    const activeTimeLog = data[0];
    const timeLogHasCorrectTicketId = activeTimeLog.ticket_id === ticketId;
    const timeLogIsRunning = activeTimeLog && activeTimeLog.state === 'Running'
    const timeLogIsPaused = activeTimeLog && activeTimeLog.state === 'Paused'


    function handleAction(actionType) {
        handleActions2(actionType, ticketId, user.id)
    }

    function ActionIconButton({Icon, onClick, disabled}) {
        return (
            <IconButton
                size={'small'}
                color={'primary'}
                onClick={onClick}
                disabled={disabled}
            >
                {Icon}
            </IconButton>
        )
    }

    return (
        <Stack direction={'row'} alignItems={'center'} gap={2}>
            <Stack direction={'row'} alignItems={'center'}>

                <ActionIconButton onClick={() => handleAction('play')}
                                  Icon={<PlayCircleRoundedIcon fontSize={'large'}/>}
                                  disabled={timeLogIsRunning}
                />
                <ActionIconButton onClick={() => handleAction('pause')}
                                  Icon={<PauseCircleRoundedIcon fontSize={'large'}/>}
                                  disabled={timeLogIsPaused}/>
                <ActionIconButton onClick={() => handleAction('stop')}
                                  Icon={<StopCircleRoundedIcon fontSize={'large'}/>}/>

            </Stack>
            <Divider orientation={"horizontal"} sx={{height: '20px', width: '2px', bgcolor: 'black'}}/>
            <Typography>3h 21m</Typography>
        </Stack>
    )
}

async function runUpdateTimeLogDatabaseFunction(action, ticketId) {
    const {data, error} = await supabase.rpc('update_time_log', {
        action: action, time_log_id: ticketId
    });

    if (error) {
        console.error(error);
    } else {
        console.log('RPC call successful');
        return data;
    }
    return null;
}

export async function handleActions2(action, timeLog, dispatch) {
    if (!action || !timeLog) return;

    console.log("performing time log action: " + action);
    const data = await runUpdateTimeLogDatabaseFunction(action, timeLog.id)
    if (data) {
        //dispatch(setActiveTimeLog(data[0]))
    }
}

export async function createAndStartTimeLog(userId, ticketId, dispatch) {
    const userActiveTimeLog = await isUserRunningATimeLog(userId);

    if (userActiveTimeLog) {
        console.log('Other ticket is running')
        alert("Other time log is currently running")
        return;
    }

    //TODO: This is not correct or pretty, the activeTimeLog should be realtime, so there should not be setting the redux store like this, but for now i am doing it like this...
    const newTimeLog = {
        ticket_id: ticketId,
        user_id: userId,
        description: 'Nový time log',
    }


    let { data, error } = await supabase
        .rpc('create_time_log', {
            p_description: 'Nový time log',
            p_ticket_id: ticketId,
            p_user_id: userId
        })
    if (error) console.error(error)
    dispatch(setActiveTimeLog(data[0]))
}

export async function isUserRunningATimeLog(userId) {
    let {data, error} = await supabase
        .rpc('is_user_running_a_ticket', {
            p_user_id: userId
        });

    if (error) {
        console.error("RPC Error:", error);
        return false;
    }

    return data;
}