import { createSelector } from "@reduxjs/toolkit";
import { HaulsArgs, HaulsFilter } from "api";
import { getAllYearsArray } from "components/Filters/YearsFilter";
import {
  GearGroup,
  HaulsSorting,
  Ordering,
  SpeciesGroup,
} from "generated/openapi";
import { LengthGroups } from "models";
import { selectSelectedGridsString } from "store/fishmap";
import { selectGearGroupsSorted } from "store/gear";
import { selectAppState } from "store/selectors";
import { selectSpeciesGroupsSorted } from "store/species";
import { fishingLocationAreas, matrixSum, MinErsYear, sumCatches } from "utils";

export const selectShowHaulTimeSlider = createSelector(
  selectAppState,
  (state) =>
    (!!state.haulsMatrix || state.haulsMatrixLoading) &&
    !state.selectedTrip &&
    state.trips === undefined &&
    !state.selectedGrids.length &&
    state.fishingFacilities === undefined &&
    !state.fishingFacilitiesLoading &&
    !state.tripsLoading,
);

export const selectHaulsLoading = createSelector(
  selectAppState,
  (state) => state.haulsLoading,
);

export const selectHaulsMatrixLoading = createSelector(
  selectAppState,
  (state) => state.haulsMatrixLoading,
);

export const selectHaulsMatrix2Loading = createSelector(
  selectAppState,
  (state) => state.haulsMatrix2Loading,
);

export const selectHaulsSearch = createSelector(
  selectAppState,
  (state) => state.haulsSearch,
);

export const selectHaulsMatrixSearch = createSelector(
  selectAppState,
  (state) => state.haulsMatrixSearch,
);

export const selectHaulsMatrix2Search = createSelector(
  selectAppState,
  (state) => state.haulsMatrix2Search,
);

export const selectHauls = createSelector(
  selectAppState,
  (state) => state.hauls ?? {},
);

export const selectHaulsSorted = (sorting: HaulsSorting, ordering: Ordering) =>
  createSelector(selectHauls, (state) => {
    if (!Object.keys(state).length) {
      return state;
    }

    if (ordering === Ordering.Desc && sorting === HaulsSorting.StartDate) {
      return Object.values(state).sort(
        (a, b) =>
          new Date(b.startTimestamp).getTime() -
          new Date(a.startTimestamp).getTime(),
      );
    } else if (
      ordering === Ordering.Asc &&
      sorting === HaulsSorting.StartDate
    ) {
      return Object.values(state).sort(
        (a, b) =>
          new Date(a.startTimestamp).getTime() -
          new Date(b.startTimestamp).getTime(),
      );
    } else if (ordering === Ordering.Desc && sorting === HaulsSorting.Weight) {
      return Object.values(state).sort(
        (a, b) => sumCatches(b.catches) - sumCatches(a.catches),
      );
    } else if (ordering === Ordering.Asc && sorting === HaulsSorting.Weight) {
      return Object.values(state).sort(
        (a, b) => sumCatches(a.catches) - sumCatches(b.catches),
      );
    }
    return state;
  });

export const selectHaulsMatrix = createSelector(
  selectAppState,
  (state) => state.haulsMatrix,
);

export const selectHaulsMatrix2 = createSelector(
  selectAppState,
  (state) => state.haulsMatrix2,
);

export const selectSelectedHaul = createSelector(
  selectAppState,
  (state) => state.selectedHaul,
);

export const selectSelectedTripHaul = createSelector(
  selectAppState,
  (state) => state.selectedTripHaul,
);

export const selectHaulsFilter = createSelector(
  selectHaulsMatrixSearch,
  (state) =>
    state?.filter === HaulsFilter.Vessel
      ? HaulsFilter.VesselLength
      : state?.filter,
);

export const selectHaulDateSliderFrame = createSelector(
  selectAppState,
  (state) => state.haulDateSliderFrame,
);

const getIndexes = (original: { id: any }[], selected?: { id: any }[]) =>
  selected?.reduce((tot: number[], cur) => {
    const idx = original.findIndex((o) => o.id === cur.id);
    if (idx >= 0) {
      tot.push(idx);
    }
    return tot;
  }, []) ?? [];

