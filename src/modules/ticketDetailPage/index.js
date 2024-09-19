import useSupabaseRealtimeTable from "../../utils/supabase/hooks/useSupabaseRealtimeTable";
import {useMemo} from "react";
import {addTimeLog, TIME_LOGS_TABLE_NAME, timeLogsSlice, userTicketsSlice} from "../../utils/redux/slices/slices";
import {Divider, IconButton, Stack, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import Paper from "@mui/material/Paper";
import CustomTable from "../shared/components/CustomTable";
import {createAndStartTimeLog, TimeLogActions} from "../shared/components/TimeLogActions";
import {ActiveTimeLog} from "../shared/components/ActiveTimeLog";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import {updateActiveTimeLog} from "../../utils/redux/slices/activeTimeLogSlice";
import {calculateElapsedTimeInSeconds} from "@/modules/shared/generalFunctions/time/calculateElapsedTimeInSeconds";
import {calculateElapsedTime} from "@/modules/shared/functions/calculateElapsedTime";
import {ActionIconButton} from "@/modules/shared/components/ActionIconButton";

// TODO: Consider making this page static, there may be no need for useSupabaseRealtimeTable(), and can be simply done by fetchTickets with filter
export default function TicketDetailPage({ticketId}) {
    const dispatch = useDispatch()
    const filter = useMemo(() => ({key: 'id', value: ticketId}), [ticketId])
    const enabled = ticketId != null;
    useSupabaseRealtimeTable('tickets', userTicketsSlice.actions, filter, enabled);
    const ticket = useSelector(state => state.usersTickets.data[0])
    const user = useSelector(state => state.loggedUser);

    if (!ticket || !user) {
        return 'loading'
    }

    return (
        <Stack gap={2} p={1}>
            <Stack component={Paper} gap={1}>
                <Stack bgcolor={'black'} p={1} sx={{borderRadius: '4px 4px 0 0'}} direction={'row'} gap={2}>
                    <Typography variant={'h4'} color={'text.white'}>{ticket.name}</Typography>
                    <ActionIconButton onClick={() => createAndStartTimeLog(user.id, ticket.id, dispatch)}
                                      Icon={<PlayCircleRoundedIcon fontSize={'large'}/>}/>
                </Stack>
                <Stack p={1}>
                    <Typography>{ticket.description}</Typography>
                </Stack>
            </Stack>
            <ActiveTimeLog ticketId={ticketId}/>
            <TicketTimeLogsTable ticketId={ticketId}/>
        </Stack>
    );
}

function TicketTimeLogsTable({ticketId}) {
    const dispatch = useDispatch()
    const filter = useMemo(() => ({key: 'ticket_id', value: ticketId}), [ticketId])
    const enabled = ticketId != null;
    useSupabaseRealtimeTable(TIME_LOGS_TABLE_NAME, timeLogsSlice.actions, filter, enabled);
    const projects = useSelector((state) => state.timeLogs.data);
    const user = useSelector(state => state.loggedUser);

    function handleRowClick(row) {
        console.log('Processing row data:', row);
    }

    function startTimeLog(event, row) {
        event.stopPropagation();
        dispatch(updateActiveTimeLog({action: 'play', time_log_id: row.id}))
    }

    const columns = [
        {field: 'description', headerName: 'Description'},
        {
            field: 'elapsed',
            headerName: 'Elapsed',
            render: (_, row) => {
                return <p>{calculateElapsedTime(row)}</p>
            }
        },
        {
            field: 'action',
            headerName: "Action",
            align: 'right',
            render: (_, row) => {
                return (
                    <IconButton
                        size={'small'}
                        onClick={(event) => startTimeLog(event, row)}
                    >
                        <PlayCircleRoundedIcon/>
                    </IconButton>)
            }
        }
    ];

    if (!user) return 'loading'

    return (
        <Stack gap={1}>
            <Stack alignItem={'center'} justifyContent={'space-between'} direction={'row'}>
                <Typography variant={'h5'}>Time Logs</Typography>
            </Stack>
            <CustomTable columns={columns} data={projects} onRowClick={handleRowClick}/>
        </Stack>
    )
}