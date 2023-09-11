import { ActionReducerMapBuilder, current } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import {  setSelectEfficiencies , } from "./actions";
import { FilterVesselsOnClass } from "./EfficiencyUtils";

export const efficiencyBuilder = (
    builder: ActionReducerMapBuilder<AppState>,
  ): ActionReducerMapBuilder<AppState> =>
    builder
      .addCase(setSelectEfficiencies, (state, action) => {
        state.selectedTrip = undefined;
        state.selectedHaul = undefined;
        state.selectedEfficiencies = action.payload;
        state.efficiencyClass = FilterVesselsOnClass(state.bwProfile,state.vesselsByCallsign)
      })
      
