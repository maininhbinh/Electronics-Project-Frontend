
import Chart from "react-apexcharts";

const Piechart = ({color}: {color: string}) => {
    const chartConfig = {
        type: "pie",
        height: 250,
        series: [50, 100, 60],
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          labels: ['Iphone', 'Samsung', 'realme', 'Xiaomi'],
          title: {
            show: "",
          },
          dataLabels: {
            enabled: true,
            formatter: (val: number) => `${Math.ceil(val)}%`,
            dropShadow: {
                enabled: true,
                top: 1,
                left: 1,
                blur: 1,
                opacity: 0.75,
            },
        },
          colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFB6C1', '#FFD700', '#98CFC8', '#FF6347', '#6A5ACD', '#20B2AA', '#87CEEB', '#FF1493', '#00CED1', '#F5F5DC', '#DDA0DD', '#F08080', '#C71585', '#4682B4', '#FF4500', '#DAA520', '#8A2BE2', '#FF69B4', '#32CD32', '#FF8C00', '#8B4513', '#A0522D', '#D3D3D3', '#F5FFFA', '#FFC0CB', '#FF6347', '#6B8E23', '#8A2BE2', '#00FFFF', '#F5DEB3', '#FFE4C4', '#8B0000', '#E6E6FA', '#D8BFD8', '#FFB6C1', '#FFE4E1', '#F0E68C', '#E0FFFF', '#B0E57C', '#6A5ACD', '#D2691E', '#FF00FF'],
          plotOptions: {
            bar: {
              columnWidth: "20%",
              borderRadius: 2,
            },
          },
          xaxis: {
            axisTicks: {
              show: false,
            },
            axisBorder: {
              show: false,
            },
            labels: {
              show: true,
              style: {
                colors: "white",
                fontSize: "12px",
                fontFamily: "inherit",
                fontWeight: 700,
              },
            },
            categories: [
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
          },
          yaxis: {
            labels: {
              show: false,
              style: {
                colors: "white",
                fontSize: "12px",
                fontFamily: "inherit",
                fontWeight: 700,
              },
            },
          },
          grid: {
            show: false,
            borderColor: "#dddddd",
            strokeDashArray: 5,
            xaxis: {
              lines: {
                show: false,
              },
            },
            padding: {
              left: 0,
              bottom: 10
            },
          },
          fill: {
            opacity: 0.8,
          },
          tooltip: {
            theme: "dark",
          },
        },
    };

    return (
        <>
            <Chart {...chartConfig} />
        </>
    );
}

export default Piechart