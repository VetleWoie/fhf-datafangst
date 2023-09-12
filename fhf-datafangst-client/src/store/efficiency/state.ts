import { Vessel } from "generated/openapi";

export enum EfficiencyViewState {
  timePerHour = "timePerHour",
  distancePerHour = "distancePerHour",
  fishPerHour = "FishPerHour"
}

export enum EfficiencyDurationState {
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}

export interface EfficiencyState {
  selectedEfficiency?: EfficiencyViewState;
  selectedEfficienciyDuration?: EfficiencyDurationState[];
  efficiencyClass? : [string,Vessel][];

}


export const initalEfficiencyState: EfficiencyState = {
  selectedEfficiency : undefined,
  selectedEfficienciyDuration : undefined,
  efficiencyClass : undefined,
};
