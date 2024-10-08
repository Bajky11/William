import useSupabaseRealtimeTable from "@/utils/supabase/hooks/useSupabaseRealtimeTable";
import {useMemo} from "react";
import {
    TIME_LOGS_TABLE_NAME,
    timeLogsSlice, updateUserTicket,
} from "@/utils/redux/slices/slices";
import {IconButton, Stack, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import Paper from "@mui/material/Paper";
import CustomTable from "@/modules/shared/components/CustomTable";
import {ActiveTimeLog} from "@/modules/shared/components/ActiveTimeLog";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import {updateActiveTimeLog} from "@/utils/redux/slices/activeTimeLogSlice";
import {calculateElapsedTime} from "@/modules/shared/functions/calculateElapsedTime";
import {ActionIconButton} from "@/modules/shared/components/ActionIconButton";
import {TicketActions} from "@/modules/frontend/pages/ticketDetailPage/components/TicketActions";
import {TicketDetails} from "@/modules/frontend/pages/ticketDetailPage/components/TicketDetails";
import {openNewTimeLogModal} from "@/modules/frontend/pages/ticketDetailPage/modals/NewTimeLogModalBody";
import {TicketComments} from "@/modules/frontend/pages/ticketDetailPage/components/TicketComments/TicketComments";
import {CustomAccordion} from "@/modules/shared/components/CustomAccordion";
import TicketPlan from "@/modules/frontend/pages/ticketDetailPage/components/TicketPlan";
import {EditableTypography} from "@/modules/shared/components/EditableTypography";
import {timestampToDateString} from "@/modules/shared/generalFunctions/time/timestampToDateString";

// TODO: Consider making this page static, there may be no need for useSupabaseRealtimeTable(), and can be simply done by fetchTickets with filter
export default function TicketDetailPage({ticketId, ticket, loggedUser}) {
    const dispatch = useDispatch()

    function saveEditedtName(newName) {
        dispatch(updateUserTicket({id: ticket.id, updatedData: {name: newName}}));
    }

    return (
        <div>
            <Stack gap={2} p={1}>
                <Stack component={Paper}>
                    <Stack bgcolor={'black'} p={1} sx={{borderRadius: '4px 4px 0 0'}} direction={'row'} gap={2}
                           alignItems={'center'}>
                        <EditableTypography
                            text={ticket.name}
                            onEditSave={saveEditedtName}
                            textColor={'#fff'}
                            iconColor={'#fff'}
                            variant={'h5'}
                        />
                        <ActionIconButton onClick={() => openNewTimeLogModal(dispatch, loggedUser.id, ticketId)}
                                          Icon={<PlayCircleRoundedIcon fontSize={'large'}/>}/>
                    </Stack>
                    <TicketActions ticket={ticket} loggedUser={loggedUser}/>
                    <TicketDetails ticket={ticket}/>
                </Stack>
                <ActiveTimeLog ticketId={ticketId}/>
                <CustomAccordion
                    heading={'Plan'}
                    AccordionBody={<TicketPlan ticketId={ticketId}/>}
                    defaultExpanded={true}
                />
                <CustomAccordion
                    heading={'Komentáře'}
                    AccordionBody={<TicketComments ticket={ticket}/>}
                />
                <CustomAccordion
                    heading={'Time Logs'}
                    AccordionBody={<TicketTimeLogsTable ticketId={ticketId}/>}
                    defaultExpanded={true}
                />
            </Stack>
        </div>
    );
}


function TicketTimeLogsTable({ticketId}) {
    const dispatch = useDispatch()
    const loggedUser = useSelector(state => state.loggedUser);
    const filter = useMemo(() => ([
        {key: 'ticket_id', value: ticketId},
        {key: 'user_id', value: loggedUser.id}
    ]), [ticketId])
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
        {
            field: 'date',
            headerName: 'Date',
            render:(_,row) => {
                 return timestampToDateString(row.date);
            }
        },
        {
            field: 'elapsed',
            headerName: 'Elapsed',
            render: (_, row) => {
                return <p>{calculateElapsedTime(row)}</p>
            }
        },
        {field: 'description', headerName: 'Description'},
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
        <CustomTable columns={columns} data={projects} onRowClick={handleRowClick}/>

    )
}