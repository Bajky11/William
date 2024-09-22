import useSupabaseRealtimeTable from "../../utils/supabase/hooks/useSupabaseRealtimeTable";
import {useMemo} from "react";
import {
    TIME_LOGS_TABLE_NAME,
    timeLogsSlice,
    userTicketsSlice
} from "../../utils/redux/slices/slices";
import {Button, IconButton, Stack, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import Paper from "@mui/material/Paper";
import CustomTable from "../shared/components/CustomTable";
import {createAndStartTimeLog} from "../shared/components/TimeLogActions";
import {ActiveTimeLog} from "../shared/components/ActiveTimeLog";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import {updateActiveTimeLog} from "../../utils/redux/slices/activeTimeLogSlice";
import {calculateElapsedTime} from "@/modules/shared/functions/calculateElapsedTime";
import {ActionIconButton} from "@/modules/shared/components/ActionIconButton";
import useModal from "@/modules/shared/hooks/useModal";
import {DynamicForm} from "@/modules/shared/components/DynamicForm";
import {useAsyncData} from "@/utils/supabase/hooks/useAsyncData";
import {getUsersActiveTimeLog} from "@/modules/backend/functions/getUsersActiveTimeLog";
import {getUserById} from "@/modules/backend/functions/getUserById";
import {updateTicketUserId} from "@/modules/backend/functions/updateTicketUserId";

// TODO: Consider making this page static, there may be no need for useSupabaseRealtimeTable(), and can be simply done by fetchTickets with filter
export default function TicketDetailPage({ticketId}) {
    const filter = useMemo(() => ({key: 'id', value: ticketId}), [ticketId])
    const enabled = ticketId != null;
    useSupabaseRealtimeTable('tickets', userTicketsSlice.actions, filter, enabled);
    const ticket = useSelector(state => state.usersTickets.data[0])
    const user = useSelector(state => state.loggedUser);
    const {openModal, CustomModal} = useModal();
    //TODO: Toto hazí error, jelikož když ticket nemá žadý user_id, tak je požodavak na databázi chybný.
    const {data: ticketOwner, loading, error} = useAsyncData(getUserById, [ticket?.user_id], [ticket?.user_id]);
    const ticketHasOwner = ticketOwner != null;

    if (!ticket || !user || loading) {
        return 'loading'
    }

    function assignTicketToUserById(ticketId, userId) {
        updateTicketUserId(ticketId, userId)
    }

    console.log(ticketOwner)

    return (
        <div>
            <Stack gap={2} p={1}>
                <Stack component={Paper}>
                    <Stack bgcolor={'black'} p={1} sx={{borderRadius: '4px 4px 0 0'}} direction={'row'} gap={2}>
                        <Typography variant={'h4'} color={'text.white'}>{ticket.name}</Typography>
                        <ActionIconButton onClick={() => openModal()}
                                          Icon={<PlayCircleRoundedIcon fontSize={'large'}/>}/>
                    </Stack>
                    <Stack p={1} direction={'row'} gap={1} alignItems={"center"}>
                        <Typography fontWeight={'bold'}>Owner:</Typography>
                        <Typography>{ticketHasOwner ? (
                            <Stack direction={"row"} gap={1} alignItems={"center"}>
                                <Typography>{ticketOwner?.name}</Typography>
                                <Button
                                    onClick={() => assignTicketToUserById(ticketId, null)}
                                    color={"primary"}
                                    variant={'contained'}
                                    size={'small'}
                                >Return ticket
                                </Button>
                           </Stack>

                        ) : (
                            <Stack direction={"row"} gap={1} alignItems={"center"}>
                                <Typography>nobody</Typography>
                                <Button
                                    onClick={() => assignTicketToUserById(ticketId, user.id)}
                                    color={"primary"}
                                    variant={'contained'}
                                    size={'small'}
                                >Assign to me
                                </Button>
                            </Stack>
                        )}</Typography>
                    </Stack>
                    <Stack p={1} direction={'row'} gap={1}>
                        <Typography fontWeight={'bold'}>Description:</Typography>
                        <Typography>{ticket.description}</Typography>
                    </Stack>
                </Stack>
                <ActiveTimeLog ticketId={ticketId}/>
                <TicketTimeLogsTable ticketId={ticketId}/>
            </Stack>
            <CustomModal
                ModalBody={NewTimeLogModalBody}
                heading="Vytvoření nového time logu"
                modalProps={{userId: user.id, ticketId: ticket.id}}
            />
        </div>
    );
}

function NewTimeLogModalBody({closeModal, userId, ticketId}) {
    const dispatch = useDispatch()

    const handleSubmit = async (formData) => {
        createAndStartTimeLog(userId, ticketId, formData.description, dispatch)
        closeModal()
    };

    const fields = [
        {fieldName: 'description', label: 'Description', type: 'text', required: true},
    ]

    return <DynamicForm fields={fields} onSubmit={handleSubmit}/>
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