import { supabase } from "../../../utils/supabase/supabaseConfig";

export async function getUsersActiveTimeLog(userId) {
    const { data, error } = await supabase
        .from('time_logs')
        .select('*')
        .eq('user_id', userId)
        .in('state', ['Running', 'Paused']);

    if (error) console.error(error);
    return data;
}
