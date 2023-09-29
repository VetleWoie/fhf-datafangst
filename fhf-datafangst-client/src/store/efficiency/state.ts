import { Benchmark, Vessel } from "generated/openapi";

export enum EfficiencyViewState {
  weightPerDistance= "weightPerDistance",
  weightPerHour= "WeightPerHour",
  totalWeight= "totalWeight",
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
  selectedEfficiencyDetailOpen : false,
  benchmarks:  undefined,
};
