// src/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Create a slice for managing tasks
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      state.push({
        id: Date.now(),
        text: action.payload.text,
        assignedTo: action.payload.assignedTo,
        completed: false,
        comments: [],
      });
    },
    removeTask: (state, action) => {
      return state.filter((task) => task.id !== action.payload);
    },
    completeTask: (state, action) => {
      const task = state.find((task) => task.id === action.payload.id);
      if (task) {
        task.completed = true;
        task.comments.push(action.payload.comment);
      }
    },
    reassignTask: (state, action) => {
      const task = state.find((task) => task.id === action.payload.id);
      if (task) {
        task.assignedTo = action.payload.assignedTo;
        task.comments.push(action.payload.comment);
      }
    },
  },
});

// Export actions
export const { addTask, removeTask, completeTask, reassignTask } = tasksSlice.actions;

// Configure store
const store = configureStore({
  reducer: {
    tasks: tasksSlice.reducer,
  },
});

export default store;
