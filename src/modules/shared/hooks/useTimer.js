import { useState, useEffect, useRef, useCallback } from 'react';

function useTimer(callback, interval = 1000) {
    const [result, setResult] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            console.log("Timer spuštěn")
            intervalRef.current = setInterval(() => {
                const value = callback();
                setResult(value);
            }, interval);
        }

        // Vyčištění intervalu při změně spuštění nebo odmountování
        return () => {
            if (intervalRef.current) {
                console.log("Timer zastaven")
                clearInterval(intervalRef.current);
            }
        };
    }, [interval, isRunning]);

    // Funkce pro spuštění intervalu
    const start = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
        }
    }, [isRunning]);

    // Funkce pro zastavení intervalu
    const stop = useCallback(() => {
        if (isRunning) {
            setIsRunning(false);
        }
    }, [isRunning]);

    return { result, start, stop, isRunning };
}

export default useTimer;
