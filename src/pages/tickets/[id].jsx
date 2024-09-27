import {useRouter} from "next/router";
import TicketDetailPage from "../../modules/ticketDetailPage"
import {useSelector} from "react-redux";
import {RootState} from "@/utils/redux/store";

export default function Index() {
    const router = useRouter()
    const {id} = router.query;

    const {
        data: tickets,
        loading: ticketsLoading,
        error: ticketsError
    } = useSelector(state => state.usersTickets)
    const loggedUser = useSelector(state => state.loggedUser);

    if (ticketsError || !loggedUser) {
        return <div>Error: {ticketsError || 'User is not logged in'}</div>;
    }

    if (!id || ticketsLoading || !loggedUser) {
        return <div>Loading...</div>;
    }

    return <TicketDetailPage ticketId={id} ticket={tickets[0]} loggedUser={loggedUser}/>
}
