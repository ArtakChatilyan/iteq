import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { basketAPI, usersAPI } from "../components/dalUser/userApi";

let initialState = {
  loading: true,
  isAuth: false,
  userRole: "",
  user: { userId: 0, name: "", phone: "", email: "" },
  error: "",
  message: "",
  registerSuccess: false,
  basketItemsCount: 0
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
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log(action.payload);

        if (action.payload.status) {
          if (action.payload.status === 400) {
            state.error = action.payload.error;
            state.message = "";
          }
        } else {
          state.registerSuccess = true;
          state.message = "Check your email for activation.";
          state.error = "";
        }
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
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
        state.loading = false;
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
        state.user = { userId: 0, name: "", phone: "", email: "" };
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(checkAuth.pending, (state, action) => {
        state.loading = true;
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
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(resend.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(resend.fulfilled, (state, action) => {
        if (action.payload.status) {
        } else {
        }
        state.loading = false;
      })
      .addCase(resend.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(changePassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        if (action.payload.status) {
          if (action.payload.status === 400) {
            state.error = action.payload.error;
            state.message = "";
          }
        } else {
          state.error = "";
          state.message = action.payload.result;
        }
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getBasketItemsCount.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getBasketItemsCount.fulfilled, (state, action) => {
        if (action.payload.status) {
          if (action.payload.status === 400) {
            state.error = action.payload.error;
            state.message = "";
          }
        } else {
          state.basketItemsCount=action.payload.total;
          state.error = "";
        }
        state.loading = false;
      })
      .addCase(getBasketItemsCount.rejected, (state, action) => {
        state.loading = false;
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
    return e.response.data;
  }
});

export const resend = createAsyncThunk("user/resend", async () => {
  try {
    const response = await usersAPI.resend();
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});

export const recover = createAsyncThunk("user/recover", async (data) => {
  try {
    const response = await usersAPI.recover(data);
    return response.data;
  } catch (e) {
    return { status: e.response.status, error: e.response.data.message };
  }
});

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (data) => {
    try {
      const response = await usersAPI.changePassword(data);
      return response.data;
    } catch (e) {
      return { status: e.response.status, error: e.response.data.message };
    }
  }
);

export const getBasketItemsCount = createAsyncThunk(
  "user/getBasketItemsCount",
  async (userId) => {
    try {
      if(userId==0){
        return {total: 0};
      }else{
        const response=await basketAPI.getUserTotal(userId);
        return response.data;
      }
    } catch (e) {
      return { status: e.response.status, error: e.response.data.message };
    }
  }
);

export const { setUser, setAuth, setLoading, setMessage } = userSlice.actions;

export default userSlice.reducer;
