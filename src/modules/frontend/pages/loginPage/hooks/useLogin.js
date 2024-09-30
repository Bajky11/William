import {useDispatch} from "react-redux";
import {useState} from "react";
import {supabase} from "@/utils/supabase/supabaseConfig";
import {setLoggedUser} from "@/utils/redux/slices/loggedUserSlice";
import {useRouter} from "next/router";

export const useLogin = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [error, setError] = useState(null);

    const handleLogin = async (email, password) => {
        try {
            const {error} = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error);
                return;
            }

            const {data: {user}, error: userError} = await supabase.auth.getUser();

            if (userError || !user) {
                setError(userError ? userError : "Unable to fetch user after login");
                return;
            }

            const {data} = await supabase.from('users').select('*').eq('login_id', user.id);

            dispatch(setLoggedUser(data[0]));
            await router.push('/')

        } catch (error) {
            setError(error.message);
        }
    }

    return {error, handleLogin}
}