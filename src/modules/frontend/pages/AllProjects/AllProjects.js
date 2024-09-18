import useSupabaseRealtimeTable from "@/utils/supabase/hooks/useSupabaseRealtimeTable";
import {PROJECTS_TABLE_NAME, projectsSlice, timeLogsSlice} from "@/utils/redux/slices/slices";
import {useSelector} from "react-redux";
import {Button, Stack, Typography} from "@mui/material";
import CustomTable from "@/modules/shared/components/CustomTable";
import {useRouter} from "next/router";

export default function AllProjects(){
    return (
        <ProjectsTable/>
    )
}

function ProjectsTable() {
    useSupabaseRealtimeTable(PROJECTS_TABLE_NAME, projectsSlice.actions);
    const projects = useSelector((state) => state.projects.data);
    const router = useRouter();

    const columns = [
        {field: 'name', headerName: 'Project name'},
        {field: 'description', headerName: 'Description'},
    ];

    function handleRowClick(row) {
        router.push(`projects/${row.id}`)
    }

    return (
        <Stack p={1} gap={1}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} pl={0.5}>
                <Typography variant={'h5'}>Projects List</Typography>
                <Button variant={'contained'} size={'small'}>Add</Button>
            </Stack>
            <CustomTable columns={columns} data={projects} onRowClick={handleRowClick}/>
        </Stack>
    )
}