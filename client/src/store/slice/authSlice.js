import { createSlice } from "@reduxjs/toolkit";

// pull persisted state from localStorage (if any)
const storedAuth = JSON.parse(localStorage.getItem("authState") || "{}");

const initialState = {
  user: storedAuth.user || null,
  token: storedAuth.token || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      state.token = token;
      // persist to localStorage
      localStorage.setItem(
        "authState",
        JSON.stringify({
          user: state.user,
          token: state.token,
        })
      );
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("authState");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
