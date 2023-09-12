import ReactEChart from "echarts-for-react";
import { FC } from "react";

import { EfficiencyTheme } from "./EfficiencyTheme";
import { Box, Typography } from "@mui/material";
import { selectBwUserProfile, selectVesselsByCallsign, useAppDispatch, useAppSelector } from "store";
import { EfficiencyViewState, selectEfficiencies, selectEfficiencyClass,  } from "store/efficiency";
import { Vessel } from "generated/openapi";
import { set } from "date-fns";


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
  const dispatch = useAppDispatch();

  const selectedEfficiencies = useAppSelector(selectEfficiencies);
  const efficiencies = useAppSelector(selectEfficiencies);
  const efficiencyClass = useAppSelector(selectEfficiencyClass);
  
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign)
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  const callsign = vesselInfo?.ircs ?? "";


  if (!vessel) {
    return <></>;
  }


  const findClosestVessels = (vessels?: [string, Vessel][], vessel_name?: string, num_closest: number = 2) => {
    console.log(vessels, vessel_name)
    if (!vessel_name) {
      return []
    }
    const index = vessels?.findIndex(([key, value]) => key === vessel_name);
    console.log(index)
    if (!index) {
      return vessels
    }

    return vessels?.slice(index - num_closest, index + num_closest)
  }

  let medioVessels = efficiencyClass

  console.log(medioVessels)

  if(!medioVessels){
    return <></>;
  }

  var leaderBoardData: LeaderboardData[] = [];

  selectedEfficiencies?.forEach((efficiency) => {
    var efficiencyData: string[] = [];
    switch (efficiency) {
      case EfficiencyViewState.fishPerHour: {
        efficiencyData = [...medioVessels.map(([key, vessel]) => vessel.fishCaughtPerHour?.toFixed(1))]
        break;
      }
      case EfficiencyViewState.distancePerHour: {
        efficiencyData = [];
        break;
      }
      default: {
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
    notMerge: true,
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
      data: [...medioVessels.map(([key, vessel]) => vessel.fiskeridir?.name ?? key)],
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






function createSeries(name: string, data?: string[]) {
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