import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {supabase} from "../supabaseConfig";

//IF YOU WANT TO NEGATE FILTER:            [ {key: 'state',value: 'closed', negate: true} ]

const useSupabaseRealtimeTable = (tableName, sliceActions, filters = null, enabled = true) => {
    const dispatch = useDispatch();

    const fetchData = async () => {
        let query = supabase.from(tableName).select('*');

        // Ensure filters is always an array
        const activeFilters = Array.isArray(filters) ? filters : [];

        if (activeFilters.length > 0) {
            activeFilters.forEach(filter => {
                if (filter.negate) {
                    query = query.neq(filter.key, filter.value); // Použití negace
                } else {
                    query = query.eq(filter.key, filter.value); // Klasické filtrování
                }
            });
        }

        const {data, error} = await query;

        if (error) {
            console.error('Error fetching data:', error);
            return;
        }
        console.log(`fetched data from table: ${tableName}`)
        console.log(data)
        console.log('')
        dispatch(sliceActions.setData(data));
    };

    const setupRealtimeUpdates = () => {
        const subscription = supabase
            .channel(`public:${tableName}`)
            .on(
                'postgres_changes',
                {event: '*', schema: 'public', table: tableName},
                (payload) => {
                    const {eventType, new: newData, old: oldData} = payload;

                    const activeFilters = Array.isArray(filters) ? filters : [];

                    // Apply filters to the incoming data
                    if (activeFilters.length > 0) {
                        const matchesFilters = activeFilters.every(filter => {
                            if (filter.negate) {
                                return newData && newData[filter.key] !== filter.value;
                            } else {
                                return newData && newData[filter.key] === filter.value;
                            }
                        });
                        if (!matchesFilters) {
                            return; // Ignore this update as it doesn't match the filters
                        }
                    }

                    switch (eventType) {
                        case 'INSERT':
                            dispatch(sliceActions.add(newData)); // Přidání nového záznamu
                            break;
                        case 'UPDATE':
                            dispatch(sliceActions.update(newData)); // Aktualizace existujícího záznamu
                            break;
                        case 'DELETE':
                            dispatch(sliceActions.remove(oldData)); // Smazání záznamu
                            break;
                        default:
                            break;
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    };

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const activeFilters = Array.isArray(filters) ? filters : [];

        if (activeFilters.some(filter => !filter.key || filter.value === undefined || filter.value === null)) {
            console.warn("Some filters are not valid");
            return;
        }

        fetchData();
        const cleanup = setupRealtimeUpdates();
        return () => cleanup();

    }, [tableName, filters, sliceActions, enabled]);
};

export default useSupabaseRealtimeTable;
