import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectFishingFacilitiesLoading = createSelector(
  selectAppState,
  (state) => state.fishingFacilitiesLoading,
);

export const selectFishingFacilities = createSelector(
  selectAppState,
  (state) => state.fishingFacilities,
);
