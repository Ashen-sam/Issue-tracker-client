import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  user: {
    id: string;
    name: string;
    _id: string;
    email: string;
  } | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        user: { id: string; name: string; email: string };
      }>
    ) => {
      state.token = action.payload.token;
      state.user = {
        ...action.payload.user,
        _id: action.payload.user.id,
      };
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
