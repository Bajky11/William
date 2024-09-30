import {supabase} from "@/utils/supabase/supabaseConfig";

export async function getUserProjects(userId){
    const {data, error} = await supabase.from('user_projects_view').select('*').eq('user_id',userId);
    if(error) console.error(error)
    return data;

}