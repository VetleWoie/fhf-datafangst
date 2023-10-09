import { Box, Typography } from "@mui/material";
import ReactEChart from "echarts-for-react";
import { FC, useRef } from "react";
import { EfficiencyTheme } from "./EfficiencyTheme";

import { EfficiencyViewState, selectBenchmarks, selectEfficiency, selectEfficiencyClass, selectEfficiencyDuration } from "store/efficiency";
import { selectBwUserProfile, selectVesselsByCallsign, useAppSelector } from "store";
import { generateGaugeOptions } from "./BenchmarkOptions";
import { calculate_benchmark, calculate_benchmark_gauge_overview, filterVesselBenchmarkEnumOverview } from "./BenchmarkParse";
import { VesselBenchmarkId } from "./BenchmarkParse";

interface GaugeData {
  value: number;
  name: string;
  title?: {
    offsetCenter: string[];
    color: string;
  };
  detail?: {
    offsetCenter: string[];
  };
}

export const EfficiencyGauge: FC = () => {

  const selectedEfficiency = useAppSelector(selectEfficiency);
  if (!selectedEfficiency) {
    return <></>
  }

  const selectedEfficiencyDuration = useAppSelector(selectEfficiencyDuration);
  if (!selectedEfficiencyDuration) {
    return <></>
  }
  const efficiencyClass = useAppSelector(selectEfficiencyClass)
  if (!efficiencyClass) {
    return <></>
  }
  const profile = useAppSelector(selectBwUserProfile);
  const benchmarks = useAppSelector(selectBenchmarks)
  if (!benchmarks) {
    return <></>
  }

  const vesselInfo = profile?.vesselInfo;

  const callsign = vesselInfo?.ircs ?? "";

  
    const vessels = useAppSelector(selectVesselsByCallsign)
    const vessel = vessels[profile?.vesselInfo?.ircs ?? ""]
  const eff = filterVesselBenchmarkEnumOverview(selectedEfficiency)[0]
  let bm =  calculate_benchmark_gauge_overview(benchmarks, EfficiencyViewState[selectedEfficiency] as VesselBenchmarkId , vessel.fiskeridir.id) 
  
  return (
    <Box
      sx={{
        py: 3,
        px: 2.5,
        color: 'white',
        backgroundColor: 'primary.main',
      }}>
      <Box>
        <Typography variant="h5">Min effektivitet</Typography>
      </Box>
      <Box>
        <ReactEChart
          option={generateGaugeOptions(bm, selectedEfficiency, "23")}
          theme={EfficiencyTheme}
        />
      </Box>
    </Box>
  );
}