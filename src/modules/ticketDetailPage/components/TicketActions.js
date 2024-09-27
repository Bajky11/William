import {useDispatch} from "react-redux";
import Grid2 from "@mui/material/Unstable_Grid2";
import {Button} from "@mui/material";
import {openChangeTicketStateModal} from "@/modules/ticketDetailPage/modals/ChangeTicketStateModalBody";

export function TicketActions({ticket}) {
    const dispatch = useDispatch();

    return (
        <Grid2 container p={1} gap={1}>
            <Button size={'small'} variant={'contained'} onClick={() => openChangeTicketStateModal(dispatch, ticket)}>Change
                State</Button>
            <Button size={'small'} variant={'contained'}>Return Ticket</Button>
        </Grid2>
    )
}