const _selectHaulsActiveFilterSelectedIndexes = (
  search: HaulsArgs | undefined,
  gearGroups: GearGroup[],
  speciesGroups: SpeciesGroup[],
  currentDateSliderFrame?: Date,
) => {
  if (search)
    switch (search.filter) {
      case HaulsFilter.Date:
        if (
          !search.years?.length &&
          !search.months?.length &&
          !currentDateSliderFrame
        ) {
          return [];
        }

        const now = new Date();
        const datesLength = (now.getFullYear() + 1) * 12 - MinErsYear * 12;
        const originalDates = Array.from({ length: datesLength }, (_, i) => ({
          id: MinErsYear * 12 + i,
        }));

        if (currentDateSliderFrame) {
          const d = currentDateSliderFrame;
          return getIndexes(originalDates, [
            { id: d.getFullYear() * 12 + d.getMonth() },
          ]);
        }

        const years = search.years?.length
          ? search.years
          : getAllYearsArray(MinErsYear);
        const months = search.months?.length
          ? search.months
          : Array.from({ length: 12 }, (_, i) => i + 1);

        const selectedDates = years
          .map((y) => months.map((m) => ({ id: y * 12 + m - 1 })))
          .flat();

        return getIndexes(originalDates, selectedDates);
      case HaulsFilter.GearGroup:
        return getIndexes(gearGroups, search?.gearGroupIds);
      case HaulsFilter.SpeciesGroup:
        return getIndexes(speciesGroups, search?.speciesGroupIds);
      case HaulsFilter.VesselLength:
        return getIndexes(LengthGroups, search?.vesselLengthRanges);
    }

  return [];
};

export const selectHaulsMatrixActiveFilterSelectedIndexes = createSelector(
  selectHaulsMatrixSearch,
  selectGearGroupsSorted,
  selectSpeciesGroupsSorted,
  selectHaulDateSliderFrame,
  _selectHaulsActiveFilterSelectedIndexes,
);

export const selectHaulsMatrix2ActiveFilterSelectedIndexes = createSelector(
  selectHaulsMatrix2Search,
  selectGearGroupsSorted,
  selectSpeciesGroupsSorted,
  _selectHaulsActiveFilterSelectedIndexes,
);

export const selectHaulLocationsMatrix = createSelector(
  selectHaulsMatrix,
  selectHaulsFilter,
  (matrix, filter) => {
    switch (filter) {
      case HaulsFilter.Date:
        return matrix?.dates;
      case HaulsFilter.GearGroup:
        return matrix?.gearGroup;
      case HaulsFilter.SpeciesGroup:
        return matrix?.speciesGroup;
      case HaulsFilter.VesselLength:
        return matrix?.lengthGroup;
    }
  },
);

const computeStats = (
  matrix: number[],
  widthArray: { id: any }[],
  filters: number[],
  activeFilters?: number[],
) => {
  const stats = [];
  const width = widthArray.length;
  const height = matrix.length / width;

  if (activeFilters?.length)
    for (let x = 0; x < width; x++) {
      let value = 0;
      for (let i = 0; i < activeFilters.length; i++) {
        const y = activeFilters[i];
        if (y < height) {
          value += matrixSum(matrix, width, x, y, x, y);
        }
      }
      if (value > 0 || filters.includes(x)) {
        stats.push({ id: widthArray[x].id, value });
      }
    }
  else
    for (let x = 0; x < width; x++) {
      const value = matrixSum(matrix, width, x, 0, x, height - 1);
      if (value > 0 || filters.includes(x)) {
        stats.push({ id: widthArray[x].id, value });
      }
    }

  return stats;
};

const selectGearFilterStats = createSelector(
  selectHaulsMatrix,
  selectHaulsMatrixSearch,
  selectHaulsFilter,
  selectGearGroupsSorted,
  selectHaulsMatrixActiveFilterSelectedIndexes,
  (matrix, search, filter, gearGroups, activeSelected) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(gearGroups, search?.gearGroupIds);
    return computeStats(
      matrix.gearGroup,
      gearGroups,
      selected,
      filter === HaulsFilter.GearGroup ? undefined : activeSelected,
    );
  },
);

