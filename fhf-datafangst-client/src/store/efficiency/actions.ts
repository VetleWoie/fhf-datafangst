import { createAction } from "@reduxjs/toolkit";
import { EfficiencyViewState } from "./state";

export const setSelectedEfficiency = createAction<EfficiencyViewState | undefined>(
    "trip/setSelectedEfficiency",
  );