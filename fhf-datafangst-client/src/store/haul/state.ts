import { HaulsArgs, HaulsFilter } from "api/haulsApi";
import { getMonth, getYear } from "date-fns";
import { Haul, HaulsMatrix } from "generated/openapi";

export interface HaulState {
  hauls?: Haul[];
  haulsByArea?: Record<string, Haul[]>;
  haulsMatrix?: HaulsMatrix;
  haulsMatrix2?: HaulsMatrix;
  haulsLoading: boolean;
  haulsMatrixLoading: boolean;
  haulsMatrix2Loading: boolean;
  haulsSearch?: HaulsArgs;
  haulsMatrixSearch?: HaulsArgs;
  haulsMatrix2Search?: HaulsArgs;
  hoveredFilter?: HaulsFilter;
  selectedHaul?: Haul;
}

export const initialHaulState: HaulState = {
  hauls: undefined,
  haulsByArea: undefined,
  haulsMatrix: undefined,
  haulsMatrix2: undefined,
  haulsLoading: false,
  haulsMatrixLoading: false,
  haulsMatrix2Loading: false,
  haulsSearch: undefined,
  haulsMatrixSearch: undefined,
  haulsMatrix2Search: undefined,
  hoveredFilter: undefined,
  selectedHaul: undefined,
};

export const initialHaulsMatrixSearch: HaulsArgs = {
  months: [getMonth(new Date())],
  years: [getYear(new Date())],
};
