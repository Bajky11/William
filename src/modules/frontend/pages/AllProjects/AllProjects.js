import useSupabaseRealtimeTable from "@/utils/supabase/hooks/useSupabaseRealtimeTable";
import {
    PROJECTS_TABLE_NAME,
    projectsSlice,
    removeProject,
} from "@/utils/redux/slices/slices";
import {useDispatch, useSelector} from "react-redux";
import {Button, Stack, Typography} from "@mui/material";
import CustomTable from "@/modules/shared/components/CustomTable";
import {useRouter} from "next/router";
import CustomMenu from "@/modules/shared/components/CustomMenu/CustomMenu";
import {openAddProjectModal} from "@/modules/frontend/pages/AllProjects/modals/AddProjectModal";

export default function AllProjects() {
    return (
        <ProjectsTable/>
    )
}

function ProjectsTable() {
    const dispatch = useDispatch();
    useSupabaseRealtimeTable(PROJECTS_TABLE_NAME, projectsSlice.actions);
    const projects = useSelector((state) => state.projects.data);
    const router = useRouter();

    const columns = [
        {field: 'name', headerName: 'Project name'},
        {field: 'description', headerName: 'Description'},
        {
            field: 'action',
            headerName: 'Action',
            align: 'right',
            render: (_, row) => {
                return <CustomMenu menuItems={createMenuItems(row)}/>
            }
        }
    ];

    function createMenuItems(row) {
        return [
            {label: 'Delete', onClick: () => handleRemoveProject(row.id)},
            {label: 'Edit', onClick: () => console.log('edit')},
        ]
    }

    function handleRemoveProject(projectId) {
        dispatch(removeProject(projectId));
    }

    function handleRowClick(row) {
        router.push(`projects/${row.id}`)
    }

    return (
        <div>
            <Stack p={1} gap={1}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} pl={0.5}>
                    <Typography variant={'h5'}>Projects List</Typography>
                    <Button variant={'contained'} size={'small'} onClick={() => openAddProjectModal(dispatch)}>Add</Button>
                </Stack>
                <CustomTable columns={columns} data={projects} onRowClick={handleRowClick}/>
            </Stack>
        </div>
    )
}


