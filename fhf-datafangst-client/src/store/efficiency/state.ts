import { Vessel } from "generated/openapi";

export enum EfficiencyViewState {
  timePerHour = "timePerHour",
  distancePerHour = "distancePerHour",
  fishPerHour = "FishPerHour"
}
export interface EfficiencyState {
  selectedEfficiencies?: EfficiencyViewState[];
  efficiencyClass? : [string,Vessel][];

}


export const initalEfficiencyState: EfficiencyState = {
  selectedEfficiencies : [EfficiencyViewState.fishPerHour,],
  efficiencyClass : undefined
};
