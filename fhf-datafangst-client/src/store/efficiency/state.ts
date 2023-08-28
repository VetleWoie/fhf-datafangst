export enum EfficiencyViewState {
  timePerDay = "timesPerDay",
  distancePerDay = "distancePerDay",
}

export interface EfficiencyState {
  selectedEfficiency?: EfficiencyViewState;
}

export const initalEfficiencyState: EfficiencyState = {
  selectedEfficiency : EfficiencyViewState.timePerDay,
};
