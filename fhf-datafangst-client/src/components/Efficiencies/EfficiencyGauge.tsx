import { Box, Typography } from "@mui/material";
import ReactEChart from "echarts-for-react";
import { FC, useRef} from "react";
import { EfficiencyTheme } from "./EfficiencyTheme";

import { selectEfficiencies, selectEfficiencyClass } from "store/efficiency";
import { selectBwUserProfile, useAppSelector } from "store";

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

  const selectedEfficiencies = useAppSelector(selectEfficiencies);
  const efficiencyClass = useAppSelector(selectEfficiencyClass)
  const profile= useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;

  const callsign = vesselInfo?.ircs ?? "";

  const our_index = efficiencyClass?.findIndex(([key, value]) => key === callsign);

  let efficiency_score =( efficiencyClass?.[our_index!][1].fishCaughtPerHour  ?? 0 / efficiencyClass?.[0][1].fishCaughtPerHour! )* 100;
  



  if(!selectedEfficiencies){
    return <></>
  }

  const displayScores : GaugeData[] = [];

  const detailSize = 200 / (2 * selectedEfficiencies.length);
  selectedEfficiencies?.forEach( (efficiency, index) => {
    let detailPos = (100/selectedEfficiencies.length) + (detailSize * 2 * index) - 100;
    displayScores.push(
      {
        value: efficiency_score, // Need to get score from somewhere
        name: efficiency,
        title: {
          offsetCenter: [detailPos.toString()+"%", '110%'],
          color: "white",
        },
        detail: {
          offsetCenter: [detailPos.toString()+"%", '90%']
        },
      }
    );
  });

  const eChartsOption = {
      series: [
        {
          type: 'gauge',
          pointer: {
            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            width: 8,
            length: '80%',
            offsetCenter: [0, '8%']
          },

          progress: {
            show: true,
            overlap: true,
            roundCap: true
          },
          splitLine: {
            lineStyle: {
              color: "white",
            }
          },
          axisTick: {
            lineStyle: {
              color: "white",
            }
          },
          axisLabel: {
            color: "white"
          },
          data: displayScores,
          detail: {
            width: detailSize.toString() + "%" ,
            height: 14,
            fontSize: 14,
            backgroundColor: 'inherit',
            borderRadius: 3,
            formatter: (value: number) => {
              return value.toFixed(2)
            }
          }
        }
      ],
  };


    return (
            <Box
            sx={{
              py:3,
              px:2.5,
              color: 'white',
              backgroundColor: 'primary.main',
            }}>
              <Box>
                <Typography variant="h5">Min effektivitet</Typography>
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