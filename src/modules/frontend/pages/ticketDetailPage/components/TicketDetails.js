import {Box, Stack, Typography} from "@mui/material";
import {useAsyncData} from "@/utils/supabase/hooks/useAsyncData";
import {getUserById} from "@/modules/backend/functions/getUserById";
import {EditableTypography} from "@/modules/shared/components/EditableTypography";
import {useDispatch} from "react-redux";
import {updateUserTicket} from "@/utils/redux/slices/slices";

export function TicketDetails({ticket}) {
    const dispatch = useDispatch();
    //TODO: Toto hazí error, jelikož když ticket nemá žadý user_id, tak je požodavak na databázi chybný.
    const {data: ticketOwner /*, loading, error*/} = useAsyncData(getUserById, [ticket?.user_id], [ticket?.user_id]);
    const ticketHasOwner = ticketOwner != null;

    const DetailRow = ({label, value}) => {
        return (
            <Stack p={1} direction={'row'} gap={1} alignItems={"center"}>
                <Typography fontWeight={'bold'}>{label}</Typography>
                <Typography>{value}</Typography>
            </Stack>
        )
    }

    function saveEditedDescription(newText) {
        dispatch(updateUserTicket({id: ticket.id, updatedData: {description: newText}}));
    }

    return (
        <Box>
            <DetailRow label={'Owner:'} value={ticketHasOwner ? ticketOwner?.name : 'Ticket does not have owner'}/>
            <Stack p={1} direction={'row'} gap={1}>
                <Typography fontWeight={'bold'}>Description:</Typography>
                <EditableTypography
                    text={ticket.description}
                    onEditSave={saveEditedDescription}
                />
            </Stack>
            <DetailRow label={'Stav:'} value={ticket.state}/>
            <DetailRow label={'Typ:'} value={ticket.type}/>
        </Box>
    )
}