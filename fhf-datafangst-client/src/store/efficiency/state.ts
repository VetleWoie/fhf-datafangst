import { Benchmark, Vessel } from "generated/openapi";

export enum EfficiencyViewState {
  weightPerDistance= "WeightPerDistance",
  weightPerHour= "WeightPerHour",
  totalWeight= "TotalWeight",
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
  selectedEfficiencyDetailOpen: boolean;
  efficiencyClass? : Record<string , [string,Vessel][]>;
  benchmarks?:  Benchmark[];
}


export const initalEfficiencyState: EfficiencyState = {
  selectedEfficiency : undefined,
  selectedEfficienciyDuration : undefined,
  efficiencyClass : undefined,
  selectedEfficiencyDetailOpen : true,
  benchmarks:  undefined,
};
