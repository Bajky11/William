import { useState, useEffect } from 'react';

/* USAGE:

    export async function getUsersActiveTimeLog(userId) {
        const { data, error } = await supabase
            .from('time_logs')
            .select('*')
            .eq('user_id', userId)
            .in('state', ['Running', 'Paused']);

        if (error) console.error(error);
        return data;
    }

    const {data, loading, error} = useAsyncData(getUsersActiveTimeLog, [user?.id], [user?.id]);

 */
export function useAsyncData(asyncFunction, params = [], dependencies = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            setLoading(true);
            try {
                const result = await asyncFunction(...params);
                if (isMounted) {
                    setData(result);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error fetching data:', err);
                    setError(err);
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, dependencies);

    return { data, loading, error };
}
