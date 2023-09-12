import { ActionReducerMapBuilder, current } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import {  setSelectedEfficiency, setSelectedEfficiencyDuration , } from "./actions";
import { FilterVesselsOnClass } from "./EfficiencyUtils";

export const efficiencyBuilder = (
    builder: ActionReducerMapBuilder<AppState>,
  ): ActionReducerMapBuilder<AppState> =>
    builder
      .addCase(setSelectedEfficiency, (state, action) => {
        state.selectedTrip = undefined;
        state.selectedHaul = undefined;
        state.selectedEfficiency = action.payload;
        state.efficiencyClass = FilterVesselsOnClass(state.bwProfile,state.vesselsByCallsign)
      })
      .addCase(setSelectedEfficiencyDuration, (state, action) => {
        state.selectedEfficienciyDuration = action.payload;
      })

