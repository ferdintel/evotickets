import { RootState } from "..";
import { createSlice } from "@reduxjs/toolkit";
import { CurrentEventDataSerialized } from "types/Events";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CurrentEventState {
  data: CurrentEventDataSerialized | null;
}
const initialState: CurrentEventState = {
  data: null,
};

const currentEventSlice = createSlice({
  name: "currentEvent",
  initialState,

  reducers: {
    setCurrentEvent: (
      state,
      action: PayloadAction<CurrentEventDataSerialized>
    ) => {
      state.data = action.payload;
    },
  },
});

export const { setCurrentEvent } = currentEventSlice.actions;
export const selectCurrentEvent = (state: RootState) => state.currentEvent.data;
export default currentEventSlice;
