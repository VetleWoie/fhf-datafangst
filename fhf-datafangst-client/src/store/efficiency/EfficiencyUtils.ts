import { Vessel } from "generated/openapi";
import { FiskInfoProfile } from "models";
import { selectBwUserProfile, selectVesselsByCallsign, useAppSelector } from "store";
import { EfficiencyDurationState } from "./state";



export const FilterVesselsOnClass = (profile? : FiskInfoProfile,vessels? : Record<string,Vessel>) => {

  
  const vesselInfo = profile?.vesselInfo;
  if(!vesselInfo || !vessels || !vesselInfo.ircs)
    return undefined

  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;

  const boat_length = vessel?.fiskeridir?.lengthGroupId ?? 0;

  const filterVesselsOnLength = (vessels: Record<string, Vessel>, length: number) => {

    const filteredVessels: Record<string, Vessel> = {};

    Object.entries(vessels).forEach(([key, vessel]) => {
      if (vessel.fiskeridir?.lengthGroupId === length) {
        filteredVessels[key] = vessel;
      }
    });

    return filteredVessels;
  }
  const filterVesselsOnGearGroups = (vessels: Record<string, Vessel>, gearGroups?: number[]) => {

    const filteredVessels: Record<string, Vessel> = {};

    Object.entries(vessels).forEach(([key, vessel]) => {
      if (gearGroups?.every(gearGroup => vessel.gearGroups?.includes(gearGroup))) {
        filteredVessels[key] = vessel;
      }
    });

    return filteredVessels;
  }

  
  let filteredVessels = filterVesselsOnLength(vessels, boat_length);
  filteredVessels = filterVesselsOnGearGroups(filteredVessels, vessel?.gearGroups);

  if (!filteredVessels) {
    return undefined;
  }

  let data = Object.entries(filteredVessels)
  data.sort(([  ,a],[,b]) => {
    return b.fishCaughtPerHour! - a.fishCaughtPerHour!
  })

  let record : Record<string,[string,Vessel][]> = {"day" : data};


  return record
}
