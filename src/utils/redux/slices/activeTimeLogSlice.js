import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {supabase} from "@/utils/supabase/supabaseConfig";

export const fetchActiveTimeLog = createAsyncThunk(
    `activeTimeLog/fetch`,
    async (userId) => {
        const {data, error} = await supabase
            .from('time_logs')
            .select('*')
            .eq('user_id', userId)
            .in('state', ['Running', 'Paused']);

        if (error) throw error
        return data;
    }
)
export const updateActiveTimeLog = createAsyncThunk(
    `activeTimeLog/update`,
    async ({action, time_log_id}) => {
        const {data, error} = await supabase.rpc('update_time_log', {
            action: action, time_log_id:time_log_id
        });
        if (error) throw error;
        return data;
    });


const activeTimeLogSlice = createSlice({
    name: 'activeTimeLog',
    initialState: {
        data: null,
        status: 'idle',
        error: null
    },
    reducers: {
        setActiveTimeLog: (state, action) => {
            state.data = action.payload
        },
        removeActiveTimeLog: (state) => {
            state.data = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateActiveTimeLog.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateActiveTimeLog.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const timeLog = action.payload[0];
                state.data = timeLog.state === 'Stopped' ? null : timeLog
            })
            .addCase(updateActiveTimeLog.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchActiveTimeLog.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchActiveTimeLog.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload[0];
            })
            .addCase(fetchActiveTimeLog.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})
export const {setActiveTimeLog, removeActiveTimeLog} = activeTimeLogSlice.actions
export default activeTimeLogSlice.reducer;