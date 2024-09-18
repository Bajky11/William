import {useRouter} from "next/router";
import TicketDetailPage from "../../modules/ticketDetailPage"

export default function Index() {
    const router = useRouter()
    const {id} = router.query;

    if (router.isFallback || !id) {
        return 'loading'
    }

    return <TicketDetailPage ticketId={id}/>
}
