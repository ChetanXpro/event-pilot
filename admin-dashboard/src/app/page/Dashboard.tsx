import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    timestamps: [],
    totalAttempts: [],
    failedLogins: [],
  });
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/login-failures?startDate=${new Date(
          new Date().getTime() - 3600000
        ).toISOString()}&endDate=${new Date().toISOString()}`
      );
      const data = await response.json();

      if (data && data.length) {
        const timestamps = data.map(
          (d: { timestamp: string | number | Date }) =>
            new Date(d.timestamp).toISOString()
        );
        const totalAttempts = data.map(
          (d: { totalAttempts: any }) => d.totalAttempts
        );
        const failedLogins = data.map(
          (d: { failedLogins: any }) => d.failedLogins
        );

        setChartData({ timestamps, totalAttempts, failedLogins });
      } else {
        console.log("No data received", data);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("loginChart");
    if (canvas && chartData.timestamps.length > 0) {
      if (chartRef.current) {
        (chartRef.current as Chart).destroy();
      }

      const ctx = (canvas as HTMLCanvasElement).getContext("2d");
      if (!ctx) {
        return;
      }
      const newChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.timestamps,
          datasets: [
            {
              label: "Total Attempts",
              data: chartData.totalAttempts,
              borderColor: "blue",
              fill: false,
            },
            {
              label: "Failed Logins",
              data: chartData.failedLogins,
              borderColor: "red",
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "time",
              time: {
                unit: "minute",
                tooltipFormat: "PPpp",
                displayFormats: {
                  minute: "h:mm a",
                },
              },
              title: {
                display: true,
                text: "Time",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Count",
              },
            },
          },
        },
      });
      chartRef.current = newChart as any;
    }
  }, [chartData]);

  return (
    <div className="p-4">
      <canvas id="loginChart" className="w-full h-64"></canvas>
    </div>
  );
};

export default Dashboard;
