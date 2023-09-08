import ReactEChart from "echarts-for-react";
import { FC } from "react";

import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { EfficiencyTheme } from "./EfficiencyTheme";
import { Box, Typography } from "@mui/material";
import { Vessel } from "generated/openapi";

import {
  selectVessels,
  selectVesselsByCallsign, useAppSelector
} from "store";

const seriesLabel = {
  show: true
} as const;

export const EfficiencyLeaderboard: FC = () => {

  const vessels = useAppSelector(selectVesselsByCallsign)
  const callsign = "LCOE"

  const vessel = vessels[callsign]
  const boat_length = vessel?.fiskeridir?.lengthGroupId

  console.log(boat_length)

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

  const findClosestVessels = (vessels: [string, Vessel][], vessel_name: string, num_closest: number = 5) => {
    // sorted object, find the peers

    // find the index of the vessel
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
    return b.fishCaughtPerHour - a.fishCaughtPerHour
  })


  let medioVessels = findClosestVessels(data, callsign, 2)




  const eChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: 100
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} kg'
      }
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: [...medioVessels.filter(([key, vessel]) => key != callsign).map(([key, vessel]) => vessel.fiskeridir?.name ?? key), vessel?.fiskeridir?.name],
      axisLabel: {
        formatter: '{value}',
        margin: 2,
        rich: {
          value: {
            lineHeight: 30,
            align: 'center'
          },
          // [vessel.fiskeridir?.name]: {
          //   height: 100,
          //   align: 'center',
          //   color: "red",
          // },

          // ...medioVessels.reduce((acc, [key, vessel]) => {
          //   return {
          //     ...acc,
          //     [vessel.fiskeridir.name as string]: {
          //       align: 'center',
          //       height: 40,
          //       color: vessel.fiskeridir.callSign == callsign ? "red" : "green",
          //     }
          //   }
          // },{})
        },

      }
    },
    series: [
      {
        name: 'Fangst per time',
        type: 'bar',
        data: [...medioVessels.filter(([key, vessel]) => key != callsign).map(([key, vessel]) => vessel.fishCaughtPerHour?.toFixed(1)), vessel?.fishCaughtPerHour?.toFixed(1)],
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
                color:"red"
              },
              [vessel?.fiskeridir?.name as string]: {
                color: 'red'
              },
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
    ]
  };
  console.log(eChartsOption)

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
          theme={EfficiencyTheme}
        />
      </Box>
    </Box>
  );
}



