import {
    addDataThunk,
    createGenericSlice,
    fetchDataThunk,
    removeDataThunk,
    updateDataThunk
} from "../functions/createGenericSlice";

const ALL_PROJECTS_SLICE = 'allProjects'
const ALL_TICKETS_SLICE = 'allTickets'
const USER_TICKETS_SLICE = 'userTickets'
const PROJECT_TICKETS_SLICE = 'projectTickets'
const TIME_LOGS_SLICE = 'timeLogsSlice'

export const PROJECTS_TABLE_NAME = 'projects'
export const TICKETS_TABLE_NAME = 'tickets'
export const TIME_LOGS_TABLE_NAME = 'time_logs'

//  ProjectsSlice
export const projectsSlice = createGenericSlice(ALL_PROJECTS_SLICE, PROJECTS_TABLE_NAME)
export const fetchProjects = fetchDataThunk(ALL_PROJECTS_SLICE, PROJECTS_TABLE_NAME)
export const addProject = addDataThunk(ALL_PROJECTS_SLICE, PROJECTS_TABLE_NAME)
export const removeProject = removeDataThunk(ALL_PROJECTS_SLICE, PROJECTS_TABLE_NAME)

// TicketsSlice
export const allTicketsSlice = createGenericSlice(ALL_TICKETS_SLICE, TICKETS_TABLE_NAME);
export const fetchAllTickets = fetchDataThunk(ALL_TICKETS_SLICE, TICKETS_TABLE_NAME);
export const addTicketToAll = addDataThunk(ALL_TICKETS_SLICE, TICKETS_TABLE_NAME);
export const removeTicketFromAll = removeDataThunk(ALL_TICKETS_SLICE, TICKETS_TABLE_NAME)

// TicketsSlice
export const userTicketsSlice = createGenericSlice(USER_TICKETS_SLICE, TICKETS_TABLE_NAME);
export const fetchUsersTickets = fetchDataThunk(USER_TICKETS_SLICE, TICKETS_TABLE_NAME);
export const addUsersTicket = addDataThunk(USER_TICKETS_SLICE, TICKETS_TABLE_NAME);
export const removeUsersTicket = removeDataThunk(USER_TICKETS_SLICE, TICKETS_TABLE_NAME)
export const updateUserTicket = updateDataThunk(USER_TICKETS_SLICE, TICKETS_TABLE_NAME)

// TicketsSlice
export const projectTicketsSlice = createGenericSlice(PROJECT_TICKETS_SLICE, TICKETS_TABLE_NAME);
export const fetchProjectsTickets = fetchDataThunk(PROJECT_TICKETS_SLICE, TICKETS_TABLE_NAME);
export const addProjectsTicket = addDataThunk(PROJECT_TICKETS_SLICE, TICKETS_TABLE_NAME);
export const removeProjectsTicket = removeDataThunk(PROJECT_TICKETS_SLICE, TICKETS_TABLE_NAME)

export const timeLogsSlice = createGenericSlice(TIME_LOGS_SLICE, TIME_LOGS_TABLE_NAME);
export const addTimeLog = addDataThunk(TIME_LOGS_SLICE,TIME_LOGS_TABLE_NAME);