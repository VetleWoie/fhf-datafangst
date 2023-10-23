import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectBenchmarkModal = createSelector(
  selectAppState,
  (state) => state.benchmarkModal,
);
export const selectBenchmarkDataSource = createSelector(
  selectAppState,
  (state) => state.benchmarkDataSource,
);
export const selectBenchmarkNumHistoric = createSelector(
  selectAppState,
  (state) => state.benchmarkNumHistoric,
);
export const selectBenchmarkHistoric = createSelector(
  selectAppState,
  (state) => state.benchmarkHistoric,
);
export const selectBenchmarkTrips = createSelector(
  selectAppState,
  (state) => state.benchmarkTrips,
)