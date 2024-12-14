import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from "axios";

const API_URL = process.env.REACT_APP_BACKEND || "http://localhost:8000";

interface AuthState {
  user: any | null;
  insights: any[]; 
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"), 
  insights: [],
  isError: false,
  isSuccess: !!localStorage.getItem("user"),
  isLoading: false,
  message: "",
};


const getToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const getUUID = () => {
  const uuid = localStorage.getItem("uuid");
  if (!uuid) {
    console.error("UUID not found in localStorage!");
  }
  return uuid;
};


const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
});


axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          console.error("No refresh token available for reauthentication.");
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${API_URL}/refresh`, {
          refresh_token: refreshToken,
        });

        const newToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;
        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        localStorage.clear(); 
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export const LoginUser = createAsyncThunk(
  "user/LoginUser",
  async (user: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/login",
        new URLSearchParams({
          username: user.email,
          password: user.password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      localStorage.setItem("uuid", response.data.uuid);
      localStorage.setItem("user", JSON.stringify(response.data));

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.detail || error.message;
      console.error("Login error:", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/me");
    console.log("User data retrieved successfully:", response.data);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.message;
    console.error("Error fetching user data:", message);
    return thunkAPI.rejectWithValue(message);
  }
});


export const rehydrate = createAsyncThunk("auth/rehydrate", async (_, thunkAPI) => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
});


export const LogOut = createAsyncThunk("user/LogOut", async () => {
  try {
    await axiosInstance.delete("/logout");
  } catch (error) {
    console.warn("Logout request failed. Clearing local storage anyway.");
  } finally {
    localStorage.clear();
    window.location.href = "/";
  }
});

export const generateInsights = createAsyncThunk(
  "insights/generateInsights",
  async (payload: any, thunkAPI) => {
    try {
      const uuid = getUUID(); 
      const response = await axiosInstance.post("/generate-insights", {
        ...payload,
        uuid, 
      });
      return response.data.insights;
    } catch (error: any) {
      const message = error.response?.data?.detail || error.message;
      console.error("Error generating insights:", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = !!localStorage.getItem("user"); 
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSuccess = true;
      })
      .addCase(rehydrate.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSuccess = !!action.payload;
      })
      .addCase(LogOut.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false;
        localStorage.clear();
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
