import { Trip } from "generated/openapi";
import { DateRange } from "components/MainMenu/SearchFilters/DateFilter";

export interface HistoricParams {
  vesselNames: string[];
  dataset: (string | number)[][];
  metric?: string;
}

export interface BenchmarkModalParams {
  title?: string;
  description?: string;
  dataset: HistoricParams;
}

export enum BenchmarkDataSource {
  Landings,
  Hauls,
}

export interface BenchmarkState {
  benchmarkModal?: BenchmarkModalParams;
  benchmarkTrips: Record<number, Trip[]>;
  benchmarkHistoric?: Record<string, number[]>;
  benchmarkNumHistoric: number;
  benchmarkDataSource: BenchmarkDataSource;
  benchmarkPeriod?: DateRange;
  offsetVal: number;
}

export const initialBenchmarkState: BenchmarkState = {
  benchmarkModal: undefined,
  benchmarkHistoric: undefined,
  benchmarkTrips: {},
  benchmarkPeriod: undefined,
  benchmarkNumHistoric: 10,
  benchmarkDataSource: BenchmarkDataSource.Landings,
  offsetVal: 0,
};
