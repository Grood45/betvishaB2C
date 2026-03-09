import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const ModernChart = ({ type, data, labels, title, height = "350px", onClick }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);
            if (onClick) {
                chartInstance.current.off('click'); // remove old
                chartInstance.current.on('click', function (params) {
                    onClick(params);
                });
            }
        }

        const getOption = () => {
            // Common configuration
            const common = {
                tooltip: {
                    trigger: type === 'pie' ? 'item' : 'axis',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    textStyle: { color: '#333' },
                    borderWidth: 0,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    padding: 12,
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
            };

            if (type === "rose") {
                return {
                    ...common,
                    legend: {
                        top: 'bottom'
                    },
                    series: [
                        {
                            name: 'Distribution',
                            type: 'pie',
                            radius: [20, 100],
                            center: ['50%', '50%'],
                            roseType: 'area', // Nightingale Rose Chart
                            itemStyle: {
                                borderRadius: 8,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: true,
                                formatter: '{b}'
                            },
                            data: data
                        }
                    ]
                };
            }

            if (type === "bar") {
                return {
                    ...common,
                    xAxis: {
                        type: 'category',
                        data: labels,
                        axisTick: { show: false },
                        axisLine: { show: false },
                        axisLabel: { color: '#666' }
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: {
                            lineStyle: { type: 'dashed', color: '#eee' }
                        }
                    },
                    series: [
                        {
                            data: data,
                            type: 'bar',
                            showBackground: true,
                            backgroundStyle: {
                                color: 'rgba(180, 180, 180, 0.1)',
                                borderRadius: [5, 5, 0, 0]
                            },
                            itemStyle: {
                                borderRadius: [5, 5, 0, 0],
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#3b82f6' }, // Blue
                                    { offset: 1, color: '#60a5fa' }
                                ])
                            },
                            emphasis: {
                                itemStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: '#2563eb' },
                                        { offset: 1, color: '#3b82f6' }
                                    ])
                                }
                            },
                            animationDelay: (idx) => idx * 10
                        }
                    ]
                };
            }

            if (type === "gradient-bar-green") {
                return {
                    ...common,
                    xAxis: {
                        type: 'category',
                        data: labels,
                        axisTick: { show: false },
                        axisLine: { show: false },
                        axisLabel: { color: '#666' }
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: {
                            lineStyle: { type: 'dashed', color: '#eee' }
                        }
                    },
                    series: [
                        {
                            data: data,
                            type: 'bar',
                            showBackground: true,
                            backgroundStyle: {
                                color: 'rgba(180, 180, 180, 0.1)',
                                borderRadius: [5, 5, 0, 0]
                            },
                            itemStyle: {
                                borderRadius: [5, 5, 0, 0],
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#22c55e' }, // Green
                                    { offset: 1, color: '#4ade80' }
                                ])
                            },
                            animationDelay: (idx) => idx * 10
                        }
                    ]
                };
            }

            if (type === "line") {
                return {
                    ...common,
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: labels,
                        axisTick: { show: false },
                        axisLine: { show: false },
                        axisLabel: { color: '#666' }
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: {
                            lineStyle: { type: 'dashed', color: '#eee' }
                        }
                    },
                    series: [
                        {
                            data: data,
                            type: 'line',
                            smooth: true,
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: 'rgba(59, 130, 246, 0.5)' },
                                    { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
                                ])
                            },
                            itemStyle: { color: '#3b82f6' },
                            lineStyle: { width: 4, shadowColor: 'rgba(59, 130, 246, 0.3)', shadowBlur: 10, shadowOffsetY: 5 }
                        }
                    ]
                };
            }

            return {};
        };

        chartInstance.current.setOption(getOption());

        const handleResize = () => {
            chartInstance.current.resize();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chartInstance.current.dispose();
        };
    }, [type, data, labels, title]);

    return <div ref={chartRef} style={{ height: height, width: "100%" }} />;
};

export default ModernChart;
