import {useSelector} from 'react-redux';
import {
    projectsSlice,
    projectTicketsSlice,
    userTicketsSlice
} from "@/utils/redux/slices/slices";
import useSupabaseRealtimeTable from "@/utils/supabase/hooks/useSupabaseRealtimeTable";
import CustomTable from "@/modules/shared/components/CustomTable";
import {Alert, Stack, Typography} from "@mui/material";
import {useMemo} from "react";
import {useRouter} from "next/router";
import {ActiveTimeLog} from "@/modules/shared/components/ActiveTimeLog";
import {CustomTabs} from "@/modules/shared/components/CustomTabs";
import {useAsyncData} from "@/utils/supabase/hooks/useAsyncData";
import {getUserById} from "@/modules/backend/functions/getUserById";
import {getUserProject, getUserProjects} from "@/modules/backend/functions/getUserProjects";

export default function IndexPage() {

    return (
        <Stack gap={2} p={1}>
            <ActiveTimeLog enableNavigation={true}/>
            <AssignedTicketsTable/>
            <ProjectsTabs/>
        </Stack>
    );
}

function ProjectsTabs() {
    const loggedUser = useSelector(state => state.loggedUser)

    /*
    useSupabaseRealtimeTable('projects', projectsSlice.actions)
    const projects = useSelector(state => state.projects.data)
    console.log(projects)
    */

    const {data: projectsData} = useAsyncData(getUserProjects, [loggedUser?.id], [loggedUser?.id]);

    if (!projectsData) return 'loading'

    const data = projectsData.map(project => {
        return {value: project.id, headerName: project.name, render: <ProjectsTicketsTable projectId={project.id}/>}
    })

    if (projectsData.length === 0) {
        return (
            <Stack>
                <Typography variant={'h5'}>Available Tickets</Typography>
                <Alert severity={'warning'} >You have not been assigned to any projects, contact you administrator.</Alert>
            </Stack>
        )
    }

    return (
        <Stack>
            <Typography variant={'h5'}>Available Tickets</Typography>
            <CustomTabs data={data}/>
        </Stack>
    )
}


function AssignedTicketsTable() {
    const router = useRouter()
    const loggedUserId = useSelector(state => state.loggedUser?.id);

    const filter = useMemo(() => {
        if (loggedUserId != null) {
            return [
                {key: 'user_id', value: loggedUserId},
                {key: 'state', value: 'closed', negate: true}
            ];
        } else {
            return null;
        }
    }, [loggedUserId]);

    const enabled = loggedUserId != null;

    useSupabaseRealtimeTable('tickets', userTicketsSlice.actions, filter, enabled);

    const tickets = useSelector(state => state.usersTickets.data)


    const columns = [
        {field: 'name', headerName: 'Ticket name'},
        {field: 'description', headerName: 'Description'},
    ];

    function handleRowClick(row) {
        router.push(`/tickets/${row.id}`)
    }

    return (
        <Stack gap={1}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant={'h5'}>My Tickets</Typography>
            </Stack>
            <CustomTable columns={columns} data={tickets} onRowClick={handleRowClick}/>
        </Stack>
    )
}

export function ProjectsTicketsTable({projectId}) {
    const router = useRouter()
    const filters = useMemo(() => ([
            {key: 'project_id', value: projectId},
            {key: 'state', value: 'available'},
        ]
    ), [projectId]);
    useSupabaseRealtimeTable('tickets', projectTicketsSlice.actions, filters);
    const tickets = useSelector(state => state.projectsTickets.data)

    const columns = [
        {field: 'name', headerName: 'Ticket name'},
        {field: 'type', headerName: 'Type'},
        {field: 'state', headerName: 'State'}
    ];

    function handleRowClick(row) {
        router.push(`/tickets/${row.id}`)
    }

    return (
        <Stack>
            <CustomTable columns={columns} data={tickets} onRowClick={handleRowClick}/>
        </Stack>
    )
}
