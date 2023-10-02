import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectEfficiency = createSelector(
  selectAppState,
  (state) => state.selectedEfficiency,
);
export const selectEfficiencyDetailOpen= createSelector(
  selectAppState,
  (state) => state.selectedEfficiencyDetailOpen,
);

export const selectEfficiencyDuration = createSelector(
  selectAppState,
  (state) => state.selectedEfficienciyDuration,
)

export const selectEfficiencyClass = createSelector(
  selectAppState,
  (state) => state.efficiencyClass,
)

export const selectBenchmarks = createSelector(selectAppState, (state) => state.benchmarks);