import {
  FishingFacilityToolType,
  V1fishingFacilityApi,
} from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from ".";

export interface FishingFacilitiesArgs {
  active?: boolean;
  mmsis?: number[];
  callSigns?: string[];
  toolTypes?: FishingFacilityToolType[];
  setupRanges?: [Date, Date][];
  removedRanges?: [Date, Date][];
}

const api = new V1fishingFacilityApi(
  apiConfiguration,
  undefined,
  axiosInstance,
);

export const getFishingFacilities = async (query?: FishingFacilitiesArgs) =>
  apiGet(async () =>
    api.fishingFacilities({
      active: query?.active,
      mmsis: query?.mmsis?.join(","),
      callSigns: query?.callSigns?.join(","),
      toolTypes: query?.toolTypes?.join(","),
      setupRanges: createRangeString(query?.setupRanges),
      removedRanges: createRangeString(query?.removedRanges),
    }),
  );

export const createRangeString = (
  items?: [Date | undefined, Date | undefined][],
) => {
  if (!items?.length) {
    return undefined;
  }

  return items
    .map(
      ([start, end]) =>
        `[${start ? start.toISOString() : ""},${end ? end.toISOString() : ""}]`,
    )
    .join(";");
};
