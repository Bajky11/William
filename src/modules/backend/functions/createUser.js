import {supabase} from "@/utils/supabase/supabaseConfig";

export async function createUser(name, loginId) {
    await supabase.from('users').insert({
        name: name,
        login_id: loginId
    });
}