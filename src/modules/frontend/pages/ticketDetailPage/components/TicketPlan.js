import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Checkbox,
    List,
    ListItem,
    ListItemText,
    Collapse,
    Box,
    IconButton,
    TextField,
    Switch,
    Alert,
    Stack, Typography
} from '@mui/material';
import { ExpandLess, ExpandMore, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import {
    addTicketTask,
    removeTicketTask,
    TICKET_TASKS_TABLE_NAME,
    ticketTasksSlice,
    updateTicketTask
} from "@/utils/redux/slices/slices";
import useSupabaseRealtimeTable from "@/utils/supabase/hooks/useSupabaseRealtimeTable";

const TaskItem = ({ task, onToggle, onEdit, onRemove, onAddSubtask, level, editMode, isExpanded }) => {
    const [open, setOpen] = useState(isExpanded);  // Set initial open state based on isExpanded
    const [editedTaskName, setEditedTaskName] = useState(task.name);
    const [newSubtaskName, setNewSubtaskName] = useState('');

    const handleToggle = () => {
        onToggle(task.id);
    };

    const handleExpandClick = () => {
        setOpen(!open);
    };

    const handleSaveEdit = () => {
        onEdit(task.id, { name: editedTaskName });
    };

    const handleRemove = () => {
        const confirmRemove = window.confirm("Opravdu chcete tento úkol smazat?");
        if (confirmRemove) {
            onRemove(task.id);
        }
    };

    const handleAddSubtask = () => {
        if (newSubtaskName.trim() !== '') {
            onAddSubtask(task.id, newSubtaskName);
            setNewSubtaskName('');  // Clear input after adding
        }
    };

    return (
        <Box sx={{ marginLeft: level * 2 + 'rem' }}>
            <ListItem sx={{ padding: 0, width: '100%', mt: 1 }}>  {/* Full width ListItem */}
                <Stack alignItems={'center'} direction={'row'} sx={{ width: '100%' }} spacing={1}>
                    <Checkbox
                        edge="start"
                        checked={task.completed}
                        onClick={handleToggle}
                        tabIndex={-1}
                        disableRipple
                    />

                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ width: '100%' }}>
                        <Stack direction={'row'} alignItems={'center'} spacing={3}>
                            {editMode ? (
                                <TextField
                                    value={editedTaskName}
                                    onChange={(e) => setEditedTaskName(e.target.value)}
                                    onBlur={handleSaveEdit}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                                    size="small"
                                    autoFocus
                                    fullWidth
                                />
                            ) : (
                                <ListItemText primary={task.name} />
                            )}
                            {editMode && (
                                <IconButton onClick={handleRemove} edge="end">
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Stack>

                        {(task.subtasks.length > 0 || editMode) && (
                            <IconButton onClick={handleExpandClick}>
                                {open ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        )}
                    </Stack>
                </Stack>
            </ListItem>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {task.subtasks.map((subtask) => (
                        <TaskItem
                            key={subtask.id}
                            task={subtask}
                            onToggle={onToggle}
                            onEdit={onEdit}
                            onRemove={onRemove}
                            onAddSubtask={onAddSubtask}
                            level={level + 1}
                            editMode={editMode}
                            isExpanded={isExpanded}  // Propagate expanded state based on view mode
                        />
                    ))}
                    {editMode && (
                        <Stack direction={'row'} alignItems="center" mt={1}>
                            <TextField
                                label="New Subtask Name"
                                value={newSubtaskName}
                                onChange={(e) => setNewSubtaskName(e.target.value)}
                                size="small"
                                fullWidth
                            />
                            <IconButton onClick={handleAddSubtask} sx={{ ml: 1 }}>
                                <AddIcon />
                            </IconButton>
                        </Stack>
                    )}
                </List>
            </Collapse>
        </Box>
    );
};

const TicketPlan = ({ ticketId }) => {
    const dispatch = useDispatch();
    const filter = useMemo(() => ([{ key: 'ticket_id', value: ticketId }]), [ticketId]);
    useSupabaseRealtimeTable(TICKET_TASKS_TABLE_NAME, ticketTasksSlice.actions, filter);

    const ticketTasks = useSelector(state => state.ticketTasks.data);

    const [editMode, setEditMode] = useState(false);  // State for edit mode
    const [newTaskName, setNewTaskName] = useState('');

    // Build hierarchical task structure from flat task list
    const buildTaskHierarchy = (tasks, parentId = null) => {
        return tasks
            .filter(task => task.parent_id === parentId)
            .map(task => ({
                ...task,
                subtasks: buildTaskHierarchy(tasks, task.id),
            }));
    };

    const tasks = buildTaskHierarchy(ticketTasks);

    const toggleTaskCompletion = (id) => {
        const taskToUpdate = ticketTasks.find(task => task.id === id);
        dispatch(updateTicketTask({ id, updatedData: { completed: !taskToUpdate.completed } }));
    };

    const addTask = () => {
        if (newTaskName.trim() !== '') {
            dispatch(addTicketTask({ name: newTaskName, parent_id: null, ticket_id: ticketId, completed: false }));
            setNewTaskName('');  // Clear input after adding
        }
    };

    const addSubtask = (parentId, subtaskName) => {
        dispatch(addTicketTask({ name: subtaskName, parent_id: parentId, ticket_id: ticketId, completed: false }));
    };

    const removeTask = (id) => {
        dispatch(removeTicketTask(id));
    };

    const editTask = (id, updatedData) => {
        dispatch(updateTicketTask({ id, updatedData }));
    };

    // Logic to expand all tasks when not in edit mode
    const isExpanded = !editMode;  // When not in edit mode, expand all tasks

    return (
        <Box>
            {/* Always show toggle for edit mode */}
            <Box display="flex" alignItems="center">
                <Switch checked={editMode} onChange={() => setEditMode(!editMode)} />
                <Typography>{editMode ? 'Toggle View Mode' : 'Toggle Edit Mode'}</Typography>
            </Box>

            {/* Show alert if no tasks are present and not in edit mode */}
            {tasks.length === 0 && !editMode && (
                <Alert severity={'warning'}>This ticket has no plan. You can create one in edit mode.</Alert>
            )}

            {/* Show input for adding tasks if in edit mode */}


            <List>
                {tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTaskCompletion}
                        onEdit={editTask}
                        onRemove={removeTask}
                        onAddSubtask={addSubtask}
                        level={0}
                        editMode={editMode}
                        isExpanded={isExpanded}  // Expand all tasks when not in edit mode
                    />
                ))}
            </List>

            { editMode && (
                <Stack direction={'row'} alignItems={'center'} spacing={1}>
                    <TextField
                        label="New Task Name"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        size="small"
                        fullWidth
                    />
                    <IconButton onClick={addTask} sx={{ mt: 1 }}>
                        <AddIcon /> {/* Icon for adding a task */}
                    </IconButton>
                </Stack>
            )}
        </Box>
    );
};

export default TicketPlan;
