import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {supabase} from "../supabaseConfig";
/*
In components where you want to fetch all data (filter=null, enabled=true)
useSupabaseRealtimeTable('tickets', allTicketsSlice.actions);

In scenarios where you don't want to fetch any data: (filter=any, enabled=false)
useSupabaseRealtimeTable('tickets', someSlice.actions, false);

In scenarios where you want to fetch only filtered data or no data. (Waiting for redux to introduce value, after it is introduced, hook is called with filter and enabled, otherwise the hook is disabled)
const value = useSelector(state => state.value)
const filter = useMemo(() => {key:"id", value: value},[value])
const enabled = value != null
useSupabaseRealtimeTable('tickets', someSlice.actions, filter, enabled);

* */
const useSupabaseRealtimeTable = (tableName, sliceActions, filter = null, enabled = true) => {
    const dispatch = useDispatch();

    const fetchData = async () => {
        let query = supabase.from(tableName).select('*');

        if (filter) {
            query = query.eq(filter.key, filter.value);
        }

        const {data, error} = await query;

        if (error) {
            console.error('Error fetching data:', error);
            // Optionally, dispatch an action to set error state
            // dispatch(sliceActions.setError(error.message));
            return;
        }

        dispatch(sliceActions.setData(data));
    };

    // Nastavení listeneru pro realtime změny v tabulce
    const setupRealtimeUpdates = () => {
        const subscription = supabase
            .channel(`public:${tableName}`)
            .on(
                'postgres_changes',
                {event: '*', schema: 'public', table: tableName},
                (payload) => {
                    const {eventType, new: newData, old: oldData} = payload;

                    // Apply filter to the incoming data
                    if (filter && newData && newData[filter.key] !== filter.value) {
                        return; // Ignore this update as it doesn't match the filter
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
        //console.log('Subscription added for', tableName);

        // Odstranění listeneru při odpojení komponenty
        return () => {
            supabase.removeChannel(subscription);
            //console.log('Subscription removed for', tableName);
        };
    };


    useEffect(() => {
        if (!enabled) {
            // Do not fetch data or set up subscription
            return;
        }

        if (filter && (!filter.key || filter.value === undefined || filter.value === null)) {
            console.warn("Filter not valid");
            return;
        }

        fetchData();
        const cleanup = setupRealtimeUpdates(); // Nastavení listeneru
        return () => cleanup(); // Čištění listeneru při unmountu komponenty


    }, [tableName, filter, sliceActions,enabled]);
};

export default useSupabaseRealtimeTable;