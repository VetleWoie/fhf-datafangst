import { be } from "date-fns/locale";
import { Benchmark, Vessel } from "generated/openapi";
import { EfficiencyViewState } from "store";

export enum VesselBenchmarkId {
  WeightPerHour = "WeightPerHour",
  WeightPerHourDay = "WeightPerHourDay",
  WeightPerHourWeek = "WeightPerHourWeek",
  WeightPerHourMonth = "WeightPerHourMonth",
  WeightPerHourYear = "WeightPerHourYear",
  WeightPerHourPrevDay = "WeightPerHourPrevDay",
  WeightPerHourPrevWeek = "WeightPerHourPrevWeek",
  WeightPerHourPrevMonth = "WeightPerHourPrevMonth",
  WeightPerHourPrevYear = "WeightPerHourPrevYear",
  WeightPerDistance = "WeightPerDistance",
  WeightPerDistanceDay = "WeightPerDistanceDay",
  WeightPerDistanceWeek = "WeightPerDistanceWeek",
  WeightPerDistanceMonth = "WeightPerDistanceMonth",
  WeightPerDistanceYear = "WeightPerDistanceYear",
  WeightPerDistancePrevDay = "WeightPerDistancePrevDay",
  WeightPerDistancePrevWeek = "WeightPerDistancePrevWeek",
  WeightPerDistancePrevMonth = "WeightPerDistancePrevMonth",
  WeightPerDistancePrevYear = "WeightPerDistancePrevYear",
  TotalWeight = "TotalWeight",
  TotalWeightDay = "TotalWeightPrevDay",
  TotalWeightWeek = "TotalWeightPrevWeek",
  TotalWeightMonth = "TotalWeightPrevMonth",
  TotalWeightYear = "TotalWeightPrevYear",
  TotalWeightPrevDay = "TotalWeightPrevDay",
  TotalWeightPrevWeek = "TotalWeightPrevWeek",
  TotalWeightPrevMonth = "TotalWeightPrevMonth",
  TotalWeightPrevYear = "TotalWeightPrevYear",
}

export const getBenchmarkOnId = (
  benchmark: Benchmark[],
  benchmarkId: VesselBenchmarkId,
) => benchmark.filter((b) => b.benchmarkId === benchmarkId);

export const filterOnVesselId = (benchmark: Benchmark[], vesselId: number) =>
  benchmark.filter((b) => b.vesselId === vesselId);

export const filterNaNs = (benchmark: Benchmark[]) =>
  benchmark.filter((b) => b.output !== undefined);

export const aggregateBenchmark = (benchmark: Benchmark[]) =>
  benchmark.reduce((acc, curr) => acc + curr.output!, 0) / benchmark.length;

export const aggregateBenchmarkOnVesselId = (
  benchmark: Benchmark[],
  vesselId: number,
) => aggregateBenchmark(filterOnVesselId(benchmark, vesselId));

export const excludeVesselId = (benchmark: Benchmark[], vesselId: number) =>
  benchmark.filter((b) => b.vesselId !== vesselId);

export const aggregateBenchmarksExcludingVesselId = (
  benchmark: Benchmark[],
  vesselId: number,
) => aggregateBenchmark(excludeVesselId(benchmark, vesselId));

export const sortBenchmarksOnOutput = (benchmark: Benchmark[]) =>
  benchmark.sort((a, b) => (a.output! > b.output! ? -1 : 1));

export const calculate_benchmark = (
  benchmark: Benchmark[],
  now: VesselBenchmarkId,
  prev: VesselBenchmarkId,
  vessel: number,
  self: boolean = false,
) => {
  let b1 = filterNaNs(getBenchmarkOnId(benchmark, now));
  let b2 = filterNaNs(getBenchmarkOnId(benchmark, prev));
  console.log(b1);
  let b1_score = 0;
  let b2_score = 0;

  let agg_function = self
    ? aggregateBenchmarkOnVesselId
    : aggregateBenchmarksExcludingVesselId;

  b1_score = agg_function(b1, vessel);
  b2_score = agg_function(b2, vessel);

  return b1_score && b2_score ? (b1_score / b2_score - 1) * 100 : 0;
};
export const find_leaderboard = (
  benchmark: Benchmark[],
  now: VesselBenchmarkId,
  prev: VesselBenchmarkId,
  vessel: number,
) => {
  let b1 = filterNaNs(getBenchmarkOnId(benchmark, now));
  let b2 = filterNaNs(getBenchmarkOnId(benchmark, prev));

  return b1;
};

export const calculate_benchmark_gauge_overview = (
  benchmark: Benchmark[],
  selectedEfficiency: VesselBenchmarkId,
  vessel: number,
) =>{

  let me = aggregateBenchmarkOnVesselId(
    filterNaNs(getBenchmarkOnId(benchmark, selectedEfficiency)),
    vessel,
    );

  let avg = aggregateBenchmarksExcludingVesselId(
    filterNaNs(getBenchmarkOnId(benchmark, selectedEfficiency)),
    vessel,
    );

  return (me && avg) ? (me / avg - 1) * 100 : 0;
  }
export const filterVesselBenchmarkEnum = (
  selectedEfficiency: EfficiencyViewState,
) =>
  Object.keys(VesselBenchmarkId).filter(
    (id: string) =>
      id.toLowerCase().includes(selectedEfficiency.toLowerCase()) &&
      id.toLowerCase() !== selectedEfficiency.toLowerCase(),
  );

export const filterVesselBenchmarkEnumOverview = (
  selectedEfficiency:EfficiencyViewState,
) =>
  Object.keys(VesselBenchmarkId).filter(
    (id: string) => id.toLowerCase() === selectedEfficiency.toLowerCase(),
  );


  export const find_vessel_index = (bm? : Benchmark[], vessel? : number) => bm?.findIndex((value: Benchmark, _index: number) => value.vesselId === vessel)