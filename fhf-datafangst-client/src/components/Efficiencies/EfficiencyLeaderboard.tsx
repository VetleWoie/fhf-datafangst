import ReactEChart from "echarts-for-react";
import { FC } from "react";

import { EfficiencyTheme } from "./EfficiencyTheme";
import { Box, Typography } from "@mui/material";
import { selectBwUserProfile, selectVesselsByCallsign, useAppDispatch, useAppSelector } from "store";
import { EfficiencyViewState, selectBenchmarks, selectEfficiency, selectEfficiencyClass, selectEfficiencyDuration,  } from "store/efficiency";
import { Benchmark, Vessel } from "generated/openapi";
import { set } from "date-fns";
import { generateLeaderboardOption } from "./BenchmarkOptions";
import { VesselBenchmarkId, find_vessel_index, getBenchmarkOnId, sortBenchmarksOnOutput } from "./BenchmarkParse";


const seriesLabel = {
  show: true
} as const;


interface LeaderboardData {
  name: string;
  type: string;
  label: object;
  data: string[];
}

export const EfficiencyLeaderboard: FC<any> = (props : any) => {
  const dispatch = useAppDispatch();

  const selectedEfficiency = useAppSelector(selectEfficiency);
  if (!selectedEfficiency) {
    return <></>;
  }
  const selectedEfficiencyDuration = useAppSelector(selectEfficiencyDuration);

  const efficiencyClass = useAppSelector(selectEfficiencyClass);

  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign)
  console.log(vessels)
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  const callsign = vesselInfo?.ircs ?? "";
  if (!vessel) {
    return <></>;
  }

  const benchmarks = useAppSelector(selectBenchmarks);

  if (!benchmarks) {
    return <></>;
  }
  let bm = getBenchmarkOnId(benchmarks, VesselBenchmarkId[selectedEfficiency] )
  bm = sortBenchmarksOnOutput(bm)

  let vessel_index = find_vessel_index(bm, vessel.fiskeridir.id)
  if (vessel_index === -1) {
    vessel_index = 5
  }


 
    const names = bm .map((value: Benchmark, index: number) => {
        let key = Object.values(vessels).find((vessel: any) => vessel.fiskeridir.id === value.vesselId)?.fiskeridir?.name ?? "Ukjent"
        return key
    }) // let medioVessels = efficiencyClass    

    bm = bm?.slice(vessel_index! - 5, vessel_index! + 5)

    const series = {
        name: props.title,
        type: "bar",
        label: seriesLabel,
        data: bm.map((value: Benchmark, index: number) => value.output?.toFixed(1))
    }


  return (
    <Box
      sx={{
        py: 3,
        px: 2.5,
        color: "white",
        backgroundColor: "primary.main"
      }}>
      {/* <Box>
        <Typography variant="h5">Poengtavle</Typography>
      </Box> */}
      <Box>
        <ReactEChart
          option={generateLeaderboardOption(series, selectedEfficiency, names)}
          notMerge={true}
          theme={EfficiencyTheme}
        />
      </Box>
    </Box>
  );
}