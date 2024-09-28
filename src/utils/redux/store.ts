// utils/redux/store.ts

import {configureStore} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {
    commentsSlice,
    projectsSlice,
    projectTicketsSlice, timeLogsSlice,
    userTicketsSlice
} from "@/utils/redux/slices/slices";
import loggedUserSliceReducer from "@/utils/redux/slices/loggedUserSlice";
import activeTimeLogReducer from "@/utils/redux/slices/activeTimeLogSlice";
import modalSlice from "@/utils/redux/slices/modalSlice";


export const store = configureStore({
    reducer: {
        modal: modalSlice,
        loggedUser: loggedUserSliceReducer,
        activeTimeLog: activeTimeLogReducer,
        comments: commentsSlice.reducer,
        projects: projectsSlice.reducer,
        usersTickets: userTicketsSlice.reducer,
        projectsTickets: projectTicketsSlice.reducer,
        timeLogs: timeLogsSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
