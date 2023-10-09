""


import ReactEChart from "echarts-for-react";
import React, { FC, useEffect, useRef, useState } from "react";
import { EfficiencyTheme } from "./EfficiencyTheme";


import {
    Box,
    Button,
    Divider,
    Drawer,
    Icon,
    IconButton,
    Popover,
    Popper,
    styled,
    SvgIcon,
    Typography,
} from "@mui/material";
import { EfficiencyLeaderboard } from "./EfficiencyLeaderboard";
import { EfficiencyViewState, selectBenchmarks, selectBwUserProfile, selectEfficiency, selectEfficiencyClass, selectVesselsByCallsign, setSelectedEfficiency, useAppDispatch, useAppSelector } from "store";
import { aggregateBenchmark, aggregateBenchmarkOnVesselId, calculate_benchmark, excludeVesselId, filterNaNs, filterOnVesselId, filterVesselBenchmarkEnum, getBenchmarkOnId, GetBenchmarkOnIds, sortBenchmarksOnOutput, VesselBenchmarkId } from "./BenchmarkParse";
import { Benchmark } from "generated/openapi";
import { InfoOutlined, LeaderboardSharp } from "@mui/icons-material";

import { usePopupState, bindTrigger, bindPopover } from 'material-ui-popup-state/hooks';
import { generateGaugeOptions, generateLeaderboardOption } from "./BenchmarkOptions";



export const BenchmarkView: FC = () => {
    const benchmarks = useAppSelector(selectBenchmarks);
    const profile = useAppSelector(selectBwUserProfile);
    const selectedEfficiency = useAppSelector(selectEfficiency);
    const vessels = useAppSelector(selectVesselsByCallsign)
    // const vessel = vessels[profile?.vesselInfo?.ircs ?? ""]
    const vessel = vessels["LH2789"]


    if (!benchmarks) {
        return <></>
    }

    console.log(benchmarks)


    const time_range = ['Dag', 'Uke', 'Måned', 'År']

    const GaugeContent = (self: boolean = false) => {
        if (!selectedEfficiency) {
            return <></>
        }
        let now: string[] = [];
        let prev: string[] = [];
        filterVesselBenchmarkEnum(selectedEfficiency).forEach((id: string) => id.includes("Prev") ? prev.push(id) : now.push(id))



        return now.map((id, index) => {
            let gauge_data = calculate_benchmark(benchmarks, id as VesselBenchmarkId, prev[index] as VesselBenchmarkId, vessel.fiskeridir.id, self)
            return (
                <ReactEChart key={id} option={generateGaugeOptions(gauge_data, time_range[index], "50%")} theme={EfficiencyTheme} />
            )
        })
    }
    const Leaderboards = () => {
        if (!selectedEfficiency) {
            return <></>
        }

        let now: string[] = [];
        let prev: string[] = [];
        filterVesselBenchmarkEnum(selectedEfficiency).forEach((id: string) => id.includes("Prev") ? prev.push(id) : now.push(id))

        console.log(now,prev)
        return now.map((id, index) => {
            let bm = filterNaNs(getBenchmarkOnId(benchmarks, id as VesselBenchmarkId))
            bm = sortBenchmarksOnOutput(bm)

            let vessel_index = bm?.findIndex((value: Benchmark, _index: number) => value.vesselId === vessel.fiskeridir.id)
            console.log(vessel_index)


            return <Leaderboard key={id} title={time_range[index]} benchmarks={bm?.slice(vessel_index - 5, vessel_index + 5)} />
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
                    flex: 1
                }}
            >

                <InformationPanel >
                    <Typography variant="body2" >

                        Grunnlaget for denne målingen er basert på din landingsdata i ett gitt tidsrom sammenlignet med tidligere landingsdata i samme tidsrom. <br />
                        For eksempel: <br />
                        Hvis du har landet 1000 kg i dag og 500 kg i går, vil du få en positiv måling på Dag. <br />
                    </Typography>

                </InformationPanel>

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
                <Box sx={{ flex: 1 }}
                >
                    <InformationPanel >
                        <Typography variant="body2" >

                            Grunnlaget for denne målingen er basert på gjennomsnittets landingsdata i ett gitt tidsrom sammenlignet med tidligere landingsdata i samme tidsrom. <br />
                            For eksempel: <br />
                            Hvis gjennomsnittet har landet 1000 kg i dag og 500 kg i går, vil det være en positiv måling på Dag. <br />
                        </Typography>

                    </InformationPanel>



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
            </Box>
            <Divider textAlign="left"
                sx={{ color: "text.secondary", mb: 1, mx: 3 }} >
                <Typography variant="h3" sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                }}>Poengtavle</Typography>
            </Divider>
            <Box sx={{ flex: 1 }}>
                <InformationPanel >
                    <Typography variant="body2" >
                        Denne poengtavlen viser en list av fartøy som er sammenlignet nært deg på de forskjellige benchmarkene<br />


                    </Typography>

                </InformationPanel>



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
        </Box>
    )
}

const seriesLabel = {
    show: true
} as const;

const Leaderboard: FC<{ title: string, benchmarks: Benchmark[] }> = ({ title, benchmarks }) => {



    const vessels = useAppSelector(selectVesselsByCallsign);


    if (vessels == undefined) {
        return <></>
    }

    const names = benchmarks.map((value: Benchmark, index: number) => {
        let key = Object.values(vessels).find((vessel: any) => vessel.fiskeridir.id === value.vesselId)?.fiskeridir?.name ?? "Ukjent"
        return key
    })

    const series = {
        name: title,
        type: "bar",
        label: seriesLabel,
        data: benchmarks.map((value: Benchmark, index: number) => value.output?.toFixed(1))
    }
    // const series = benchmarks.map((value : Benchmark, index : number) => {

    // })
    if (benchmarks.length === 0) {
        return <>
            <Typography variant="h3" sx={{
                marginLeft: "auto",
                marginRight: "auto",
            }}>Ingen data</Typography>
        </>
    }
    // if (aggregateBenchmark(benchmarks) === 0) {
    //     return <>
    //         <Typography variant="h3" sx={{
    //             marginLeft: "auto",
    //             marginRight: "auto",
    //         }}>Ingen data</Typography>
    //     </>
    // }





    return <>
        <Box>
            <ReactEChart option={generateLeaderboardOption(series, title, names)} theme={EfficiencyTheme} />
        </Box>
    </>
}


const InformationPanel: FC<{ children: any }> = (props: any) => {
    const { children } = props;
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };


    return (
        <Box sx={{ position: "absolute", zIndex: 3 }}>
            <IconButton onClick={handleClick}>
                <InfoOutlined />
            </IconButton>
            {open && <Box
                sx={{
                    bgcolor: "primary.main",
                    border: "1px solid white",
                    margin: "1rem",
                    padding: "2rem",
                }}
            >

                <Typography variant="h4" sx={{}}>
                    Beskrivelse av data
                </Typography>
                {children}
            </Box>}

        </Box>)

}
