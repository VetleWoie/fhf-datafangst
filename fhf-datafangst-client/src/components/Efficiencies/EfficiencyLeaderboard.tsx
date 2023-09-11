import ReactEChart from "echarts-for-react";
import { FC } from "react";

import { EfficiencyTheme } from "./EfficiencyTheme";
import { Box, Typography } from "@mui/material";
import { selectBwUserProfile, selectVesselsByCallsign, useAppSelector } from "store";
import { EfficiencyViewState, selectEfficiencies } from "store/efficiency";
import { Vessel } from "generated/openapi";


const seriesLabel = {
  show: true
} as const;


interface LeaderboardData {
  name: string;
  type: string;
  label: object;
  data: string[];
}

export const EfficiencyLeaderboard: FC = () => {

  const selectedEfficiencies = useAppSelector(selectEfficiencies);
  const profile = useAppSelector(selectBwUserProfile);
  const efficiencies = useAppSelector(selectEfficiencies);
  console.log(efficiencies)

  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign)
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;

  const boat_length = vessel?.fiskeridir?.lengthGroupId ?? 0;
  const callsign = vesselInfo?.ircs ?? "";

  if (!vessel) {
    return <></>;
  }

  const filterVesselsOnLength = (vessels: Record<string, Vessel>, length: number) => {

    const filteredVessels: Record<string, Vessel> = {};

    Object.entries(vessels).forEach(([key, vessel]) => {
      if (vessel.fiskeridir?.lengthGroupId === length) {
        filteredVessels[key] = vessel;
      }
    });

    return filteredVessels;
  }
  const filterVesselsOnGearGroups = (vessels: Record<string, Vessel>, gearGroups: number[]) => {

    const filteredVessels: Record<string, Vessel> = {};

    Object.entries(vessels).forEach(([key, vessel]) => {
      if (gearGroups.every(gearGroup => vessel.gearGroups?.includes(gearGroup))) {
        filteredVessels[key] = vessel;
      }
    });

    return filteredVessels;
  }

  const findClosestVessels = (vessels: [string, Vessel][], vessel_name?: string, num_closest: number = 5) => {
    if (!vessel_name) {
      return []
    }
    const index = vessels.findIndex(([key, value]) => key === vessel_name);

    return vessels.slice(index - num_closest, index + num_closest)
  }

  let filteredVessels = filterVesselsOnLength(vessels, boat_length);
  filteredVessels = filterVesselsOnGearGroups(filteredVessels, vessel?.gearGroups);

  if (!filteredVessels) {
    return <></>;
  }

  let data = Object.entries(filteredVessels)

  data.sort(([, a], [, b]) => {
    return b.fishCaughtPerHour! - a.fishCaughtPerHour!
  })

  let series = []

  let medioVessels = findClosestVessels(data, callsign, 5)
  console.log(medioVessels)

  var leaderBoardData : LeaderboardData[]= [];

  selectedEfficiencies?.forEach( (efficiency) => {
    var efficiencyData : string[] = [];
    switch (efficiency){
      case EfficiencyViewState.fishPerHour: {
        efficiencyData = [...medioVessels.filter(([key, vessel]) => key != callsign).map(([key, vessel]) => vessel.fishCaughtPerHour?.toFixed(1)), vessel?.fishCaughtPerHour?.toFixed(1)]
        console.log(efficiencyData)
        break;
      }
      case EfficiencyViewState.distancePerHour: {
        efficiencyData = [];
        break;
      }
      default : {
        efficiencyData = [];
        break;
      }
    }

    leaderBoardData.push(
      {
        name: efficiency,
        type: 'bar',
        label: seriesLabel,
        data: efficiencyData,
      }
    );
  });


  const eChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    notMerge : true,
    legend: {
      data: selectedEfficiencies,
      selectedMode: false
    },
    grid: {
      left: 100
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: [...medioVessels.filter(([key, _vessel]) => key != callsign).map(([key, vessel]) => vessel.fiskeridir?.name ?? key), vessel?.fiskeridir?.name],
      axisLabel: {
        formatter: '{value}',
        margin: 20,
      }
    },
    series: leaderBoardData,
  };

  return (
    <Box
      sx={{
        py: 3,
        px: 2.5,
        color: "white",
        backgroundColor: "primary.main"
      }}>
      <Box>
        <Typography variant="h5">Poengtavle</Typography>
      </Box>
      <Box>
        <ReactEChart
          option={eChartsOption}
          notMerge={true}
          theme={EfficiencyTheme}
        />
      </Box>
    </Box>
  );
}




function createSeries(name: string, data?: string []) {
  return {
    name: name,
    type: 'bar',
    data: data,
    label: seriesLabel,
    markPoint: {
      symbolSize: 1,
      symbolOffset: [0, '50%'],
      label: {
        formatter: '{a|{a}\n}{b|{b} }{c|{c}}',
        // backgroundColor: 'rgb(242,242,242)',
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 4,
        padding: [4, 10],
        lineHeight: 40,
        position: 'right',
        distance: 20,
        rich: {
          value: {
            align: 'center',
            fontSize: 18,
            textShadowBlur: 2,
            textShadowOffsetX: 0,
            textShadowOffsetY: 1,
            textBorderWidth: 2,
            color: "red"
          },
          // [name as string]: {
          //   color: 'red'
          // },
          c: {
            // color: '#ff8811',
            // textBorderColor: '#000',
            textBorderWidth: 1,
            fontSize: 22
          }
        },
        data: [
          { type: 'max', name: 'max days: ' },
          { type: 'min', name: 'min days: ' }
        ]
      }
    },


  }


}