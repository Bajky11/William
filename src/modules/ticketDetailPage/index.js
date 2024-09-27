import useSupabaseRealtimeTable from "../../utils/supabase/hooks/useSupabaseRealtimeTable";
import {useMemo, useState} from "react";
import {
    TIME_LOGS_TABLE_NAME,
    timeLogsSlice,
    userTicketsSlice
} from "@/utils/redux/slices/slices";
import {Button, Divider, IconButton, Stack, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import Paper from "@mui/material/Paper";
import CustomTable from "../shared/components/CustomTable";
import {createAndStartTimeLog} from "../shared/components/TimeLogActions";
import {ActiveTimeLog} from "../shared/components/ActiveTimeLog";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import {updateActiveTimeLog} from "@/utils/redux/slices/activeTimeLogSlice";
import {calculateElapsedTime} from "@/modules/shared/functions/calculateElapsedTime";
import {ActionIconButton} from "@/modules/shared/components/ActionIconButton";
import useModal from "@/modules/shared/hooks/useModal";
import {DynamicForm} from "@/modules/shared/components/DynamicForm";
import {updateTicketUserId} from "@/modules/backend/functions/updateTicketUserId";
import {TicketActions} from "@/modules/ticketDetailPage/components/TicketActions";
import {TicketDetails} from "@/modules/ticketDetailPage/components/TicketDetails";
import {openNewTimeLogModal} from "@/modules/ticketDetailPage/modals/NewTimeLogModalBody";

// TODO: Consider making this page static, there may be no need for useSupabaseRealtimeTable(), and can be simply done by fetchTickets with filter
export default function TicketDetailPage({ticketId, ticket, loggedUser}) {
    const dispatch = useDispatch()

    return (
        <div>
            <Stack gap={2} p={1}>
                <Stack component={Paper}>
                    <Stack bgcolor={'black'} p={1} sx={{borderRadius: '4px 4px 0 0'}} direction={'row'} gap={2}>
                        <Typography variant={'h4'} color={'text.white'}>{ticket.name}</Typography>
                        <ActionIconButton onClick={() => openNewTimeLogModal(dispatch, loggedUser.id, ticketId)}
                                          Icon={<PlayCircleRoundedIcon fontSize={'large'}/>}/>
                    </Stack>
                    <TicketActions ticket={ticket} loggedUser={loggedUser}/>
                    <TicketDetails ticket={ticket}/>
                </Stack>
                <ActiveTimeLog ticketId={ticketId}/>
                <TicketTimeLogsTable ticketId={ticketId}/>
            </Stack>

        </div>
    );
}


function TicketTimeLogsTable({ticketId}) {
    const dispatch = useDispatch()
    const filter = useMemo(() => ([{key: 'ticket_id', value: ticketId}]), [ticketId])
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