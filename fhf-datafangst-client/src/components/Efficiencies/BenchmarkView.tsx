


import ReactEChart from "echarts-for-react";
import { FC, useRef } from "react";
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



export const BenchmarkView: FC = () => {

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
                <ReactEChart option={generateGaugeOptions(53, "Dag",  "50%")} theme={EfficiencyTheme} />
                <ReactEChart option={generateGaugeOptions(49, "Uke", "50%")} theme={EfficiencyTheme} />
                <ReactEChart option={generateGaugeOptions(49, "Måned", "50%")} theme={EfficiencyTheme} />
                <ReactEChart option={generateGaugeOptions(48, "År", "50%")} theme={EfficiencyTheme} />

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

                    <ReactEChart option={generateGaugeOptions(52, "Dag", "50%")} theme={EfficiencyTheme} />
                    <ReactEChart option={generateGaugeOptions(44, "Uke", "50%")} theme={EfficiencyTheme} />
                    <ReactEChart option={generateGaugeOptions(44, "Måned", "50%")} theme={EfficiencyTheme} />
                    <ReactEChart option={generateGaugeOptions(45, "År", "50%")} theme={EfficiencyTheme} />
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


            <EfficiencyLeaderboard title={"Dag"}/>
            <EfficiencyLeaderboard title={"Uke"}/>
            <EfficiencyLeaderboard title={"Måned"}/>
            <EfficiencyLeaderboard title={"År"}/>
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
                    // color : data > 0 ? "green" : "red",
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
                    width: data.toString() + "%",
                    height: 4,
                    fontSize: 10,
                            offsetCenter: [0, '15%'],
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