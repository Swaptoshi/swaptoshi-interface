import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import './BarChart.css';
import { bitcoinPrices } from "../fakePrices";

const BarChart = () => {
    const [data, setData] = useState({ prices: [] });
    const [minInputValue, setMinInputValue] = useState("");
    const [maxInputValue, setMaxInputValue] = useState("");


    useEffect(() => {
        const prices = bitcoinPrices;
        const minPrice = Math.min(...prices).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const maxPrice = Math.max(...prices).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setMinInputValue(minPrice);
        setMaxInputValue(maxPrice);
        setData({ prices });
    }, []);

    // Inside your component
    const chartStyle = {
        color: "#FF0000", // Set the color to red (#FF0000)
    };

    const options = {
        chart: {
            type: "bar",
            height: 350,
            background: "transparent",
            color: "#FBDE8E"
        },
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            labels: {
                show: false
            }
        },
        yaxis: {
            show: false
        },
        zoom: {
            enabled: true,
            type: "x",
            autoScaleYaxis: true,
            zoomedArea: {
                fill: {
                    color: "#90CAF9",
                    opacity: 0.4
                },
                stroke: {
                    color: "#0D47A1",
                    opacity: 0.4
                }
            },
            zoomIn: {

                fill: "#1565C0",
                stroke: "#0D47A1"
            },
            zoomOut: {
                fill: "#90CAF9",
                stroke: "#0D47A1"
            },
            toolbar: {
                autoSelected: "zoom"
            }
        },
        noData: {
            text: "Loading..."
        },
        grid: {
            show: false
        }
    };

    return (
        <React.Fragment>
            <div style={chartStyle}>
                <ReactApexChart
                    options={options}
                    series={[{ name: "Bitcoin Price (USD)", data: data.prices }]}
                    type="bar"
                    height={350}
                />
            </div>


        </React.Fragment>
    );
};

export default BarChart;

