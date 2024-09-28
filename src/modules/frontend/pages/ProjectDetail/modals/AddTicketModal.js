import {useDispatch} from "react-redux";
import {addTicketToAll} from "@/utils/redux/slices/slices";
import {DynamicForm} from "@/modules/shared/components/DynamicForm";
import {openModal} from "@/utils/redux/slices/modalSlice";

export function openAddTicketModal(dispatch,projectId){
    dispatch(openModal({
        ModalBody: AddTicketModalBody,
        heading: 'Nový ticket',
        modalProps: {projectId}
    }))
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
};