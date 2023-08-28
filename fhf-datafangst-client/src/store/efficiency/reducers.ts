import { ActionReducerMapBuilder, current } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { setSelectedEfficiency } from "./actions";

export const efficiencyBuilder = (
    builder: ActionReducerMapBuilder<AppState>,
  ): ActionReducerMapBuilder<AppState> =>
    builder
      .addCase(setSelectedEfficiency, (state, action) => {
        state.selectedTrip = undefined;
        state.selectedHaul = undefined;
        state.selectedEfficiency = action.payload;
      });