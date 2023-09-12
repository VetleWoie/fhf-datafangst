import { createAction } from "@reduxjs/toolkit";
import {  EfficiencyDurationState, EfficiencyViewState } from "./state";

export const setSelectedEfficiency = createAction<EfficiencyViewState | undefined>(
    "efficiency/setSelectedEfficiency",
  );

export const setSelectedEfficiencyDuration = createAction<EfficiencyDurationState[] | undefined>(
  "efficiency/setSelectedEfficiencyDuration",
)

