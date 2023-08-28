import ReactEChart from "echarts-for-react";
import { FC } from "react";

import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { EfficiencyTheme } from "./EfficiencyTheme";
import { Box, Typography } from "@mui/material";


  const seriesLabel = {
    show: true
  } as const;

  export const EfficiencyLeaderboard: FC = () => {
    const eChartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        // legend: {
        //   data: ['City Alpha', 'City Beta', 'City Gamma']
        // },
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
          data: ['Showers', 'Hello', 'Showers', "Lightning"],
          axisLabel: {
            formatter: '{value}',
            margin: 20,
            rich: {
              value: {
                lineHeight: 30,
                align: 'center'
              },
              Sunny: {
                height: 40,
                align: 'center',
              },
              Cloudy: {
                height: 40,
                align: 'center',
              },
              Showers: {
                height: 40,
                align: 'center',
              }
            }
          }
        },
        series: [
          {
            name: 'City Alpha',
            type: 'bar',
            data: [165, 170, 30],
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
                  a: {
                    align: 'center',
                    // color: '#fff',
                    fontSize: 18,
                    textShadowBlur: 2,
                    // textShadowColor: '#000',
                    textShadowOffsetX: 0,
                    textShadowOffsetY: 1,
                    // textBorderColor: '#333',
                    textBorderWidth: 2
                  },
                  b: {
                    // color: '#333'
                  },
                  c: {
                    // color: '#ff8811',
                    // textBorderColor: '#000',
                    textBorderWidth: 1,
                    fontSize: 22
                  }
                }
              },
              // data: [
              //   { type: 'max', name: 'max days: ' },
              //   { type: 'min', name: 'min days: ' }
              // ]
            }
          },
          {
            name: 'City Beta',
            type: 'bar',
            label: seriesLabel,
            data: [150, 105, 110]
          },
          {
            name: 'City Gamma',
            type: 'bar',
            label: seriesLabel,
            data: [220, 82, 63]
          }
        ]
      };

      return (
          <Box
          sx={{
              py:3,
              px:2.5,
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



