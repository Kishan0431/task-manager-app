// features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Types
type User = { username: string; email: string; password: string };
type AuthState = {
  user: { username: string } | null;
  loading: boolean;
  error: string;
};

// LocalStorage Helpers
const getStoredUsers = (): User[] => {
  const users = localStorage.getItem("registered_users");
  return users ? JSON.parse(users) : [];
};

const saveUserToStorage = (newUser: User) => {
  const users = getStoredUsers();
  users.push(newUser);
  localStorage.setItem("registered_users", JSON.stringify(users));
};

const saveCurrentUser = (username: string) => {
  const currentUser = { username };
  localStorage.setItem("user", JSON.stringify(currentUser));
};

const clearCurrentUser = () => {
  localStorage.removeItem("user");
};

// Async Thunks
export const register = createAsyncThunk<
  { username: string },
  { username: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async ({ username, email, password }, thunkAPI) => {
  const users = getStoredUsers();
  const existingUser = users.find(
    (u) => u.username === username || u.email === email
  );
  if (existingUser) {
    return thunkAPI.rejectWithValue("User already exists");
  }

  const newUser = { username, email, password };
  saveUserToStorage(newUser);
  saveCurrentUser(username);
  return { username };
});

export const login = createAsyncThunk<
  { username: string },
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ username, password }, thunkAPI) => {
  const users = getStoredUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return thunkAPI.rejectWithValue("Invalid credentials");
  }

  saveCurrentUser(username);
  return { username };
});

// Initial State
const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  error: "",
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      clearCurrentUser();
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        saveCurrentUser(action.payload.username); // ✅ Save again to be safe
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        saveCurrentUser(action.payload.username); // ✅ Save again to be safe
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
