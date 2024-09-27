import {Box, Stack, Typography} from "@mui/material";
import {useAsyncData} from "@/utils/supabase/hooks/useAsyncData";
import {getUserById} from "@/modules/backend/functions/getUserById";

export function TicketDetails({ticket}) {
    //TODO: Toto hazí error, jelikož když ticket nemá žadý user_id, tak je požodavak na databázi chybný.
    const {data: ticketOwner, loading, error} = useAsyncData(getUserById, [ticket?.user_id], [ticket?.user_id]);
    const ticketHasOwner = ticketOwner != null;

    const DetailRow = ({label, value}) => {
        return (
            <Stack p={1} direction={'row'} gap={1} alignItems={"center"}>
                <Typography fontWeight={'bold'}>{label}</Typography>
                <Typography>{value}</Typography>
            </Stack>
        )
    }

    return (
        <Box>
            <DetailRow label={'Owner:'} value={ticketHasOwner ? ticketOwner?.name : ''}/>
            <DetailRow label={'Description:'} value={ticket.description}/>
            <DetailRow label={'Stav:'} value={ticket.state}/>
            <DetailRow label={'Typ:'} value={ticket.type}/>
        </Box>

    )
}