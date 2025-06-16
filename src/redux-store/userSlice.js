import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { usersAPI } from "../components/dalUser/userApi";

let initialState = {
  loading: true,
  isAuth: false,
  userRole: "",
  user: { id: 0, name: "", phone: "", email: "" },
  error: "",
  message: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.user;
    },
    setAuth: (state, action) => {
      state.isAuth = action.auth;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.message;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(register.pending, (state, action) => {
        state.loading=true;
      })
      .addCase(register.fulfilled, (state, action) => {
        if (action.payload.status) {
          if (action.payload.status === 400) {
            state.error = action.payload.error;
            state.message = "";
          }
        } else {
          state.message = "Check your email for activation.";
          state.error = "";
        }
        state.loading=false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading=false;
      })
      .addCase(login.pending, (state, action) => {
        setLoading(true);
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload.status) {
          if (action.payload.status === 400) {
            state.error = action.payload.error;
          }
        } else {
          state.error = "";
          localStorage.setItem("tokenIteq", action.payload.accessToken);
          state.isAuth = true;
          state.user = action.payload.user;
          state.userRole = action.payload.user.role === 1 ? "admin" : "user";
        }
        state.loading=false;
      })
      .addCase(login.rejected, (state, action) => {
        setLoading(false);
      })
      .addCase(logout.pending, (state, action) => {
        setLoading(true);
      })
      .addCase(logout.fulfilled, (state, action) => {
        localStorage.removeItem("tokenIteq");
        state.isAuth = false;
        state.userRole = "";
        state.user = { id: 0, name: "", phone: "", email: "" };
        state.loading=false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading=false;
      })
      .addCase(checkAuth.pending, (state, action) => {
        state.loading=true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload.status) {
          if (action.payload.status === 400) {
            state.error = action.payload.error;
          }
        } else {
          state.error = "";
          localStorage.setItem("tokenIteq", action.payload.accessToken);
          state.isAuth = true;
          state.user = action.payload.user;
          state.userRole = action.payload.user.role === 1 ? "admin" : "user";
        }
        state.loading=false;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading=false;
      });
  },
});

export const register = createAsyncThunk("user/register", async (data) => {
  try {
    const response = await usersAPI.registration(data);
    return response.data;
  } catch (e) {
    return { status: e.response.status, error: e.response.data.message };
  }
});

export const login = createAsyncThunk("user/login", async (data) => {
  try {
    const response = await usersAPI.login(data);
    return response.data;
  } catch (e) {
    return { status: e.response.status, error: e.response.data.message };
  }
});

export const logout = createAsyncThunk("user/logout", async () => {
  try {
    const response = await usersAPI.logout();
    return response.data;
  } catch (e) {
    return e.response.data.message;
  }
});

export const checkAuth = createAsyncThunk("user/checkAuth", async () => {
  try {
    const response = await usersAPI.checkAuth();
    return response.data;
  } catch (e) {
    return e.response.data.message;
  }
});

export const { setUser, setAuth, setLoading, setMessage } = userSlice.actions;

export default userSlice.reducer;