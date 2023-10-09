
export const generateLeaderboardOption = (series: any, title: string, vessels: any) => {

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
            data: vessels,
            axisLabel: {
                formatter: '{value}',
                margin: 20,
            }
        },
        series: series
    };

}


export const generateGaugeOptions = (data: number, title: string, detail: string) => {

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

