import ReactEChart from "echarts-for-react";
import { FC } from "react";

import { EfficiencyTheme } from "./EfficiencyTheme";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "store";
import { selectEfficiencies } from "store/efficiency";


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
  const users = ["User1", "User2", "Myself", "User3", "User4"]

  var leaderBoardData : LeaderboardData[]= [];

  selectedEfficiencies?.forEach( (efficiency) => {
    var efficiencyData : string[] = [];
    users.forEach((user) => {
      efficiencyData.push((Math.random()*100).toFixed(2))
    })
    leaderBoardData.push(
      {
        name: efficiency,
        type: 'bar',
        label: seriesLabel,
        data: efficiencyData,
      }
    );
  });
  console.log(leaderBoardData);

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
        data: users,
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
              notMerge={true}
              theme={EfficiencyTheme}
              />
          </Box>
      </Box>
    );
}



