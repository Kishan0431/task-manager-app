import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  username: string; // 👈 Add this line
};

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// 👇 Modified to accept username
export const fetchTasks = createAsyncThunk("tasks/fetch", async (username: string) => {
  const response = await axios.get(`/tasks?username=${username}`);
  return response.data;
});

export const addTask = createAsyncThunk(
  "tasks/add",
  async (task: Omit<Task, "id">) => {
    const response = await axios.post("/tasks", task);
    return response.data;
  }
);

export const updateTask = createAsyncThunk("tasks/update", async (task: Task) => {
  const response = await axios.put(`/tasks/${task.id}`, task);
  return response.data;
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id: number) => {
  await axios.delete(`/tasks/${id}`);
  return id;
});

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch tasks";
        state.loading = false;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