export const selectHaulGearFilterStats = createSelector(
  selectGearFilterStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

const selectSelectedGridLocationIndexes = createSelector(
  selectSelectedGridsString,
  (state) =>
    state.reduce((tot: number[], cur) => {
      const idx = fishingLocationAreas.indexOf(cur);
      if (idx >= 0) {
        tot.push(idx);
      }
      return tot;
    }, []),
);

const selectGearFilterGridStats = createSelector(
  selectHaulsMatrix2,
  selectHaulsMatrix2Search,
  selectGearGroupsSorted,
  selectHaulsMatrix2ActiveFilterSelectedIndexes,
  selectSelectedGridLocationIndexes,
  (matrix, search, gearGroups, activeSelected, selectedLocations) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(gearGroups, search?.gearGroupIds);
    return computeStats(
      matrix.gearGroup,
      gearGroups,
      selected,
      search?.filter === HaulsFilter.GearGroup
        ? selectedLocations
        : activeSelected,
    );
  },
);

export const selectHaulGearFilterGridStats = createSelector(
  selectGearFilterGridStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

const selectSpeciesFilterStats = createSelector(
  selectHaulsMatrix,
  selectHaulsMatrixSearch,
  selectHaulsFilter,
  selectSpeciesGroupsSorted,
  selectHaulsMatrixActiveFilterSelectedIndexes,
  (matrix, search, filter, speciesGroups, activeSelected) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(speciesGroups, search?.speciesGroupIds);
    return computeStats(
      matrix.speciesGroup,
      speciesGroups,
      selected,
      filter === HaulsFilter.SpeciesGroup ? undefined : activeSelected,
    );
  },
);

export const selectHaulSpeciesFilterStats = createSelector(
  selectSpeciesFilterStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

const selectSpeciesFilterGridStats = createSelector(
  selectHaulsMatrix2,
  selectHaulsMatrix2Search,
  selectSpeciesGroupsSorted,
  selectHaulsMatrix2ActiveFilterSelectedIndexes,
  selectSelectedGridLocationIndexes,
  (matrix, search, speciesGroups, activeSelected, selectedLocations) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(speciesGroups, search?.speciesGroupIds);
    return computeStats(
      matrix.speciesGroup,
      speciesGroups,
      selected,
      search?.filter === HaulsFilter.SpeciesGroup
        ? selectedLocations
        : activeSelected,
    );
  },
);

export const selectHaulSpeciesFilterGridStats = createSelector(
  selectSpeciesFilterGridStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

const selectVesselLengthFilterStats = createSelector(
  selectHaulsMatrix,
  selectHaulsMatrixSearch,
  selectHaulsFilter,
  selectHaulsMatrixActiveFilterSelectedIndexes,
  (matrix, search, filter, activeSelected) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(LengthGroups, search?.vesselLengthRanges);
    return computeStats(
      matrix.lengthGroup,
      LengthGroups,
      selected,
      filter === HaulsFilter.VesselLength ? undefined : activeSelected,
    );
  },
);

export const selectHaulVesselLengthFilterStats = createSelector(
  selectVesselLengthFilterStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);

const selectVesselLengthFilterGridStats = createSelector(
  selectHaulsMatrix2,
  selectHaulsMatrix2Search,
  selectHaulsMatrix2ActiveFilterSelectedIndexes,
  selectSelectedGridLocationIndexes,
  (matrix, search, activeSelected, selectedLocations) => {
    if (!matrix) {
      return [];
    }

    const selected = getIndexes(LengthGroups, search?.vesselLengthRanges);
    return computeStats(
      matrix.lengthGroup,
      LengthGroups,
      selected,
      search?.filter === HaulsFilter.VesselLength
        ? selectedLocations
        : activeSelected,
    );
  },
);

export const selectHaulVesselLengthFilterGridStats = createSelector(
  selectVesselLengthFilterGridStats,
  (state) => [...state].sort((a, b) => b.value - a.value),
);
