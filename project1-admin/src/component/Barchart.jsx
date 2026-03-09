import React, { useEffect } from "react";
import * as echarts from "echarts";
import { useTranslation } from "react-i18next";

const Barchart = ({ title, data, deposits, loseBet, winBet, profitLoss, withdrawals, type, width, height, id, labels }) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Create the echarts instance
    var myChart = echarts.init(document.getElementById(`${id}`));
    const currentMonthIndex = new Date().getMonth();
    const months = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const dynamicMonths = months.slice(currentMonthIndex).concat(months.slice(0, currentMonthIndex));

    const xAxisData = labels && labels.length > 0 ? labels : (type === "bar" ? dynamicMonths : []);

    // Draw the chart
    myChart.setOption({
      title: {
        text: title,
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#374151'
        },
        left: 'center',
        top: 5
      },
      legend: {
        bottom: 0,
        show: (deposits && withdrawals) ? true : false,
        textStyle: {
          color: '#6b7280'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: title ? '10%' : '5%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 0,
        padding: [12, 16],
        textStyle: {
          color: '#1f2937'
        },
        extraCssText: 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border-radius: 12px;',
        formatter: function (params) {
          let res = `<div style="font-weight: 700; margin-bottom: 8px; font-size: 14px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">${params[0].name}</div>`;
          params.forEach(item => {
            res += `<div style="display:flex; align-items:center; justify-content:space-between; gap:20px; margin-top: 6px;">
              <span style="font-size: 12px; color: #4b5563;"><span style="display:inline-block;margin-right:8px;border-radius:50%;width:8px;height:8px;background-color:${item.color.colorStops ? item.color.colorStops[0].color : item.color};"></span>${item.seriesName}</span>
              <span style="font-weight:700; font-size: 13px;">₹${item.value.toLocaleString()}</span>
            </div>`;
          });
          return res;
        }
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLine: {
          show: false // cleaner look
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#9ca3af',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif',
          interval: labels?.length > 15 ? 'auto' : 0,
          rotate: labels?.length > 10 ? 30 : 0,
          padding: [10, 0, 0, 0]
        }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#f3f4f6'
          }
        },
        axisLabel: {
          color: '#9ca3af',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif',
          formatter: (value) => value >= 1000 ? (value / 1000) + 'k' : value
        }
      },
      series: [
        ...(deposits
          ? [
            {
              name: "Deposit",
              type: type,
              barMaxWidth: 12,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#22c55e' },
                  { offset: 1, color: '#16a34a' }
                ]),
                borderRadius: [4, 4, 4, 4]
              },
              data: deposits,
              showBackground: true,
              backgroundStyle: {
                color: '#f9fafb',
                borderRadius: [4, 4, 4, 4]
              }
            },
          ]
          : []),
        ...(withdrawals
          ? [
            {
              name: "Withdrawal",
              type: type,
              barMaxWidth: 12,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#ef4444' },
                  { offset: 1, color: '#dc2626' }
                ]),
                borderRadius: [4, 4, 4, 4]
              },
              data: withdrawals,
              showBackground: true,
              backgroundStyle: {
                color: '#f9fafb',
                borderRadius: [4, 4, 4, 4]
              }
            },
          ]
          : []),
        ...(loseBet
          ? [
            {
              name: "Lose Bet",
              type: type,
              itemStyle: { color: "#ef4444" },
              data: loseBet,
            },
          ]
          : []),
        ...(winBet
          ? [
            {
              name: "Win Bet",
              type: type,
              itemStyle: { color: "#22c55e" },
              data: winBet,
            },
          ]
          : []),
        ...(profitLoss
          ? [
            {
              name: "Profit/Loss",
              type: type,
              itemStyle: { color: "#3b82f6" },
              data: profitLoss,
            },
          ]
          : []),
        ...(data
          ? [
            {
              name: 'Layer Overview',
              type: 'pie',
              radius: ['45%', '75%'], // Donut style
              center: ['50%', '55%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: 'bold',
                  formatter: '{b}\n{c}'
                },
                scale: true,
                scaleSize: 10,
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.2)'
                }
              },
              label: {
                show: false, // Clean look by default
                position: 'center'
              },
              labelLine: {
                show: false
              },
              data: data?.map(item => ({ value: item.value, name: t(item.name) })),
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            },
          ]
          : []),
      ],
      responsive: true,
    });

    // Handle resize
    const handleResize = () => {
      myChart.resize();
    };
    window.addEventListener("resize", handleResize);

    // Clean up function
    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, [title, data, deposits, loseBet, winBet, profitLoss, withdrawals, type, id, labels]);

  return (
    <div
      id={`${id}`}
      style={{
        height: height || "350px",
        width: width || "100%",
      }}
    ></div>
  );
};

export default Barchart
