import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {supabase} from "@/utils/supabase/supabaseConfig";

// Generický thunk pro načítání dat z tabulky
export const fetchDataThunk = (sliceName, tableName, params) => {
    return createAsyncThunk(`${sliceName}/fetchData`, async () => {
        const {data, error} = await supabase.from(tableName).select().match(params);
        if (error) throw error;
        return data;
    });
};

// Generický thunk pro přidání dat do tabulky
export const addDataThunk = (sliceName, tableName) => {
    return createAsyncThunk(`${sliceName}/addData`, async (newData) => {
        const {data, error} = await supabase.from(tableName).insert(newData).select();
        if (error) throw error;
        return data;
    });
};

// Generický thunk pro odebraní dat z tabulky
export const removeDataThunk = (sliceName, tableName) => {
    return createAsyncThunk(`${sliceName}/removeData`, async (id) => {
        const {data, error} = await supabase.from(tableName).delete().eq('id', id).select();
        if (error) throw error;
        return data;
    });
};

// Generický thunk pro update dat tabulky
export const updateDataThunk = (sliceName, tableName) => {
    return createAsyncThunk(`${sliceName}/updateData`, async ({id, updatedData}) => {
        const {data, error} = await supabase.from(tableName).update(updatedData).eq('id', id).select();
        if (error) throw error;
        return data;
    })
}

// Funkce, která vytváří generický slice pro jakoukoli tabulku supabase
export const createGenericSlice = (sliceName, tableName) => {
    const fetchData = fetchDataThunk(sliceName, tableName);
    const addData = addDataThunk(sliceName, tableName);
    const removeData = removeDataThunk(sliceName, tableName);
    const updateData = updateDataThunk(sliceName, tableName);

    return createSlice({
        name: sliceName,
        initialState: {
            data: [],
            status: 'idle',
            error: null,
        },
        reducers: {
            setData: (state, action) => {
                state.data = action.payload;
            },
            add: (state, action) => {
                const newData = action.payload;
                const exists = state.data.some(item => item.id === newData.id)
                if (!exists) {
                    state.data.push(newData);
                }
            },
            update: (state, action) => {
                const index = state.data.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            },
            remove: (state, action) => {
                state.data = state.data.filter((item) => item.id !== action.payload.id);
            },
        },
        extraReducers: (builder) => {
            builder
                //  FetchData
                //
                .addCase(fetchData.pending, (state) => {
                    state.status = 'loading';
                })
                .addCase(fetchData.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.data = action.payload;
                })
                .addCase(fetchData.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.error.message;
                })
                //  AddData
                //
                .addCase(addData.pending, (state, action) => {
                    state.status = 'loading';
                })
                .addCase(addData.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    const newData = action.payload[0];
                    const exists = state.data.some(item => item.id === newData.id)
                    if (!exists) {
                        state.data.push(newData);
                    }
                })
                .addCase(addData.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.error.message;
                })
                //  RemoveData
                //
                .addCase(removeData.pending, state => {
                    state.status = 'loading';
                })
                .addCase(removeData.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    console.log(action)
                    state.data = state.data.filter((item) => item.id !== action.payload[0].id);
                })
                .addCase(removeData.rejected, state => {
                    state.status = 'failed';
                    state.error = action.error.message;
                })
            //  UpdateData
            //
                .addCase(updateData.pending, state => {
                    state.status = 'loading';
                })
                .addCase(updateData.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    console.log(action.payload)
                    // Najdeme položku s odpovídajícím ID a aktualizujeme ji
                    const index = state.data.findIndex((item) => item.id === action.payload[0].id);
                    if (index !== -1) {
                        state.data[index] = action.payload[0]; // Aktualizujeme data na nová data
                    }
                })
                .addCase(updateData.rejected, state => {
                    state.status = 'failed';
                    state.error = action.error.message;
                })
        },
    });
};
