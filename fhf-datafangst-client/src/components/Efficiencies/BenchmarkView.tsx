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
import { AggregateBenchmark, AggregateBenchmarkOnVesselId, calculate_benchmark, excludeVesselId, FilterNaNs, FilterOnVesselId, GetBenchmarkOnId, GetBenchmarkOnIds, VesselBenchmarkId } from "./BenchmarkParse";
import { Benchmark } from "generated/openapi";




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
    const day = FilterNaNs(GetBenchmarkOnId(benchmarks, VesselBenchmarkId.WeightPerHourDay))
    const prev_day = FilterNaNs(GetBenchmarkOnId(benchmarks, VesselBenchmarkId.WeightPerHourPrevDay))


    console.log("asdasd", AggregateBenchmarkOnVesselId(day, vessel.fiskeridir.id) - AggregateBenchmarkOnVesselId(prev_day, vessel.fiskeridir.id))
    console.log("tha others", AggregateBenchmark(excludeVesselId(day, vessel.fiskeridir.id)) - AggregateBenchmark(excludeVesselId(prev_day, vessel.fiskeridir.id)))
    const GaugeContent = (self: boolean = false) => {
        if (!selectedEfficiency) {
            return <></>
        }
        const time_range = ['Day', 'Week', 'Month', 'Year']
        let now: string[] = [];
        let prev: string[] = [];
        Object.keys(VesselBenchmarkId)
            .filter((id: string) => id.toLowerCase()
                .includes(selectedEfficiency.toLowerCase())
                && id.toLowerCase() !== selectedEfficiency.toLowerCase())
            .forEach((id: string) => id.includes("Prev") ? prev.push(id) : now.push(id))

        console.log(now, prev)



        return now.map((id, index) => {
            let gauge_data = calculate_benchmark(benchmarks, id as VesselBenchmarkId, prev[index] as VesselBenchmarkId, vessel.fiskeridir.id, self)

            return (
                <ReactEChart key={id} option={generateGaugeOptions(gauge_data, time_range[index], "50%")} theme={EfficiencyTheme} />
            )
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


                <EfficiencyLeaderboard title={"Dag"} />
                <EfficiencyLeaderboard title={"Uke"} />
                <EfficiencyLeaderboard title={"Måned"} />
                <EfficiencyLeaderboard title={"År"} />
            </Box>
        </Box>
    )
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