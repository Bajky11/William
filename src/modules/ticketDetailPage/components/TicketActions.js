import {useDispatch} from "react-redux";
import Grid2 from "@mui/material/Unstable_Grid2";
import {Button} from "@mui/material";
import {openChangeTicketStateModal} from "@/modules/ticketDetailPage/modals/ChangeTicketStateModalBody";
import {updateUserTicket} from "@/utils/redux/slices/slices";

export function TicketActions({ticket, loggedUser}) {
    const dispatch = useDispatch();

    return (<Grid2 container p={1} gap={1}>
        <Button size={'small'} variant={'contained'} onClick={() => openChangeTicketStateModal(dispatch, ticket)}>Change
            State</Button>
        <AssignButton ticket={ticket} loggedUserId={loggedUser.id}/>
    </Grid2>)
}

const AssignButton = ({ticket, loggedUserId}) => {
    const dispatch = useDispatch();

    return ticket.user_id ?
        <Button
            size={'small'}
            variant={'contained'}
            onClick={() => dispatch(updateUserTicket({id: ticket.id, updatedData: {user_id: null, state: 'available'}}))}
        >
            Return Ticket
        </Button> :
        <Button
            size={'small'}
            variant={'contained'}
            onClick={() => dispatch(updateUserTicket({id: ticket.id, updatedData: {user_id: loggedUserId, state: 'assigned'}}))}
        >
            Assign to me
        </Button>
}