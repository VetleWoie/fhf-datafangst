import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectEfficiency = createSelector(
  selectAppState,
  (state) => state.selectedEfficiency,
);