import { createAction } from "@reduxjs/toolkit";
import { EfficiencyVesselViewState, EfficiencyViewState } from "./state";

export const setSelectEfficiencies = createAction<EfficiencyViewState[] | undefined>(
    "trip/setSelectEfficiencies",
  );

