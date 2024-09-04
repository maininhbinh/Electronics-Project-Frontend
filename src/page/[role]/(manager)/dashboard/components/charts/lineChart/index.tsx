import { VND } from "@/utils/formatVietNamCurrency";
import Chart from "react-apexcharts";
 
export default function LineChart({data}: {data: Array<any>}) {
  
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const values = data ? hours.map(hour => {
    const item = data.find(d => `${d.hour}:00` === hour);
    return item ? item.total_value : 0;
  }) : []

  
  const chartConfig = {
    type: "area",
    height: 300,
    series: [
      {
        name: 'Giá',
        data: values,
        color: '#17c1e8',
        
      }
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      colors: ['#17c1e8'],
      stroke: { width: 2, curve: "smooth" },
      markers: {
        size: 0,
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
            colors: "",
            fontSize: "",
            fontFamily: "",
            fontWeight: 700,
          },
        },
        categories: [
          "1:00 AM",
          "1:00 AM",
          "3:00 AM",
          "4:00 AM",
          "5:00 AM",
          "6:00 AM",
          "7:00 AM",
          "8:00 AM",
          "9:00 AM",
          "10:00 AM",
          "11:00 AM",
          "12:00 PM",
          "13:00 PM",
          "14:00 PM",
          "15:00 PM",
          "16:00 PM",
          "17:00 PM",
          "18:00 PM",
          "19:00 PM",
          "20:00 PM",
          "21:00 PM",
          "22:00 PM",
          "23:00 PM",
          "24:00 PM",
        ],
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            colors: "",
            fontSize: "12px",
            fontFamily: "",
            fontWeight: 0,
          },
          formatter: (value) => `${VND(value)}`, // Hiển thị giá trị dưới dạng tiền tệ
        },
        // min: 5,
        // max: 500
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 3,
        
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          left: 15,
          bottom: 0
        },
      },
      fill: {
        type: 'gradient', // Sử dụng gradient color
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        }
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (value) => `${VND(value)}`, // Hiển thị giá trị dưới dạng tiền tệ trên tooltip
        },
      },
      legend: {
        show: false,
        position: 'top',
        horizontalAlign: 'right',
      }
    },
  };
  return (
    <Chart {...chartConfig} />
  );
}