import { be } from "date-fns/locale";
import { Benchmark, Vessel } from "generated/openapi";

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
  TotalWeightDay = "TotalWeightPrevDay",
  TotalWeightWeek = "TotalWeightPrevWeek",
  TotalWeightMonth = "TotalWeightPrevMonth",
  TotalWeightYear = "TotalWeightPrevYear",
  TotalWeightPrevDay = "TotalWeightPrevDay",
  TotalWeightPrevWeek = "TotalWeightPrevWeek",
  TotalWeightPrevMonth = "TotalWeightPrevMonth",
  TotalWeightPrevYear = "TotalWeightPrevYear",
}

export const GetBenchmarkOnId = (
  benchmark: Benchmark[],
  benchmarkId: VesselBenchmarkId,
) => benchmark.filter((b) => b.benchmarkId === benchmarkId);



export const FilterOnVesselId = (benchmark: Benchmark[], vesselId: number) =>
  benchmark.filter((b) => b.vesselId === vesselId);

export const FilterNaNs = (benchmark: Benchmark[]) =>
  benchmark.filter((b) => b.output !== undefined);

export const AggregateBenchmark = (benchmark: Benchmark[]) =>
  benchmark.reduce((acc, curr) => acc + curr.output!, 0) / benchmark.length;

export const AggregateBenchmarkOnVesselId = (
  benchmark: Benchmark[],
  vesselId: number,
) => AggregateBenchmark(FilterOnVesselId(benchmark, vesselId));

export const excludeVesselId = (benchmark: Benchmark[], vesselId: number) =>
  benchmark.filter((b) => b.vesselId !== vesselId);

  export const AggregateBenchmarksExcludingVesselId = ( benchmark: Benchmark[], vesselId: number) => AggregateBenchmark(excludeVesselId(benchmark, vesselId))

export const sortBenchmarksOnOutput = (benchmark: Benchmark[]) => benchmark.sort((a, b) => (a.output! > b.output! ? -1 : 1));

export const calculate_benchmark = (benchmark : Benchmark[], now: VesselBenchmarkId, prev : VesselBenchmarkId, vessel : number, self : boolean = false) => {
    let b1= FilterNaNs(GetBenchmarkOnId(benchmark, now))
    let b2= FilterNaNs(GetBenchmarkOnId(benchmark, prev))
    console.log(b1)
    let b1_score = 0
    let b2_score = 0

    let agg_function = self ? AggregateBenchmarkOnVesselId : AggregateBenchmarksExcludingVesselId

    b1_score =  agg_function(b1,vessel) 
    b2_score = agg_function(b2,vessel)

    return b1_score && b2_score ? ((b1_score/ b2_score) -1) * 100 : 0
}
export const find_leaderboard = (benchmark : Benchmark[], now : VesselBenchmarkId, prev : VesselBenchmarkId, vessel : number) => {
    let b1= FilterNaNs(GetBenchmarkOnId(benchmark, now))
    let b2= FilterNaNs(GetBenchmarkOnId(benchmark, prev))

    return b1;
}

// export const find_vessel_in_bm = (benchmark : Benchmark[], vessel : number) => benchmark.indexOf(benchmark.find((b) => b.vesselId === vessel)!)