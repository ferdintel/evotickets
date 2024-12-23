import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import currentEventSlice from "./slices/currentEventSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    currentEvent: currentEventSlice.reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
