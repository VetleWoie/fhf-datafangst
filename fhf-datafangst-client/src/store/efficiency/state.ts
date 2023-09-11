import { Vessel } from "generated/openapi";

export enum EfficiencyViewState {
  timePerHour = "timePerHour",
  distancePerHour = "distancePerHour",
  fishPerHour = "FishPerHour"
}
export interface EfficiencyState {
  selectedEfficiencies?: EfficiencyViewState[];
}

export const initalEfficiencyState: EfficiencyState = {
  selectedEfficiencies : [EfficiencyViewState.timePerHour,EfficiencyViewState.distancePerHour],
};
