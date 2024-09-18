import useSupabaseRealtimeTable from "@/utils/supabase/hooks/useSupabaseRealtimeTable";
import { projectTicketsSlice} from "@/utils/redux/slices/slices";
import {useSelector} from "react-redux";
import {Button, Stack, Typography} from "@mui/material";
import CustomTable from "@/modules/shared/components/CustomTable";
import {useRouter} from "next/router";
import {useMemo} from "react";

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
    const router = useRouter()
    const filter = useMemo(() => ({key: 'project_id', value: projectId}), [projectId]);
    useSupabaseRealtimeTable('tickets', projectTicketsSlice.actions, filter);
    const tickets = useSelector(state => state.projectsTickets.data)

    const columns = [
        {field: 'name', headerName: 'Ticket name'},
        {field: 'description', headerName: 'Description'},
    ];

    function handleRowClick(row) {
        router.push(`/tickets/${row.id}`)
    }

    return (
        <Stack p={1} gap={1}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} pl={0.5}>
                <Typography variant={'h5'}>Project tickets</Typography>
                <Button variant={'contained'} size={'small'}>Add</Button>
            </Stack>
            <CustomTable columns={columns} data={tickets} onRowClick={handleRowClick}/>
        </Stack>
    )
}
