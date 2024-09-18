import {useState} from "react";

export function useRegister() {
    const [error, setError] = useState();

    function handleRegistration() {

    }

    return {error, handleRegistration}
}