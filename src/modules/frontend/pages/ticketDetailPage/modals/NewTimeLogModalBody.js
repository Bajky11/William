import {useDispatch} from "react-redux";
import {createAndStartTimeLog} from "@/modules/shared/components/TimeLogActions";
import {DynamicForm} from "@/modules/shared/components/DynamicForm";
import {openModal} from "@/utils/redux/slices/modalSlice";

export function openNewTimeLogModal(dispatch, userId, ticketId) {
    dispatch(openModal(
        {
            ModalBody: NewTimeLogModalBody,
            heading: "Vytvoření nového time logu",
            modalProps: {userId, ticketId}
        }
    ))
}

function NewTimeLogModalBody({closeModal, userId, ticketId}) {
    const dispatch = useDispatch()

    const handleSubmit = async (formData) => {
        createAndStartTimeLog(userId, ticketId, formData.description, dispatch)
        closeModal()
    };

    const fields = [
        {fieldName: 'description', label: 'Description', type: 'text', required: true},
    ]

    return <DynamicForm fields={fields} onSubmit={handleSubmit}/>
}