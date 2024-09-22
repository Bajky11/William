import {supabase} from "@/utils/supabase/supabaseConfig";

export async function updateTicketUserId(ticketId, userId){
    const { data, error } = await supabase
        .from('tickets')
        .update({ user_id: userId })
        .eq('id', ticketId);

    if (error) {
        console.error("Error updating ticket:", error);
        return { error: error.message };
    }
}