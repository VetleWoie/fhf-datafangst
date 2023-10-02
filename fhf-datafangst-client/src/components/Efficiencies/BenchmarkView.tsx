""


import ReactEChart from "echarts-for-react";
import { FC, useEffect, useRef } from "react";
import { EfficiencyTheme } from "./EfficiencyTheme";


import {
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    styled,
    SvgIcon,
    Typography,
} from "@mui/material";
import { EfficiencyLeaderboard } from "./EfficiencyLeaderboard";
import { EfficiencyViewState, selectBenchmarks, selectBwUserProfile, selectEfficiency, selectEfficiencyClass, selectVesselsByCallsign, setSelectedEfficiency, useAppDispatch, useAppSelector } from "store";
import { AggregateBenchmark, AggregateBenchmarkOnVesselId, calculate_benchmark, excludeVesselId, FilterNaNs, FilterOnVesselId, GetBenchmarkOnId, GetBenchmarkOnIds, sortBenchmarksOnOutput, VesselBenchmarkId } from "./BenchmarkParse";
import { Benchmark } from "generated/openapi";
import { LeaderboardSharp } from "@mui/icons-material";




export const BenchmarkView: FC = () => {
    const benchmarks = useAppSelector(selectBenchmarks);
    const profile = useAppSelector(selectBwUserProfile);
    const selectedEfficiency = useAppSelector(selectEfficiency);
    const vessels = useAppSelector(selectVesselsByCallsign)
    // const vessel = vessels[profile?.vesselInfo?.ircs ?? ""]
    const vessel = vessels["LEGQ"]


    if (!benchmarks) {
        return <></>
    }


    console.log(benchmarks)


    const time_range = ['Day', 'Week', 'Month', 'Year']

    const GaugeContent = (self: boolean = false) => {
        if (!selectedEfficiency) {
            return <></>
        }
        let now: string[] = [];
        let prev: string[] = [];
        Object.keys(VesselBenchmarkId)
            .filter((id: string) => id.toLowerCase()
                .includes(selectedEfficiency.toLowerCase())
                && id.toLowerCase() !== selectedEfficiency.toLowerCase())
            .forEach((id: string) => id.includes("Prev") ? prev.push(id) : now.push(id))



        return now.map((id, index) => {
            let gauge_data = calculate_benchmark(benchmarks, id as VesselBenchmarkId, prev[index] as VesselBenchmarkId, vessel.fiskeridir.id, self)

            return (
                <ReactEChart key={id} option={generateGaugeOptions(gauge_data, time_range[index], "50%")} theme={EfficiencyTheme} />
            )
        })
    }
    const Leaderboards = () => {
        if (!selectedEfficiency){
            return <></>
        }
        
        let now: string[] = [];
        let prev: string[] = [];
        Object.keys(VesselBenchmarkId)
            .filter((id: string) => id.toLowerCase()
                .includes(selectedEfficiency.toLowerCase())
                && id.toLowerCase() !== selectedEfficiency.toLowerCase())
            .forEach((id: string) => id.includes("Prev") ? prev.push(id) : now.push(id))

        console.log("asdasd",now)

        return now.map((id, index) => {
            let bm  = GetBenchmarkOnId(benchmarks, id as VesselBenchmarkId)
            bm = sortBenchmarksOnOutput(bm)

            let vessel_index = bm?.findIndex((value : Benchmark,    _index : number ) => value.vesselId === vessel.fiskeridir.id)
            console.log(vessel_index)
            

            return <Leaderboard key={id} title={time_range[index]} benchmarks={bm?.slice(vessel_index-5,vessel_index+5)}/> 
        })
        

    }

    // GaugeContent()


    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "primary.main",
            color: "white",
        }}>

            <Divider textAlign="left"
                sx={{ color: "text.secondary", mb: 1, mx: 3 }} >
                <Typography variant="h3" sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                }}>Deg</Typography>
            </Divider>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    py: 3,
                    px: 2.5,
                    color: 'white',
                    backgroundColor: 'primary.main',
                }}>
                {GaugeContent(true)}

            </Box>
            {/* <Divider sx={{ bgcolor: "text.secondary", mb: 2, mx: 4 }} /> */}
            <Box
                sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                }}
            >
                <Divider textAlign="left"
                    sx={{ color: "text.secondary", mb: 1, mx: 3 }} >
                    <Typography variant="h3" sx={{
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}>Gjennomsnittets</Typography>
                </Divider>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        py: 3,
                        px: 2.5,
                        color: 'white',
                        backgroundColor: 'primary.main',
                    }}>
                    {GaugeContent()}

                </Box>
            </Box>
            <Divider textAlign="left"
                sx={{ color: "text.secondary", mb: 1, mx: 3 }} >
                <Typography variant="h3" sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                }}>Poengtavle</Typography>
            </Divider>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    color: 'white',
                    backgroundColor: 'primary.main',
                }}>


                {Leaderboards()} 

            </Box>
        </Box>
    )
}

const seriesLabel = {
  show: true
} as const;

const Leaderboard : FC<{title: string, benchmarks: Benchmark[]}> = ({title,benchmarks}) => {
    


    const vessels = useAppSelector(selectVesselsByCallsign);


    if (vessels == undefined ){
        return <></>
    }

    const names = benchmarks.map((value : Benchmark, index : number) => {
        let key = Object.values(vessels).find((vessel : any) => vessel.fiskeridir.id === value.vesselId)?.fiskeridir?.name
        return key
    })

    const series = {
        name : title,
        type : "bar",
        label : seriesLabel,
        data : benchmarks.map((value : Benchmark, index : number) => value.output?.toFixed(1))
    }
    // const series = benchmarks.map((value : Benchmark, index : number) => {

    // })

    

    return <>
    <Box>
        <ReactEChart option={generateLeaderboardOption(series,title,names)} theme={EfficiencyTheme} />
    </Box>
    </>
}
const generateLeaderboardOption = (series: any, title: string,vessels : any) => {

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          notMerge: true,
          legend: {
            data: title,
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
            // data: [...efficiencyClass["day"].map(([key, vessel]) => vessel.fiskeridir?.name ?? key)],
            data : vessels,
            axisLabel: {
              formatter: '{value}',
              margin: 20,
            }
          },
        series: series
    };

}


const generateGaugeOptions = (data: number, title: string, detail: string) => {

    return {
        title: {
            text: title,
            x: 'center',
            textStyle: {
                color: 'white',
                fontSize: 20,
            }
        },
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
            {
                min: -100,
                max: 100,
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
                axisLine: {
                    roundCap: true,
                    lineStyle: {
                        width: 4,
                    }

                },
                axisTick: {
                    splitNumber: 2,
                    lineStyle: {
                        width: 2,
                        color: "white",
                    }
                },
                axisLabel: {
                    color: "white"
                },
                detail: {
                    height: 4,
                    fontSize: 10,
                    offsetCenter: [0, '100%'],
                    valueAnimation: true,
                    backgroundColor: 'inherit',
                    borderRadius: 3,
                    formatter: (value: number) => {
                        return value.toFixed(0) + "%"
                    }
                },
                data: [{ value: data }]
            }
        ]
    };





}