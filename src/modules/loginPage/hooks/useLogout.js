import {useDispatch} from "react-redux";
import {removeLoggedUser} from "@/utils/redux/slices/loggedUserSlice";
import {useRouter} from "next/router";

export const useLogout = () => {
    const router = useRouter()
    const dispatch = useDispatch();

    const handleLogout = async () => {
        dispatch(removeLoggedUser())
        await router.push('/login')
    }

    return {handleLogout};
}