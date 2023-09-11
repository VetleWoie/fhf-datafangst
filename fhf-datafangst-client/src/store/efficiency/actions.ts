import { createAction } from "@reduxjs/toolkit";
import {  EfficiencyViewState } from "./state";

export const setSelectEfficiencies = createAction<EfficiencyViewState[] | undefined>(
    "efficiency/setSelectEfficiencies",
  );



