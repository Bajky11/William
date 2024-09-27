import useSupabaseRealtimeTable from "@/utils/supabase/hooks/useSupabaseRealtimeTable";
import {
    addProject,
    addTicketToAll,
    projectTicketsSlice,
    removeProject, removeProjectsTicket,
    removeTicketFromAll
} from "@/utils/redux/slices/slices";
import {useDispatch, useSelector} from "react-redux";
import {Button, Stack, Typography} from "@mui/material";
import CustomTable from "@/modules/shared/components/CustomTable";
import {useRouter} from "next/router";
import {useMemo} from "react";
import {DynamicForm} from "@/modules/shared/components/DynamicForm";
import useModal from "@/modules/shared/hooks/useModal";
import CustomMenu from "@/modules/shared/components/CustomMenu/CustomMenu";

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
    const {openModal, CustomModal} = useModal();

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
                    <Button variant={'contained'} size={'small'} onClick={() => openModal()}>Add</Button>
                </Stack>
                <CustomTable columns={columns} data={tickets} onRowClick={handleRowClick}/>
            </Stack>
            <CustomModal
                ModalBody={AddTicketModalBody}
                heading="Nový Ticket"
                modalProps={{projectId}}
            />
        </div>
    )
}

const AddTicketModalBody = ({closeModal, projectId}) => {
    const dispatch = useDispatch()

    const handleSubmit = async (formData) => {
        formData.status = 'Open'
        formData.project_id = projectId
        dispatch(addTicketToAll(formData))
        closeModal()
    };

    const fields = [
        {fieldName: 'name', label: 'Ticket Name', type: 'text', required: true},
        {fieldName: 'description', label: 'Description', type: 'text', required: false},
    ]

    return (
        <DynamicForm fields={fields} onSubmit={handleSubmit}/>
    );
    //<Button onClick={closeModal} sx={{mt: 2}}>Zavřít</Button>
};