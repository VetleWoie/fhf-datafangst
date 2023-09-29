import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import {  EfficiencyDurationState, EfficiencyViewState } from "./state";
import * as Api from "api";

export const setSelectedEfficiency = createAction<EfficiencyViewState | undefined>(
    "efficiency/setSelectedEfficiency",
  );

export const setSelectedEfficiencyDuration = createAction<EfficiencyDurationState[] | undefined>(
  "efficiency/setSelectedEfficiencyDuration",
)
export const setSelectedEfficiencyDetailOpen = createAction<boolean >(
  "efficiency/setSelectedEfficiencyDetailOpen",
)

export const getBenchmarks = createAsyncThunk("efficiency/getBenchmark", Api.getBenchmark);


