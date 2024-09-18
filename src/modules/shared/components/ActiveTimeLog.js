import {Divider, IconButton, Stack, Typography} from "@mui/material";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded";
import {handleActions2} from "./TimeLogActions";
import {useDispatch, useSelector} from "react-redux";
import {useAsyncData} from "../../../utils/supabase/hooks/useAsyncData";
import {getUsersActiveTimeLog} from "../../backend/functions/getUsersActiveTimeLog";
import {secondsToHHMMSS} from "../functions/time/secondsToHHMMSS";
import {fetchActiveTimeLog, updateActiveTimeLog} from "../../../utils/redux/slices/activeTimeLogSlice";
import {useCallback, useEffect} from "react";
import {calculateElapsedTimeInSeconds} from "../functions/time/calculateElapsedTimeInSeconds";
import useTimer from "../hooks/useTimer";

function ActionIconButton({Icon, onClick, disabled, color}) {
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

export function ActiveTimeLog({ticketId}) {
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
        if(!activeTimeLog || (!timeLogBelongsToTicket && ticketId)) return

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
    }, [start, stop, activeTimeLog?.state])

    function updateTimeLog(actionName, timeLogId) {
        dispatch(updateActiveTimeLog({action: actionName, time_log_id: timeLogId}));
    }

    function calculateElapsedTime(timeLog) {
        let elapsedSecondsTotal = 0;
        if(timeLog.start){
            const elapsedSecondsFromStart = calculateElapsedTimeInSeconds(timeLog.start)
            elapsedSecondsTotal += elapsedSecondsFromStart;
        }
        elapsedSecondsTotal += timeLog.elapsed;
        return secondsToHHMMSS(elapsedSecondsTotal);
    }

    if (!activeTimeLog || (!timeLogBelongsToTicket && ticketId)) {
        return null;
    }

    return (
        <Stack gap={1}>
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

                        <ActionIconButton onClick={() => updateTimeLog('play', activeTimeLog.id)}
                                          Icon={<PlayCircleRoundedIcon fontSize={'large'}/>}
                                          disabled={timeLogIsRunning}
                        />
                        <ActionIconButton onClick={() => updateTimeLog('pause', activeTimeLog.id)}
                                          Icon={<PauseCircleRoundedIcon fontSize={'large'}/>}
                                          disabled={timeLogIsPaused}/>
                        <ActionIconButton onClick={() => updateTimeLog('stop', activeTimeLog.id)}
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