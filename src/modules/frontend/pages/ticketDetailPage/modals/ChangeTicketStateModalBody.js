import useMediaQuery from "@mui/material/useMediaQuery";
import {Button, Stack, Typography} from "@mui/material";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {openModal} from "@/utils/redux/slices/modalSlice";
import {ticketState, ticketType} from "@/modules/frontend/pages/ticketDetailPage/contants";
import {useDispatch} from "react-redux";
import {updateUserTicket} from "@/utils/redux/slices/slices";

export function openChangeTicketStateModal(dispatch, ticket) {
    dispatch(openModal(
        {
            ModalBody: ChangeTicketStateModalBody,
            heading: "Změna stavu ticketu",
            modalProps: {ticket}
        }
    ))
}

function ChangeTicketStateModalBody({closeModal, ticket}) {
    const dispatch = useDispatch()
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const ContainedButton = ({label, id, type, ...props}) => (
        <Button variant="contained"
                sx={{minWidth: '150px'}}
                onClick={() => handleChange(id, type)}
                color={ticket.state === id || ticket.type === id ? 'success' : 'primary'}
                {...props}
        >
            {label}
        </Button>
    );
    const Arrow = () => isMobile ? <ArrowDownwardRoundedIcon/> : <ArrowForwardRoundedIcon/>

    function handleChange(id, type) {
        dispatch(updateUserTicket({id: ticket.id, updatedData: {[type]: id}}))
        closeModal();
    }

    return (
        <Stack gap={2}>
            <Typography>Stav Ticketu</Typography>
            <Stack direction={isMobile ? 'column' : 'row'} gap={1} alignItems={'center'}>
                <ContainedButton label={'Available'} id={ticketState.available} type={'state'}/>
                <Arrow/>
                <ContainedButton label={'Assigned'} id={ticketState.assigned} type={'state'}/>
                <Arrow/>
                <ContainedButton label={'Closed'} id={ticketState.closed} type={'state'}/>
            </Stack>
            <Typography>Typ Ticketu</Typography>
            <Stack direction={isMobile ? 'column' : 'row'} gap={1} alignItems={'center'}>
                <ContainedButton label={'Analysis'} id={ticketType.analysis} type={'type'}/>
                <Arrow/>
                <ContainedButton label={'Development'} id={ticketType.development} type={'type'}/>
                <Arrow/>
                <ContainedButton label={'Testing'} id={ticketType.testing} type={'type'}/>
            </Stack>
        </Stack>
    );
}