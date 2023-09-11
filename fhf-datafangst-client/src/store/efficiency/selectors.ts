import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectEfficiencies = createSelector(
  selectAppState,
  (state) => state.selectedEfficiencies,
);

export const selectEfficiencyClass = createSelector(
  selectAppState,
  (state) => state.efficiencyClass,
)