// pages/dashboard.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (startDate > endDate) {
      alert("Start date must be before end date");
      return;
    }

    axios
      .get(
        `/api/login-failures?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      )
      .then((response) => {
        const data = response.data;
        const timestamps = data.map((item: any) =>
          new Date(item.timestamp).toLocaleString()
        );
        const failureRates = data.map((item: any) => item.failureRate);

        setChartData({
          labels: timestamps,
          datasets: [
            {
              label: "Failure Rate",
              data: failureRates,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [startDate, endDate]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Login Failure Rate Dashboard</h1>
      <div className="mb-4">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date!)}
        />
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date!)} />
      </div>
      {chartData.labels.length > 0 ? (
        <Line
          data={chartData}
          options={{ scales: { y: { beginAtZero: true } } }}
        />
      ) : (
        <p>No data to display.</p>
      )}
    </div>
  );
};

export default Dashboard;
