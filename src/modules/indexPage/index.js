import {useSelector} from 'react-redux';
import {
    projectsSlice,
    projectTicketsSlice,
    userTicketsSlice
} from "../../utils/redux/slices/slices";
import useSupabaseRealtimeTable from "../../utils/supabase/hooks/useSupabaseRealtimeTable";
import CustomTable from "../shared/components/CustomTable";
import {Box, Button, Stack, Tab, Tabs, Typography} from "@mui/material";
import {useMemo, useState} from "react";
import {useRouter} from "next/router";
import {ActiveTimeLog} from "../shared/components/ActiveTimeLog";

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
    useSupabaseRealtimeTable('projects', projectsSlice.actions)
    const projects = useSelector(state => state.projects.data)

    const data = projects.map(project => {
        return {value: project.id, headerName: project.name, render: <ProjectsTicketsTable projectId={project.id}/>}
    })

    if (projects.length === 0) {
        return <Typography>No projects found</Typography>
    }

    return (
        <Stack>
            <Typography variant={'h5'}>Available Tickets</Typography>
            <CustomTabs data={data}/>
        </Stack>
    )
}

function CustomTabs({data}) {
    const [value, setValue] = useState(data[0].value);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%'}}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="secondary tabs example"
                textColor="secondary"

                variant="scrollable"
            >
                {
                    data.map(tab => (
                        <Tab
                            key={tab.value}
                            value={tab.value}
                            label={tab.headerName}
                            sx={{
                                backgroundColor: value === tab.value ? 'black' : 'white',
                                color: value === tab.value ? 'white' : 'black',
                                borderRadius: '4px 4px 0 0',
                            }}
                        />
                    ))
                }
            </Tabs>
            {
                data.find(tab => tab.value === value)?.render
            }
        </Box>
    );
}

function AssignedTicketsTable() {
    const router = useRouter()
    const loggedUserId = useSelector(state => state.loggedUser?.id);

    const filter = useMemo(() => {
        if (loggedUserId != null) {
            return {key: 'user_id', value: loggedUserId};
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
        <Stack>
            <CustomTable columns={columns} data={tickets} onRowClick={handleRowClick}/>
        </Stack>
    )
}
