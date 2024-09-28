import {useRouter} from "next/router";
import TicketDetailPage from "../../modules/frontend/pages/ticketDetailPage";
import {useSelector} from "react-redux";
import {useMemo} from "react";
import useSupabaseRealtimeTable from "../../utils/supabase/hooks/useSupabaseRealtimeTable";
import {userTicketsSlice} from "../../utils/redux/slices/slices";

export default function Index() {
    const router = useRouter()
    const {id} = router.query;

    // TODO: Consider making this page static, there may be no need for useSupabaseRealtimeTable(), and can be simply done by fetchTickets with filter

    const filter = useMemo(() => ([{key: 'id', value: id}]), [id])
    const enabled = id != null;
    useSupabaseRealtimeTable('tickets', userTicketsSlice.actions, filter, enabled);

    const {
        data: tickets,
        loading: ticketsLoading,
        error: ticketsError
    } = useSelector(state => state.usersTickets)
    const loggedUser = useSelector(state => state.loggedUser);

    if (ticketsError || !loggedUser) {
        return <div>Error: {ticketsError || 'User is not logged in'}</div>;
    }
    if(tickets.length === 0){
        return <div>Error: ticket could not be loaded</div>
    }

    if (!id || ticketsLoading || !loggedUser) {
        return <div>Loading...</div>;
    }

    console.log(tickets)

    return <TicketDetailPage ticketId={id} ticket={tickets[0]} loggedUser={loggedUser}/>
}
