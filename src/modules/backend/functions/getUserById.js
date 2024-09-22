import {supabase} from "@/utils/supabase/supabaseConfig";

export async function getUserById(userId) {
    const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)

    if (error) console.error(error);
    return data[0];
}