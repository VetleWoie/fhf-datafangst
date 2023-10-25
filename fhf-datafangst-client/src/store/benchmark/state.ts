import { Trip } from "generated/openapi";

export interface historicParams {
  vesselNames: string[];
  dataset: (string | number)[][];
  metric?: string;
}
export interface BenchmarkModalParams {
  title?: string;
  description?: string;
  dataset: historicParams;
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
}

export const initialBenchmarkState: BenchmarkState = {
  benchmarkModal: undefined,
  benchmarkHistoric: undefined,
  benchmarkTrips: {},
  benchmarkNumHistoric: 10,
  benchmarkDataSource: BenchmarkDataSource.Landings,
};
