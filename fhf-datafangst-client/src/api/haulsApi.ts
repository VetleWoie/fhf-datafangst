import { apiConfiguration, apiGet, axiosInstance } from ".";
import {
  ActiveHaulsFilter,
  GearGroup,
  HaulsSorting,
  Ordering,
  SpeciesGroup,
  V1haulApi,
  Vessel,
} from "generated/openapi";
import { LengthGroup } from "models";
import {
  createTimestampsFromYearsMonths,
  createVesselLengthQueryString,
} from "./utils";
import { MinErsYear } from "utils";

export const HaulsFilter = {
  ...ActiveHaulsFilter,
  Vessel: "vessel",
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type HaulsFilter = (typeof HaulsFilter)[keyof typeof HaulsFilter];

export interface HaulsArgs {
  years?: number[];
  months?: number[];
  vessels?: Vessel[];
  catchLocations?: string[];
  gearGroupIds?: GearGroup[];
  speciesGroupIds?: SpeciesGroup[];
  vesselLengthRanges?: LengthGroup[];
  filter?: HaulsFilter;
  ordering?: Ordering;
  sorting?: HaulsSorting;
}

const api = new V1haulApi(apiConfiguration, undefined, axiosInstance);

export const getHauls = async (query: HaulsArgs) =>
  apiGet(async () =>
    api.hauls({
      months: query.years
        ? createTimestampsFromYearsMonths(query.years, query.months, MinErsYear)
            ?.map((g) => g.toISOString())
            .toString()
        : undefined,
      fiskeridirVesselIds: query.vessels
        ?.map((v) => v.fiskeridir.id)
        .toString(),
      catchLocations: query.catchLocations?.join(","),
      gearGroupIds: query.gearGroupIds?.map((g) => g.id).toString(),
      speciesGroupIds: query.speciesGroupIds?.map((g) => g.id).toString(),
      vesselLengthRanges: createVesselLengthQueryString(
        query.vesselLengthRanges,
      ),
      ordering: query?.ordering ?? Ordering.Desc,
      sorting: query.sorting ?? HaulsSorting.StartDate,
    }),
  );

export const getHaulsMatrix = async (query: HaulsArgs) =>
  apiGet(async () =>
    api.haulsMatrix({
      activeFilter:
        query.filter === HaulsFilter.Vessel
          ? ActiveHaulsFilter.VesselLength
          : (query.filter as ActiveHaulsFilter),
      months:
        query.filter === HaulsFilter.Date
          ? undefined
          : createTimestampsFromYearsMonths(
              query.years,
              query.months,
              MinErsYear,
            )
              ?.map((d) => d.getFullYear() * 12 + d.getMonth())
              .join(","),
      fiskeridirVesselIds: query.vessels
        ?.map((v) => v.fiskeridir.id)
        .toString(),
      catchLocations: query.catchLocations?.join(","),
      gearGroupIds:
        query.filter === HaulsFilter.GearGroup
          ? undefined
          : query.gearGroupIds?.map((g) => g.id).toString(),
      speciesGroupIds:
        query.filter === HaulsFilter.SpeciesGroup
          ? undefined
          : query.speciesGroupIds?.map((g) => g.id).toString(),
      vesselLengthGroups:
        query.filter === HaulsFilter.VesselLength
          ? undefined
          : query.vesselLengthRanges?.map((l) => l.id).join(","),
    }),
  );
