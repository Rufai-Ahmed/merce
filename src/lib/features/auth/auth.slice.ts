import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  userId: number | null;
}

const initialState: AuthState = {
  token: null,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; userId: number }>) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;