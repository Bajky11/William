import {useDispatch} from "react-redux";
import {addProject} from "@/utils/redux/slices/slices";
import {DynamicForm} from "@/modules/shared/components/DynamicForm";
import {openModal} from "@/utils/redux/slices/modalSlice";

export function openAddProjectModal(dispatch) {
    dispatch(openModal({
        ModalBody: AddProjectModalBody,
        heading: "Nový Projekt"
    }))
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
};