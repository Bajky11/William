import {Divider, IconButton, Stack, Typography} from "@mui/material";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded";
import {handleActions2} from "./TimeLogActions";
import {useDispatch, useSelector} from "react-redux";
import {useAsyncData} from "../../../utils/supabase/hooks/useAsyncData";
import {getUsersActiveTimeLog} from "../../backend/functions/getUsersActiveTimeLog";
import {secondsToHHMMSS} from "@/modules/shared/generalFunctions/time/secondsToHHMMSS";
import {fetchActiveTimeLog, updateActiveTimeLog} from "../../../utils/redux/slices/activeTimeLogSlice";
import {useEffect} from "react";
import useTimer from "../hooks/useTimer";
import {calculateElapsedTime} from "@/modules/shared/functions/calculateElapsedTime";
import {ActionIconButton} from "@/modules/shared/components/ActionIconButton";
import {useRouter} from "next/router";


export function ActiveTimeLog({ticketId, enableNavigation = false}) {
    const router = useRouter()
    const dispatch = useDispatch()
    const user = useSelector(state => state.loggedUser)
    const activeTimeLog = useSelector(state => state.activeTimeLog.data);
    const timeLogIsRunning = activeTimeLog && activeTimeLog.state === 'Running'
    const timeLogIsPaused = activeTimeLog && activeTimeLog.state === 'Paused'
    const timeLogBelongsToTicket = activeTimeLog?.ticket_id === ticketId

    const {result, start, stop, isRunning} = useTimer(() => calculateElapsedTime(activeTimeLog))

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchActiveTimeLog(user.id))
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (!activeTimeLog || (!timeLogBelongsToTicket && ticketId)) {
            stop()
            return;
        }
        switch (activeTimeLog?.state) {
            case 'Running':
                start();
                break;
            case 'Paused':
            case 'Stopped':
                stop();
                break;
            default:
                stop()
        }
    }, [activeTimeLog])

    function updateTimeLog(event, actionName, timeLogId) {
        event.stopPropagation()
        dispatch(updateActiveTimeLog({action: actionName, time_log_id: timeLogId}));
    }

    function onComponentClick() {
        if (!enableNavigation) return
        router.push(`tickets/${activeTimeLog.ticket_id}`)
    }

    if (!activeTimeLog || (!timeLogBelongsToTicket && ticketId)) {
        return null;
    }

    return (
        <Stack gap={1} onClick={() => onComponentClick()}>
            <Typography variant={'h5'}>Active Ticket</Typography>
            <Stack bgcolor={'black'} justifyContent={'space-between'} direction={'row'} alignItems={'center'} p={1}
                   borderRadius={1}>
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                    <Typography color={"text.white"}>{activeTimeLog.description}</Typography>
                </Stack>
                <Stack direction={'row'} alignItems={'center'} gap={2}>
                    <Typography
                        color={getTimeColor(activeTimeLog)}>{result || calculateElapsedTime(activeTimeLog)}</Typography>
                    <Divider orientation={'vertical'} color={'white'} sx={{height: '20px'}}/>
                    <Stack direction={'row'} alignItems={'center'}>

                        <ActionIconButton onClick={(event) => updateTimeLog(event, 'play', activeTimeLog.id)}
                                          Icon={<PlayCircleRoundedIcon fontSize={'large'}/>}
                                          disabled={timeLogIsRunning}
                        />
                        <ActionIconButton onClick={(event) => updateTimeLog(event, 'pause', activeTimeLog.id)}
                                          Icon={<PauseCircleRoundedIcon fontSize={'large'}/>}
                                          disabled={timeLogIsPaused}/>
                        <ActionIconButton onClick={(event) => updateTimeLog(event, 'stop', activeTimeLog.id)}
                                          Icon={<StopCircleRoundedIcon fontSize={'large'}/>}/>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

function getTimeColor(timeLog) {
    switch (timeLog.state) {
        case 'Running':
            return "green"
        case "Paused" :
            return "orange"
        case "Stopped" :
            return "red"
        default:
            return "white"
    }
}