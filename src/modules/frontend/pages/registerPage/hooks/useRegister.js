import {useState} from "react";
import {supabase} from "@/utils/supabase/supabaseConfig";

export function useRegister() {
    const [error, setError] = useState();

    async function handleRegistration(firstName, lastName, email, password) {

        try {
            const {user, error} = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                throw error;
            }

        } catch (error) {
            setError(error);
        }

    }

    return {error, handleRegistration}
}