// components/HighchartsChart.js
"use client";
import React, { useEffect } from "react";
import Highcharts from "highcharts";
import { useTranslation } from "react-i18next";

const Chart = () => {
const { t, i18n } = useTranslation();

  useEffect(() => {
    // Highcharts configuration options
    // @ts-ignore
    const options = {
      chart: {
        type: "areaspline",
        backgroundColor: "none",
        color: "black",
      },
      title: {
        text: `${t(`Deposit`)} and ${t(`Withdraw`)}  `,
        align: "left",
        style: {
          color: "black",
        },
      },
      subtitle: {
        text: 'Source: <a href="https://www.ssb.no/jord-skog-jakt-og-fiskeri/jakt" target="_blank">SSB</a>',
        align: "left",

        style: {
          color: "black",
        },
      },
      xAxis: {
        plotBands: [
          {
            // Highlight the two last years
            from: 2019,
            to: 2024,
          },
        ],

        labels: {
          style: {
            color: "black", // Set X-axis label text color to black
          },
        },
      },
      yAxis: {
        title: {
          text: `${t(`Amount`)}`,
          color: "black",
        },
        style: {
          color: "black",
        },
        labels: {
          style: {
            color: "black", // Set X-axis label text color to black
          },
        },
      },
      tooltip: {
        shared: true,
        headerFormat: "<b>Hunting season starting autumn {point.x}</b><br>",
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        
        series: {
          pointStart: 2010,
          dataLabels: {
            style: {
              color: 'black' // Set series name text color to black
            }
          }
        },
        areaspline: {
          fillOpacity: 0.5,
        },
      },
      series: [
        {
          name: `${t(`Deposit`)}`,
          data: [
            38000, 37300, 37892, 38564, 36770, 36026, 34978, 35657, 35620,
            35971, 36409, 36435, 34643, 34956, 33199, 31136, 30835, 31611,
            30666, 30319, 31766,
          ],
          color: "green", // Set the color for Deposit data
          dataLabels: {
            style: {
              color: "black", // Set series name text color to black
            },
          },
        },
        {
          name:  `${t(`withdraw`)}`,
          data: [
            22534, 23599, 24533, 25195, 25896, 27635, 29173, 32646, 35686,
            37709, 39143, 36829, 35031, 36202, 35140, 33718, 37773, 42556,
            43820, 46445, 50048,
          ],
          dataLabels: {
            style: {
              color: "black", // Set series name text color to black
            },
          },
          color: "red", // Set the color for Withdraw data
        },
      ],
    };

    // Render the chart using the 'container' div
     // @ts-ignore
    Highcharts.chart("container", options);
  }, []);

  return <div id="container" style={{ width: "100%", height: "100%" }}></div>;
};

export default Chart;
