import useSupabaseRealtimeTable from "@/utils/supabase/hooks/useSupabaseRealtimeTable";
import {
    addProject,
    PROJECTS_TABLE_NAME,
    projectsSlice,
    removeProject,
    timeLogsSlice
} from "@/utils/redux/slices/slices";
import {useDispatch, useSelector} from "react-redux";
import {Box, Button, Container, Modal, Stack, TextField, Typography} from "@mui/material";
import CustomTable from "@/modules/shared/components/CustomTable";
import {useRouter} from "next/router";
import useModal from "@/modules/shared/hooks/useModal";
import {DynamicForm} from "@/modules/shared/components/DynamicForm";
import CustomMenu from "@/modules/shared/components/CustomMenu/CustomMenu";

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
    const {openModal, CustomModal} = useModal();

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
            {label: 'Delete', onClick: () => handleRemoveProject( row.id)},
            {label: 'Edit', onClick: () => console.log('edit')},
        ]
    }

    function handleRemoveProject(projectId) {
        dispatch(removeProject(projectId));
    }

    function handleAddProject() {
        openModal()
    }

    function handleRowClick(row) {
        router.push(`projects/${row.id}`)
    }


    return (
        <div>
            <Stack p={1} gap={1}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} pl={0.5}>
                    <Typography variant={'h5'}>Projects List</Typography>
                    <Button variant={'contained'} size={'small'} onClick={() => handleAddProject()}>Add</Button>
                </Stack>
                <CustomTable columns={columns} data={projects} onRowClick={handleRowClick}/>
            </Stack>
            <CustomModal
                ModalBody={AddProjectModalBody}
                heading="Nový Projekt"
            />
        </div>
    )
}


const AddProjectModalBody = ({closeModal}) => {
    const dispatch = useDispatch()

    const handleSubmit = async (formData) => {
        dispatch(addProject(formData))
        closeModal()
    };

    const fields = [
        {fieldName: 'name', label: 'Project Name', type: 'text', required: true},
        {fieldName: 'description', label: 'Description', type: 'text', required: false},
    ]

    return (
        <DynamicForm fields={fields} onSubmit={handleSubmit}/>
    );
    //<Button onClick={closeModal} sx={{mt: 2}}>Zavřít</Button>
};

