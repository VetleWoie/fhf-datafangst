export enum EfficiencyViewState {
  timePerDay = "timesPerDay",
  distancePerDay = "distancePerDay",
}

export interface EfficiencyState {
  selectedEfficiencies?: EfficiencyViewState[];
}

export const initalEfficiencyState: EfficiencyState = {
  selectedEfficiencies : [EfficiencyViewState.timePerDay,EfficiencyViewState.distancePerDay]
};
