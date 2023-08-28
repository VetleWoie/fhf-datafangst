import { Box, Typography } from "@mui/material";
import ReactEChart from "echarts-for-react";
import { FC, useRef} from "react";
import { EfficiencyTheme } from "./EfficiencyTheme";

import * as echarts from 'echarts';

const gaugeData = [
    {
      value: 20,
      name: 'Good',
      title: {
        offsetCenter: ['0%', '80%']
      },
      detail: {
        offsetCenter: ['00%', '95%']
      }
    },
    {
      value: 40,
      name: 'Better',
      title: {
        offsetCenter: ['0%', '80%']
      },
      detail: {
        offsetCenter: ['0%', '95%']
      }
    },
    {
      value: 60,
      name: 'Perfect',
      title: {
        offsetCenter: ['40%', '80%']
      },
      detail: {
        offsetCenter: ['40%', '95%']
      }
    }
  ];

const color = [
  "#f9a976",
  "#e81f76",
  "#a6b1e1",
  "#fac858",
  "#73c0de",
  "#3ba272",
  "#fc8452",
  "#9a60b4",
  "#ea7ccc"
]

export const EfficiencyGauge: FC = () => {

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
          axisLine: {
            roundCap: true,
            linestyle: {
              color: "white",
              width: "10",
            }
          },
          data: gaugeData,
          detail: {
            width: 40,
            height: 14,
            fontSize: 14,
            backgroundColor: 'inherit',
            borderRadius: 3,
            formatter: '{value}%'
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