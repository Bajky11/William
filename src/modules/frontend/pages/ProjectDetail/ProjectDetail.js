import useSupabaseRealtimeTable from "@/utils/supabase/hooks/useSupabaseRealtimeTable";
import {
    projectTicketsSlice,
    removeProjectsTicket,
} from "@/utils/redux/slices/slices";
import {useDispatch, useSelector} from "react-redux";
import {Button, Stack, Typography} from "@mui/material";
import CustomTable from "@/modules/shared/components/CustomTable";
import {useRouter} from "next/router";
import {useMemo} from "react";
import CustomMenu from "@/modules/shared/components/CustomMenu/CustomMenu";
import {openAddTicketModal} from "@/modules/frontend/pages/ProjectDetail/modals/AddTicketModal";

export default function ProjectDetail() {
    const router = useRouter();
    const {id} = router.query;

    if (router.isFallback || !id) {
        return 'loading'
    }

    return (
        <ProjectsTicketsTable projectId={id}/>
    )
}

function ProjectsTicketsTable({projectId}) {
    const dispatch = useDispatch()
    const router = useRouter()
    const filter = useMemo(() => ([{key: 'project_id', value: projectId}]), [projectId]);
    useSupabaseRealtimeTable('tickets', projectTicketsSlice.actions, filter);
    const tickets = useSelector(state => state.projectsTickets.data)

    const columns = [
        {field: 'name', headerName: 'Ticket name'},
        {field: 'type', headerName: 'Type'},
        {field: 'state', headerName: 'State'},
        {
            field: 'action', headerName: 'Actions', align: 'right', render: (_, row) => {
                return <CustomMenu menuItems={createMenuItems(row)}/>
            }
        }
    ];

    function createMenuItems(row) {
        return [
            {label: 'Delete', onClick: () => handleRemoveTicket(row.id)},
            {label: 'Edit', onClick: () => console.log('edit')},
        ]
    }

    function handleRemoveTicket(ticketId) {
        dispatch(removeProjectsTicket(ticketId));
    }

    function handleRowClick(row) {
        router.push(`/tickets/${row.id}`)
    }

    return (
        <div>
            <Stack p={1} gap={1}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} pl={0.5}>
                    <Typography variant={'h5'}>Project tickets</Typography>
                    <Button variant={'contained'} size={'small'}
                            onClick={() => openAddTicketModal(dispatch, projectId)}>Add</Button>
                </Stack>
                <CustomTable columns={columns} data={tickets} onRowClick={handleRowClick}/>
            </Stack>
        </div>
    )
}