import {useState} from "react";
import {supabase} from "@/utils/supabase/supabaseConfig";
import {createUser} from "@/modules/backend/functions/createUser";
import {useRouter} from "next/router";

export function useRegister() {
    const [error, setError] = useState();
    const navigate = useRouter()

    async function handleRegistration(firstName, lastName, email, password) {

        try {
            const {data, error} = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            try {
                await createUser(firstName + ' ' + lastName, data.user.id);
            } catch (e) {
                setError('Failed to crerate internal user'); // Pokud se nepodaří vytvořit uživatel tak průser :D
            }

        } catch (error) {
            setError(error.message);
        }


        alert("Registration successful")
        await navigate.push('/login')
    }

    return {error, handleRegistration};
}
